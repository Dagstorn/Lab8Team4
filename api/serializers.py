from rest_framework import serializers
from accounts.models import Driver

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['user','goverment_id','name','surname','middle_name','address','phone','email','license_code']