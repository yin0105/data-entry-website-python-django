# Generated by Django 3.2 on 2021-04-17 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='apicache',
            name='last_updated',
            field=models.DateTimeField(null=True),
        ),
        migrations.DeleteModel(
            name='Claim',
        ),
    ]
