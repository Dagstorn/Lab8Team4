from django.forms import ModelForm, widgets
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import Driver

class DriverForm(ModelForm):
    class Meta:
        model = Driver
        fields = ['name', 'surname', 'middle_name', 'goverment_id', 'address', 'phone', 'email', 'department', 'license_code']

    def __init__(self, *args, **kwargs):
        super(DriverForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-control', 'placeholder':name})

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['first_name','last_name', 'email',  'password1', 'password2']


    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-control'})
