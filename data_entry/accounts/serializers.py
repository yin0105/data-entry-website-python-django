from django.contrib.auth import get_user_model
from rest_framework import serializers, validators

CustomUser = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(
        validators=[validators.UniqueValidator(
            message='This email already exists',
            queryset=CustomUser.objects.all()
        )]
    )
    username = serializers.CharField(
        validators=[validators.UniqueValidator(
            message='This username already exists',
            queryset=CustomUser.objects.all()
        )]
    )
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'username', 'role', 'is_active')


class CustomUserRetrieveSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    role = serializers.CharField(required=True)
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'role', 'id')