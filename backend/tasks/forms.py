from django.forms import ModelForm, widgets
from django import forms
from .models import Appointment, Task

class DateInput(forms.DateInput):
    input_type = 'datetime-local'
    
class AppointmentForm(ModelForm):
    class Meta:
        model = Appointment
        fields = ['description', 'car_type', 'time_from', 'time_to']
        widgets = {
            'time_from':forms.TextInput(attrs={'type':'datetime-local'}),
            'time_to':forms.TextInput(attrs={'type':'datetime-local'}),
        }
        labels = {
            "car_type": "Select prefferred car body type",

            "time_from": "Select starting time",
            "time_to": "Select ending time",
        }

    def __init__(self, *args, **kwargs):
        super(AppointmentForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            if name == 'description':
                field.widget.attrs.update({'rows':'3'})

            field.widget.attrs.update({'class': 'form-control col-6', 'placeholder':name})

class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = ['car']

    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-control'})
