from django.urls import include, path
from . import views

urlpatterns = [
  # path('get_claim_types', views.get_claim_types),
  # path('get_submission_types', views.get_submission_types),
  # path('get_service_advisors', views.get_service_advisors),
  # path('get_technicians', views.get_technicians),
  # path('add_collection', views.add_collection),
  # path('claim/', views.ClaimView.as_view(), name= 'claim_list'),
  path('api_cache/', views.APICacheView.as_view(), name= 'apicache_list'),
  path('collection/', views.CollectionView.as_view(), name= 'collection_list'),
  path('schedule/', views.ScheduleView.as_view(), name= 'schedule_list'),
]