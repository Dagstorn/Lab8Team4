from django.contrib import admin
from .models import Vehicle, FuelingProof, MaintenanceJob, MaintenanceRecord, VehicleReport, AuctionVehicle

# Register your models here.
admin.site.register(Vehicle)
admin.site.register(FuelingProof)
admin.site.register(MaintenanceJob)
admin.site.register(MaintenanceRecord)
admin.site.register(VehicleReport)
admin.site.register(AuctionVehicle)