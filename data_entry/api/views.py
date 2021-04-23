from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.fields import NullBooleanField
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, QueryDict
from .serializers import APICacheSerializer, CollectionSerializer, ScheduleSerializer, ScheduleCollectionSerializer
from .models import APICache, Collection, Schedule
from rest_framework import status
import os
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import Permission
from django.shortcuts import get_object_or_404
from accounts.models import CustomUser
from django.utils import timezone

from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from os.path import join, dirname
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError
import requests
from datetime import timedelta
from django.db import models, connection
# from django.http.request import QueryDict




cur_path = dirname(__file__)
root_path = cur_path[:cur_path.rfind(os.path.sep)]
load_dotenv(join(root_path, '.env'))
x_rapidapi_key = os.environ.get('X_RAPIDAPI_KEY')
x_rapidapi_host = os.environ.get('X_RAPIDAPI_HOST')
use_query_string = os.environ.get('USE_QUERY_STRING')
cache_time = int(os.environ.get('CACHE_TIME'))
pre_time = int(os.environ.get('PRE_TIME'))
rapidapi_headers = { 
    'x-rapidapi-key': x_rapidapi_key,
    'x-rapidapi-host': x_rapidapi_host,
    'useQueryString': use_query_string,
  }; 


class APICacheView(APIView):
    def put(self, request, format=None):
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, format=None):
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, *args, **kwargs):
        query = request.GET["query"]
        now = timezone.now()
        data = APICache.objects.filter(query = query)
        if not "force" in request.GET and len(data) > 0 and now - data[0].last_updated <= timedelta(minutes=cache_time):
            serializer = APICacheSerializer(data, many=True)
            return Response(serializer.data)
        
        res = requests.get('https://therundown-therundown-v1.p.rapidapi.com/' + query, headers = rapidapi_headers)
        api_cache, created = APICache.objects.update_or_create(
            query=query,
            defaults={"data": res.content.decode("utf-8")},
        )
        data = APICache.objects.filter(query = query)
        serializer = APICacheSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = APICacheSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class CollectionView(APIView):
    def put(self, request, format=None):        
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, format=None):
        Collection.objects.filter(id=request.GET["id"]).delete()
        posts = Collection.objects.all()
        serializer = CollectionSerializer(posts, many=True)
        return Response(serializer.data)
        # return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, *args, **kwargs):
        if "get_freeform_data" in request.GET :
            table_name = "col_" + request.GET["name"]
            field_name = request.GET["field"]
            sql = "SELECT DISTINCT `" + field_name + "` FROM `" + table_name + "` ORDER BY `" + field_name + "`"
            with connection.cursor() as cursor:
                cursor.execute(sql)
                data = [row[0] for row in cursor.fetchall()]
                return Response({"res": "::".join(data)})
        else:
            posts = ""
            if "name" in request.GET :
                posts = Collection.objects.filter(name = request.GET["name"])
            else:
                posts = Collection.objects.all()
            serializer = CollectionSerializer(posts, many=True)
            return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        req = request.data
        table_name = "col_" + req["name"]
        if "save_collected_data" in req:
            event_id = req["event_id"]            
            sql = "SELECT COUNT(*) FROM `" + table_name + "` WHERE event_id='" + event_id + "'"
            with connection.cursor() as cursor:
                cursor.execute(sql)
                row = cursor.fetchone()
                now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
                if (row[0] > 0):
                    sql = "UPDATE `" + table_name + "` SET "
                    for field in req:
                        if field != "name" and field != "event_id" and field != "save_collected_data":
                            sql += field + "=" + req[field] + ", "
                    sql += "col_dt='" + now + "' WHERE event_id='" + event_id + "'"
                else:
                    sql = "INSERT INTO `" + table_name + "` "
                    field_names = ""
                    field_values = ""
                    for field in req:
                        if field != "name" and field != "save_collected_data":
                            field_names += field + ", "
                            if field == "event_id":
                                field_values += "'" + req[field] + "', "
                            else:
                                field_values += req[field] + ", "
                    sql += "(" + field_names + "col_dt) VALUES (" + field_values + "'" + now + "')"
                print("sql = ", sql)
                with connection.cursor() as cursor_2:
                    return Response({"res": cursor_2.execute(sql)})
        else:
            posts_serializer = CollectionSerializer(data=request.data)
            if posts_serializer.is_valid():
                posts_serializer.save()        
                field_names = str(req["field_names"]).split("::")
                field_types = str(req["field_types"]).split("::")
                sql = "CREATE TABLE `" + table_name + "` (`event_id` VARCHAR(255) NOT NULL, "
                for (name, type) in zip(field_names, field_types):
                    sql += "`" + name + "` "
                    if type == "numeric":
                        sql += "FLOAT(11) NOT NULL, "
                    else:
                        sql += "VARCHAR(255) NOT NULL, "
                sql += "`col_dt` DATETIME NOT NULL, PRIMARY KEY (`event_id`) ); "
                with connection.cursor() as cursor:
                    try:
                        cursor.execute(sql)
                        return Response({"res": "success"})
                    except:
                        return Response({"res": "fail"})
            else:
                print('error', posts_serializer.errors)
                return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class ScheduleView(APIView):
    def put(self, request, format=None):  
        instance = get_object_or_404(Schedule.objects.all(), id=request.data["id"])
        serializer = ScheduleCollectionSerializer(instance, data=request.data)

        # validate and update
        if serializer.is_valid():
            serializer.save()
            serializer_dict = serializer.data
            serializer_dict["message"] = "Schedule updated successfully."
            print(serializer_dict)
            return Response(serializer_dict, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)      
        # return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, format=None):
        Schedule.objects.filter(id=request.GET["id"]).delete()
        posts = Schedule.objects.all()
        serializer = ScheduleSerializer(posts, many=True)
        return Response(serializer.data)
        # return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, *args, **kwargs):
        print([i for i in request.GET])
        posts = ""
        if "name" in request.GET :
            posts = Schedule.objects.filter(name = request.GET["name"])
        else:
            posts = Schedule.objects.select_related('collection').all()
        serializer = ScheduleCollectionSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # queryDict = request.data
        # # myDict = dict(queryDict.iterlists())
        # myDict = dict(request.POST.lists())
        # # myDict = { key: queryDict.getlist(key) for key in queryDict.fromkeys()}
        # print("#"*50, myDict['collection'])
        # myDict["collection"] = id = int(myDict["collection"][0])
        # if myDict["active"][0] == "1":
        #     myDict["active"] = True
        # else:
        #     myDict["active"] = False
        # myDict["weekdays"] = myDict["weekdays"][0]
        # myDict["time_ranges"] = myDict["time_ranges"][0]


        # query_dict = QueryDict('', mutable=True)
        # query_dict.update(myDict)
        # posts_serializer = ScheduleSerializer(data=query_dict)
        posts_serializer = ScheduleSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response({"res": "OK"})
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
# def aws_session(region_name='us-east-1'):
#     return boto3.session.Session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#                                 aws_secret_access_key=os.getenv('AWS_ACCESS_KEY_SECRET'),
#                                 region_name=region_name)


