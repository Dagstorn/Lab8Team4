from django.contrib import admin
from .models import Vehicle, FuelingProof, MaintenanceJob, MaintenanceRecord, VehicleReport, AuctionVehicle,RepairingPart,RepairedPartRecord

# Register your models here.
admin.site.register(Vehicle)
admin.site.register(FuelingProof)
admin.site.register(MaintenanceJob)
admin.site.register(RepairingPart)
admin.site.register(RepairedPartRecord)
admin.site.register(VehicleReport)
admin.site.register(AuctionVehicle)

class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'maintenance_person', 'job','cost', 'completed_on')
    list_editable = ('cost', 'completed_on')

# Register your model with the custom admin class
admin.site.register(MaintenanceRecord, MaintenanceRecordAdmin)