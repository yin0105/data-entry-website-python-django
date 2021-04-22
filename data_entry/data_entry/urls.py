from django.contrib import admin
from django.urls import path, include, re_path
from django.views import generic, static
from django.conf.urls import url
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/data_entry/', include('api.urls')),
    # url(r'^auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    re_path(r'.*', generic.TemplateView.as_view(template_name='index.html')),
    url(r'^static/(?P<path>.*)$', static.serve,
      {'document_root': settings.STATIC_ROOT}, name='static'),
]
