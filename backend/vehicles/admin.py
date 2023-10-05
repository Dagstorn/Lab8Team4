from django.contrib import admin
from .models import Vehicle, FuelingProof, MaintenanceJob, MaintenanceRecord

# Register your models here.
admin.site.register(Vehicle)
admin.site.register(FuelingProof)
admin.site.register(MaintenanceJob)
admin.site.register(MaintenanceRecord)