from django.db import models
from django.contrib.auth.models import User

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name="admin_acc")
    
    def __str__(self):
        return self.user.username

class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name="driver_acc")
    goverment_id = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    license_code = models.PositiveIntegerField()
    password = models.CharField(max_length=100,null=True, blank=True)
    def __str__(self):
        return f'{self.name} {self.surname}'
    

    class Meta:
        ordering = ['name', 'surname']


class FuelingPerson(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name="fueling_acc")
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100,null=True, blank=True)


class MaintenancePerson(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name="maintenance_acc")
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100,null=True, blank=True)



class DriverReport(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True, related_name="reports")
    report_file = models.FileField(upload_to='reports/vehicle/')
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]