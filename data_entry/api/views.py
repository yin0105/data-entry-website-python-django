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
        if "offset" in request.GET:
            query += "?offset=" + request.GET["offset"]
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
        now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")     
        if "run_sql" in req:
            sql = req["sql"]
            sql = sql.lower()
            fields = [s.strip() for s in (sql[sql.find("select") + 6 : sql.find("from")]).split(",")]
            print("fields = ", fields)
            res = []
            res.append(fields)
            with connection.cursor() as cursor:
                cursor.execute(sql)
                for row in cursor.fetchall():
                    print("row = ", row)
                    print("row['username'] = ", row[1])
                    res.append(row)
                    # for field in row:

                return Response({"res": res})
        elif "save_collected_data" in req:
            table_name = "col_" + req["name"]
            if "no_data" in req:
                 with connection.cursor() as cursor:
                    sql = "INSERT INTO `" + table_name + "` (`col_dt`) VALUES ('" + now + "')"
                    return Response({"res": cursor.execute(sql)})
            elif "no_api" in req:
                 with connection.cursor() as cursor:
                    sql = "INSERT INTO `" + table_name + "` "
                    field_names = ""
                    field_values = ""
                    for field in req:
                        if field != "name" and field != "save_collected_data" and field != "no_api":
                            field_names +=  field + ", "
                            field_values += req[field] + ", "
                    sql += "(" + field_names + "col_dt) VALUES (" + field_values + "'" + now + "')"
                    print("sql = ", sql)
                    return Response({"res": cursor.execute(sql)})
            else:
                # event_id = req["event_id"]            
                # sql = "SELECT COUNT(*) FROM `" + table_name + "` WHERE event_id='" + event_id + "'"
                # with connection.cursor() as cursor:
                #     cursor.execute(sql)
                #     row = cursor.fetchone()
                #     now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
                #     if (row[0] > 0):
                #         sql = "UPDATE `" + table_name + "` SET "
                #         for field in req:
                #             if field != "name" and field != "event_id" and field != "save_collected_data":
                #                 sql += field + "=" + req[field] + ", "
                #         sql += "col_dt='" + now + "' WHERE event_id='" + event_id + "'"
                    # else:
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
            table_name = "col_" + req["name"]
            posts_serializer = CollectionSerializer(data=request.data)
            if posts_serializer.is_valid():
                posts_serializer.save()                
                field_names = str(req["field_names"]).split("::")
                field_types = str(req["field_types"]).split("::")
                if req["sports"].find("0::") == 0:
                    # sql
                    reqSql = req["sports"].split("::")[1]
                    reqSql = reqSql.lower()
                    fromFields = ["`" + s.strip() + "`" for s in (reqSql[reqSql.find("select") + 6 : reqSql.find("from")]).split(",")]
                    fromTable = (reqSql[reqSql.find("from") + 5:].strip()).split(" ")[0]
                    print("fromTable = ", fromTable)
                    sql = "CREATE TABLE `" + table_name + "` ENGINE=INNODB COLLATE = utf8mb4_general_ci COMMENT = ''  SELECT " + (", ".join(fromFields)) + " FROM `" + fromTable + "` WHERE 1 = 0"
                    print("sql = ", sql)
                    try:
                        with connection.cursor() as cursor:
                            cursor.execute(sql)
                            cursor.execute("ALTER TABLE `" + table_name + "` ADD COLUMN `auto_id` BIGINT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`auto_id`); ")
                            for (name, type) in zip(field_names, field_types):
                                sql = "`" + name + "` "
                                if type == "numeric":
                                    sql += "FLOAT(11) NOT NULL "
                                else:
                                    sql += "VARCHAR(255) NOT NULL "
                                cursor.execute("ALTER TABLE `" + table_name + "` ADD COLUMN " + sql)
                            cursor.execute("ALTER TABLE `" + table_name + "` ADD COLUMN `col_dt` DATETIME NOT NULL")
                            return Response({"res": "success"})
                    except:
                        return Response({"res": "fail"})
                else:
                    sql = "CREATE TABLE `" + table_name + "` (`id` BIGINT NOT NULL AUTO_INCREMENT, `event_id` VARCHAR(255) NOT NULL, "
                    for (name, type) in zip(field_names, field_types):
                        sql += "`" + name + "` "
                        if type == "numeric":
                            sql += "FLOAT(11) NOT NULL, "
                        else:
                            sql += "VARCHAR(255) NOT NULL, "
                    sql += "`col_dt` DATETIME NOT NULL, PRIMARY KEY (`id`) ); "
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
        print("id = ", request.data["id"]) 
        instance = get_object_or_404(Schedule.objects.all(), id=request.data["id"])

        ordinary_dict = {}
        ordinary_dict["id"] = instance.id
        ordinary_dict["collection"] = instance.collection.id
        ordinary_dict["active"] = instance.active
        ordinary_dict["weekdays"] = instance.weekdays
        ordinary_dict["time_ranges"] = instance.time_ranges
        ordinary_dict["status"] = instance.status

        req = request.data
        print("req = ", req)
        if "collection" in req: ordinary_dict["collection"] = req["collection"]
        if "active" in req: ordinary_dict["active"] = req["active"]
        if "weekdays" in req: ordinary_dict["weekdays"] = req["weekdays"]
        if "time_ranges" in req: ordinary_dict["time_ranges"] = req["time_ranges"]
        if "status" in req: 
            if "index" in req:
                temp_statuses = ordinary_dict["status"].split("/")
                temp_statuses[int(req["index"])] = req["status"]
                ordinary_dict["status"] = "/".join(temp_statuses)
            else:
                ordinary_dict["status"] = req["status"]

        query_dict = QueryDict('', mutable=True)
        query_dict.update(ordinary_dict)

        serializer = ScheduleCollectionSerializer(instance, data=query_dict)

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
        serializer = ScheduleCollectionSerializer(posts, many=True)
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
        print("collection = ", request.data["collection"])
        posts_serializer = ScheduleSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response({"res": "OK"})
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)      