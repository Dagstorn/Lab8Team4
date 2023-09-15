from django.forms import ModelForm, widgets
from django import forms
from .models import Vehicle


class VehicleForm(ModelForm):
    class Meta:
        model = Vehicle
        fields = ['make', 'model', 'type', 'year', 'license_plat', 'capacity']

    def __init__(self, *args, **kwargs):
        super(VehicleForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-control'})

