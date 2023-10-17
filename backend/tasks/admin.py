from django.contrib import admin
from .models import Appointment, Task, CompletedRoute
# Register your models here.

admin.site.register(Appointment)
admin.site.register(Task)
admin.site.register(CompletedRoute)