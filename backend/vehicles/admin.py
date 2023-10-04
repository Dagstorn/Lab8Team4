from django.contrib import admin
from .models import Vehicle, FuelingProof

# Register your models here.
admin.site.register(Vehicle)
admin.site.register(FuelingProof)