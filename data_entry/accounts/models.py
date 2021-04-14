from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from . import managers # we will write this file shortly


class CustomUser(AbstractUser):
    # username = None
    # username = models.CharField( max_length=30, null=True, unique=True )
    email = models.EmailField(_('email address'), null=True, unique=True)
    
    role = models.CharField(
        max_length=30,
        null=True,
        choices=(
            ('admin', 'Admin'),
            ('data_collector', 'Data Collector'),
        )
    )
    # dealership = models.ForeignKey("api.Dealership", to_field="name", on_delete=models.CASCADE, verbose_name='dealership', null=True, blank=True)

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = [username, email]

    objects = managers.CustomUserManager()

    def __str__(self):
        return f"{self.email}'s custom account"