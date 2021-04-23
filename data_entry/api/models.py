from django.db import models
from django.contrib.auth import validators
from django.contrib import auth
from django.utils import timezone



class APICache(models.Model):
    id = models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)
    query = models.CharField( max_length=255, verbose_name='API Cache', unique=True)
    data = models.TextField(null=True)
    last_updated = models.DateTimeField(null=True)

    # Metadata
    class Meta:
        ordering = ['query']

    def __str__(self):
        return self.query

    def save(self, *args, **kwargs):
        self.last_updated = timezone.now()
        return super(APICache, self).save(*args, **kwargs)


class Collection(models.Model):
    id = models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)
    name = models.CharField( max_length=30, verbose_name='Collection name', unique=True)
    sports = models.TextField(max_length=1000, blank=True)
    field_names = models.TextField(max_length=1000, blank=True)
    field_types = models.TextField(max_length=1000, blank=True)

    # Metadata
    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name  


class Schedule(models.Model):
    id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, verbose_name='collection id', unique=True) 
    active = models.BooleanField(default=False)
    weekdays = models.CharField( max_length=30, verbose_name='weekdays')
    time_ranges = models.TextField(max_length=1000, blank=True)
    status = models.CharField( max_length=30, default='available')

    # Metadata
    class Meta:
        ordering = ['collection']

    def __str__(self):
        return self.collection 

    def __dir__(self):
        return['id', 'collection', 'active', 'weekdays', 'time_ranges', 'status']                          

# #################################################################
# class ClaimType(models.Model):
#     name = models.CharField( help_text='Required. 30 characters or fewer.',
#         max_length=30, verbose_name='claim type', primary_key=True)
#     description = models.TextField(max_length=1000, help_text='Enter a brief description of the claim type')

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name        


# class SubmissionType(models.Model):
#     name = models.CharField( help_text='Required. 30 characters or fewer.', 
#         max_length=30, verbose_name='submission type', primary_key=True)
#     description = models.TextField(max_length=1000, help_text='Enter a brief description of the submission type')

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name


# class Status(models.Model):
#     name = models.CharField( help_text='Required. 30 characters or fewer', 
#         max_length=30, verbose_name='status', primary_key=True)
#     description = models.TextField(max_length=1000, help_text='Enter a brief description of the status')

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name  

        
# class Dealership(models.Model):
#     name = models.CharField( help_text='Required. 30 characters or fewer.', 
#         max_length=30, verbose_name='dealership name', primary_key=True)
#     description = models.TextField(max_length=1000, help_text='Enter a brief description of the dealership')

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name  


# class ServiceAdvisor(models.Model):
#     id = models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)
#     name = models.CharField( help_text='Required. 30 characters or fewer.',
#         max_length=30, verbose_name='service advisor name', )

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name 


# class Technician(models.Model):
#     id = models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)
#     name = models.CharField( help_text='Required. 30 characters or fewer.',
#         max_length=30, verbose_name='technician name', )

#     # Metadata
#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name     
                                    

# class Claim(models.Model):
#     id = models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)
#     repair_order = models.IntegerField( help_text='Enter Repair Order Number')
#     pdf = models.FileField(upload_to="pdf_folder")
#     dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, verbose_name='dealership name', null=True) 
#     service_advisor = models.ForeignKey(ServiceAdvisor, on_delete=models.CASCADE, verbose_name='service advisor name', null=True) 
#     technician = models.ForeignKey(Technician, on_delete=models.CASCADE, verbose_name='technician name', null=True) 
#     claim_type = models.ForeignKey(ClaimType, on_delete=models.CASCADE, verbose_name='claim type', null=True) 
#     submission_type = models.ForeignKey(SubmissionType, on_delete=models.CASCADE, verbose_name='submission type', null=True) 
#     upload_date = models.DateTimeField(null=True)

#     # Metadata
#     class Meta:
#         ordering = ['dealership', 'repair_order']

#     def __str__(self):
#         return self.id

#     def save(self, *args, **kwargs):
#         self.upload_date = timezone.now()
#         self.modified = timezone.now()
#         return super(Claim, self).save(*args, **kwargs)   
         