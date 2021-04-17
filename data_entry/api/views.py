from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.fields import NullBooleanField
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .serializers import ClaimTypeSerializer, SubmissionTypeSerializer, ServiceAdvisorSerializer, TechnicianSerializer, APICacheSerializer
from .models import ClaimType, Dealership, SubmissionType, ServiceAdvisor, Technician, APICache
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



cur_path = dirname(__file__)
root_path = cur_path[:cur_path.rfind(os.path.sep)]
load_dotenv(join(root_path, '.env'))
x_rapidapi_key = os.environ.get('X_RAPIDAPI_KEY')
x_rapidapi_host = os.environ.get('X_RAPIDAPI_HOST')
use_query_string = os.environ.get('USE_QUERY_STRING')
cache_time = int(os.environ.get('CACHE_TIME'))
rapidapi_headers = { 
    'x-rapidapi-key': x_rapidapi_key,
    'x-rapidapi-host': x_rapidapi_host,
    'useQueryString': use_query_string,
  }; 
print("x_rapidapi_key = ", x_rapidapi_key)
print("x_rapidapi_host = ", x_rapidapi_host)
print("use_query_string = ", use_query_string)
print("cache_time = ", cache_time)
print("rapidapi_headers = ", rapidapi_headers)
# print('s3_bucekt = ', s3_bucket)


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


@api_view(["GET"])
# @csrf_exempt
# @permission_classes([IsAuthenticated])
def get_claim_types(request):
    claim_types = ClaimType.objects.all()
    
    serializer = ClaimTypeSerializer(claim_types, many=True)
    return JsonResponse({'claim_types': serializer.data}, safe=False, status=status.HTTP_200_OK) 


@api_view(["GET"])
@csrf_exempt
# @permission_classes([IsAuthenticated])
def get_submission_types(request):
    submission_types = SubmissionType.objects.all()
    
    serializer = SubmissionTypeSerializer(submission_types, many=True)
    return JsonResponse({'submission_types': serializer.data}, safe=False, status=status.HTTP_200_OK) 


@api_view(["GET"])
@csrf_exempt
# @permission_classes([IsAuthenticated])
def get_service_advisors(request):
    service_advisor = ServiceAdvisor.objects.all()
    
    serializer = ServiceAdvisorSerializer(service_advisor, many=True)
    return JsonResponse({'service_advisor': serializer.data}, safe=False, status=status.HTTP_200_OK) 


@api_view(["GET"])
@csrf_exempt
# @permission_classes([IsAuthenticated])
def get_technicians(request):
    technicians = Technician.objects.all()
    
    serializer = TechnicianSerializer(technicians, many=True)
    return JsonResponse({'technicians': serializer.data}, safe=False, status=status.HTTP_200_OK)         


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


class PdfUploadParser(FileUploadParser):
    media_type = 'pdf/*'
# class ClaimView(APIView):
#     parser_class = (PdfUploadParser,)

#     def put(self, request, format=None):
#         if 'file' not in request.data:
#             raise ParseError("Empty content")

#         f = request.data['file']

#         Claim.pdf.save(f.name, f, save=True)
#         return Response(status=status.HTTP_201_CREATED)

#     def delete(self, request, format=None):
#         Claim.pdf.delete(save=True)
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     # parser_classes = (MultiPartParser, FormParser)

#     def get(self, request, *args, **kwargs):
#         print([i for i in request.GET])
#         posts = ""
#         if "dealership" in request.GET :
#             posts = Claim.objects.filter(dealership = request.GET["dealership"])
#         else:
#             posts = Claim.objects.all()
#         serializer = ClaimSerializer(posts, many=True)
#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         posts_serializer = ClaimSerializer(data=request.data)
#         if posts_serializer.is_valid():
#             posts_serializer.save()
#             print(posts_serializer.data["pdf"])
#             pdf = posts_serializer.data["pdf"]
#             pdf = pdf[pdf.rfind("/")+1:]
#             print(pdf)

