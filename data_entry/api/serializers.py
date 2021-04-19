from django.db.models.fields import DateTimeField
from rest_framework import serializers, fields
from .models import APICache, Schedule, Collection
from datetime import datetime

# class ClaimTypeSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = ClaimType
#         fields = ['name']


# class SubmissionTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SubmissionType
#         fields = ['name']


# class ServiceAdvisorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ServiceAdvisor
#         fields = ['id', 'name']


# class TechnicianSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Technician
#         fields = ['id', 'name']


# class ClaimSerializer(serializers.ModelSerializer):
#     pdf = serializers.FileField()
#     # upload_date = DateTimeField()
#     class Meta:
#         model = Claim
#         fields = ['id', 'repair_order', 'pdf', 'dealership', 'claim_type', 'submission_type', 'service_advisor', 'technician', 'upload_date']               

class APICacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = APICache
        fields = ['id', 'query', 'data', 'last_updated']


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'name', 'sports', 'field_names', 'field_types']        

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['collection', 'active', 'weekdays', 'time_ranges']       

