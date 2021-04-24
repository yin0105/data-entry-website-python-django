from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, QueryDict
from rest_framework.response import Response
from rest_framework import status

from . import serializers

CustomUser = get_user_model()


class CustomUserModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CustomUserSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = CustomUser.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        instance.save()

    # def put(self, request, format=None):  
    def update(self, request, *args, **kwargs):
        print("######### put")
        instance = get_object_or_404(CustomUser.objects.all(), id=request.data["id"])

        ordinary_dict = {}
        ordinary_dict["id"] = instance.id
        ordinary_dict["username"] = instance.username
        ordinary_dict["email"] = instance.email
        ordinary_dict["password"] = instance.password
        ordinary_dict["role"] = instance.role
        ordinary_dict["is_active"] = instance.is_active

        req = request.data
        if "username" in req: ordinary_dict["username"] = req["username"]
        if "email" in req: ordinary_dict["email"] = req["email"]
        if "password" in req: ordinary_dict["password"] = req["password"]
        if "role" in req: ordinary_dict["role"] = req["role"]
        if "is_active" in req: ordinary_dict["is_active"] = req["is_active"]

        query_dict = QueryDict('', mutable=True)
        query_dict.update(ordinary_dict)

        serializer = serializers.CustomUserSerializer(instance, data=query_dict)

        # validate and update
        if serializer.is_valid():
            serializer.save()
            serializer_dict = serializer.data
            serializer_dict["message"] = "CustomUser updated successfully."
            print(serializer_dict)
            return Response(serializer_dict, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)      
        # return Response(status=status.HTTP_201_CREATED)