#             # Upload to S3 Bucket
#             file_path = join(root_path, pdf)
#             print("#"*50)
#             print(os.path.sep)
#             print(root_path, file_path)
#             print(str(file_path.rfind(os.path.sep)))
#             file_name = file_path[file_path.rfind(os.path.sep) + 1:]
#             print(file_name)
#             print(s3_bucket, file_path, posts_serializer.data["dealership"] + "/" + file_name)
#             try:
#                 upload_file_to_bucket(s3_bucket, file_path, posts_serializer.data["dealership"] + "/" + file_name)
#             except :
#                 print("Upload error")
#             return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             print('error', posts_serializer.errors)
#             return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APICacheView(APIView):
    def put(self, request, format=None):
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, format=None):
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, *args, **kwargs):
        query = request.GET["query"]
        now = timezone.now()
        data = APICache.objects.filter(query = query)
        if len(data) > 0 and now - data[0].last_updated <= timedelta(minutes=cache_time):
            serializer = APICacheSerializer(data, many=True)
            return Response(serializer.data)
        
        res = requests.get('https://therundown-therundown-v1.p.rapidapi.com/' + query, headers = rapidapi_headers)
        api_cache, created = APICache.objects.update_or_create(
            query=query,
            defaults={"data": data.content.decode("utf-8")},
        )
        # api_cache.save()
        data = APICache.objects.filter(query = query)
        serializer = APICacheSerializer(data, many=True)
        return Response(serializer.data)
        # return Response()

    def post(self, request, *args, **kwargs):
        posts_serializer = APICacheSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            # print(posts_serializer.data["pdf"])
            # pdf = posts_serializer.data["pdf"]
            # pdf = pdf[pdf.rfind("/")+1:]
            # print(pdf)

            # # Upload to S3 Bucket
            # file_path = join(root_path, pdf)
            # print("#"*50)
            # print(os.path.sep)
            # print(root_path, file_path)
            # print(str(file_path.rfind(os.path.sep)))
            # file_name = file_path[file_path.rfind(os.path.sep) + 1:]
            # print(file_name)
            # print(s3_bucket, file_path, posts_serializer.data["dealership"] + "/" + file_name)
            # try:
            #     upload_file_to_bucket(s3_bucket, file_path, posts_serializer.data["dealership"] + "/" + file_name)
            # except :
                # print("Upload error")
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)            

#     repair_order = models.IntegerField( help_text='Enter Repair Order Number')
#     pdf = models.CharField( max_length=100, verbose_name='PDF file name' )
#     dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, verbose_name='dealership name', null=True) 
#     service_advisor = models.ForeignKey(ServiceAdvisor, on_delete=models.CASCADE, verbose_name='service advisor name', null=True) 
#     technician = models.ForeignKey(Technician, on_delete=models.CASCADE, verbose_name='technician name', null=True) 
#     claim_type = models.ForeignKey(ClaimType, on_delete=models.CASCADE, verbose_name='claim type', null=True) 
#     submission_type = models.ForeignKey(SubmissionType, on_delete=models.CASCADE, verbose_name='submission type', null=True)        


# @api_view(["POST"])
# # @csrf_exempt
# # @permission_classes([IsAuthenticated])
# def add_dealership(request):
#     print(request.body)
#     print(request.POST["name"])
#     print(request.POST["description"])
#     print(request.POST.get("description", ""))
#     # payload = json.loads(request.body)
#     try:
#         dealership = Dealership.objects.create(
#             name=request.POST["name"],
#             description=request.POST.get("description", ""),
#         )
#         print("1")
#         serializer = DealershipSerializer(dealership)
#         return JsonResponse({'dealerships': serializer.data}, safe=False, status=status.HTTP_201_CREATED)
#     except ObjectDoesNotExist as e:
#         return JsonResponse({'error': str(e)}, safe=False, status=status.HTTP_404_NOT_FOUND)
#     except Exception:
#         return JsonResponse({'error': 'Something terrible went wrong'}, safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    