# def upload_file_to_bucket(file_path, folder_name):
#     session = aws_session()
#     s3_resource = session.resource('s3')
#     file_dir, file_name = os.path.split(file_path)

#     bucket = s3_resource.Bucket(s3_bucket)
#     bucket.upload_file(
#       Filename=file_path,
#       Key=folder_name + "/" + file_name,
#       ExtraArgs={'ACL': 'public-read'}
#     )

#     s3_url = f"https://{s3_bucket}.s3.amazonaws.com/{file_name}"
#     return s3_url


# def delete_folder_from_bucket(folder_name):
#     s3_client = boto3.client('s3')
#     PREFIX = folder_name + '/'
#     response = s3_client.list_objects_v2(Bucket=s3_bucket, Prefix=PREFIX)

#     for object in response['Contents']:
#         print('Deleting', object['Key'])
#         s3_client.delete_object(Bucket=s3_bucket, Key=object['Key'])                                

# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_dealerships(request):
#     user_id = request.user.id
#     permissions = Permission.objects.filter(user=user_id)
#     print([p for p in permissions])
#     user = get_object_or_404(CustomUser, pk=user_id)
#     # if user.has_perm("auth.add_permission"): 
#     #     print("True")
#     # else:
#     #     print("False")
#     # if user.has_perm("auth.change_permission"): 
#     #     print("True")
#     # else:
#     #     print("False")
#     dealerships = ""
#     dealership_name = request.GET.get("name", "")
#     print([i for i in request.GET.items()])
#     print("##" + dealership_name + "##")
#     if dealership_name == "":
#         dealerships = Dealership.objects.all()
#     else:
#         dealerships = Dealership.objects.filter(name=dealership_name)
    
