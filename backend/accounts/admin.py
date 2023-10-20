from django.contrib import admin
from .models import Admin, Driver, FuelingPerson, MaintenancePerson, DriverReport
# Register your models here.

@admin.register(Admin)
class Admin(admin.ModelAdmin):
    class Meta:
        model = Admin

admin.site.register(Driver)
admin.site.register(FuelingPerson)
admin.site.register(MaintenancePerson)
admin.site.register(DriverReport)