#     serializer = DealershipSerializer(dealerships, many=True)
#     return JsonResponse({'dealerships': serializer.data}, safe=False, status=status.HTTP_200_OK)


# @api_view(["GET"])
# # @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_claim_types(request):
#     claim_types = ClaimType.objects.all()
    
#     serializer = ClaimTypeSerializer(claim_types, many=True)
#     return JsonResponse({'claim_types': serializer.data}, safe=False, status=status.HTTP_200_OK) 


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_submission_types(request):
#     submission_types = SubmissionType.objects.all()
    
#     serializer = SubmissionTypeSerializer(submission_types, many=True)
#     return JsonResponse({'submission_types': serializer.data}, safe=False, status=status.HTTP_200_OK) 


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_service_advisors(request):
#     service_advisor = ServiceAdvisor.objects.all()
    
#     serializer = ServiceAdvisorSerializer(service_advisor, many=True)
#     return JsonResponse({'service_advisor': serializer.data}, safe=False, status=status.HTTP_200_OK) 


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_technicians(request):
#     technicians = Technician.objects.all()
    
#     serializer = TechnicianSerializer(technicians, many=True)
#     return JsonResponse({'technicians': serializer.data}, safe=False, status=status.HTTP_200_OK)         


# @api_view(["POST"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def add_claim(request):
#     try:
#         dealership = Claim.objects.create(
#             repair_order=request.POST["repair_order"],
#             pdf=request.POST["pdf"],
#             dealership = Dealership.objects.filter(name=request.POST["dealership"]).first(),
#             claim_type = ClaimType.objects.filter(name=request.POST["claim_type"]).first(),
#             submission_type = SubmissionType.objects.filter(name=request.POST["submission_type"]).first(),
#             service_advisor = ServiceAdvisor.objects.filter(name=request.POST["service_advisor"]).first(),
#             technician = Technician.objects.filter(name=request.POST["technician"]).first(),
#             upload_date = datetime.now()
#         )
#         serializer = ClaimSerializer(dealership)
#         return JsonResponse({'claims': serializer.data}, safe=False, status=status.HTTP_201_CREATED)
#     except ObjectDoesNotExist as e:
#         return JsonResponse({'error': str(e)}, safe=False, status=status.HTTP_404_NOT_FOUND)
#     except Exception as err:
#         print(err)
#         return JsonResponse({'error': 'Something terrible went wrong'}, safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_claims(request):
#     claims = Claim.objects.all()
    
#     serializer = ClaimSerializer(claims, many=True)
#     return JsonResponse({'claims': serializer.data}, safe=False, status=status.HTTP_200_OK)           


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_claim(request, claim_id):
#     claims = Claim.objects.filter(id=claim_id)
    
#     serializer = ClaimSerializer(claims, many=True)
#     return JsonResponse({'claims': serializer.data}, safe=False, status=status.HTTP_200_OK)


# @api_view(["GET"])
# @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def get_claims_dealership(request, dealership_name):
#     claims = Claim.objects.filter(dealership=dealership_name)
    
#     serializer = ClaimSerializer(claims, many=True)
#     return JsonResponse({'claims': serializer.data}, safe=False, status=status.HTTP_200_OK)    



                          


# @api_view(["GET"])
# # @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def add_collection(request):
#     collection_name = request.GET["collection"]
#     field_names = request.GET.getlist("field_name[]")
#     field_types = request.GET.getlist("field_type[]")
#     sql = "CREATE TABLE `" + "col_" + collection_name + "` (`event_id` VARCHAR(255) NOT NULL, "
#     for (name, type) in zip(field_names, field_types):
#         sql += "`" + name + "` "
#         if type == "numeric":
#             sql += "FLOAT(11) NOT NULL, "
#         else:
#             sql += "VARCHAR(255) NOT NULL, "
#     sql += "PRIMARY KEY (`event_id`) ); "
#     print(sql)
#     with connection.cursor() as cursor:
#         try:
#             cursor.execute(sql)
#             return Response({"res": "success"})
#         except:
#             return Response({"res": "fail"})
     