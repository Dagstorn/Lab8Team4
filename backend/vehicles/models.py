from django.db import models
from accounts.models import FuelingPerson, MaintenancePerson
from tasks.models import Task

class Vehicle(models.Model):
    BODY_TYPES =(
        ("Sedan", "Sedan"), ("SUV", "SUV"), ("Hatchback", "Hatchback"), ("Coupe", "Coupe"), ("Wagon", "Wagon"), ("Minivan", "Minivan"), ("Pickup Truck", "Pickup Truck"), ("Crossover", "Crossover"), ("Van", "Van"), ("Sports Car", "Sports Car")
    )
    STATUS_TYPES = (
        ("active", "Active"),
        ("notactive", "Not Active"),
    )
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=BODY_TYPES, default="Sedan")
    year = models.PositiveIntegerField()
    license_plate = models.CharField(max_length=15, verbose_name="Licence plate")
    capacity = models.PositiveIntegerField(verbose_name="Sitting capacity")
    mileage = models.FloatField(verbose_name="Mileage in km", default=0)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default="active")

    class Meta:
        ordering = ["-type", "make", "model", "year"]
    
    def on_maintenance(self):
        self.status = "notactive"

    def off_maintenance(self):
        self.status = "active"

    def __str__(self):
        return f'{self.make} {self.model} {self.year} | {self.license_plate} | {self.type}'
    
    def is_available(self):
        return not Task.objects.filter(car=self).exists()
    


class FuelingProof(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, related_name="fueling_proofs")
    fueling_person = models.ForeignKey(FuelingPerson, on_delete=models.CASCADE, related_name="fueling_proofs")
    driver_photo = models.ImageField(verbose_name="photo of the Driver", upload_to ='fueling_records/')
    image_before = models.ImageField(verbose_name="image before fueling", upload_to ='fueling_records/')
    image_after = models.ImageField(verbose_name="image after fueling", upload_to ='fueling_records/')
    date = models.DateTimeField(auto_now_add=False)
    type = models.CharField(max_length=100)
    amount = models.FloatField()
    cost = models.PositiveIntegerField()

    def __str__(self):
        return f'FP on {self.vehicle.make} {self.vehicle.model} on {self.date}'
    
class MaintenanceJob(models.Model):
    STATUS_TYPES = (
        ("scheduled", "Scheduled"),
        ("completed", "completed"),
    )
    TYPE = (
        ("monthly", "monthly"),
        ("yearly", "yearly"),
        ("accidental", "accidental"),
    )
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, related_name="maintenance_jobs")
    maintenance_person = models.ForeignKey(MaintenancePerson, on_delete=models.SET_NULL, null=True, related_name="maintenance_jobs")
    description = models.TextField(max_length=1000)
    status = models.CharField(max_length=20, choices=TYPE, default="scheduled")
    type = models.CharField(max_length=20, choices=STATUS_TYPES, default="monthly")
    created_on = models.DateTimeField(auto_now_add=True)

    def complete(self):
        self.status = "completed"
        

class RepairingPart(models.Model):
    job = models.ForeignKey(MaintenanceJob, on_delete=models.CASCADE, related_name="repair_parts")
    part_name = models.CharField(max_length=100)
    condition = models.CharField(max_length=100)

class MaintenanceRecord(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True, related_name="maintenance_records")
    maintenance_person = models.ForeignKey(MaintenancePerson, on_delete=models.SET_NULL, null=True, related_name="maintenance_records")
    job = models.OneToOneField(MaintenanceJob, on_delete=models.SET_NULL, null=True, related_name="maintenance_record")
    description = models.TextField(max_length=1000)
    cost = models.PositiveBigIntegerField()
    completed_on = models.DateTimeField(auto_now_add=True)

class RepairedPartRecord(models.Model):
    record = models.ForeignKey(MaintenanceRecord, on_delete=models.CASCADE, related_name="repaired_parts")
    part_name = models.CharField(max_length=100)
    condition = models.CharField(max_length=100)
    part_number = models.CharField(max_length=100, null=True, blank=True)
    part_photo = models.ImageField(upload_to ='maintenance_records/', null=True, blank=True)


class AuctionVehicle(models.Model):
    BODY_TYPES =(
        ("Sedan", "Sedan"), ("SUV", "SUV"), ("Hatchback", "Hatchback"), ("Coupe", "Coupe"), ("Wagon", "Wagon"), ("Minivan", "Minivan"), ("Pickup Truck", "Pickup Truck"), ("Crossover", "Crossover"), ("Van", "Van"), ("Sports Car", "Sports Car")
    )

    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=BODY_TYPES, default="Sedan")
    year = models.PositiveIntegerField()
    license_plate = models.CharField(max_length=15, verbose_name="Licence plate")
    capacity = models.PositiveIntegerField(verbose_name="Sitting capacity", default=5)
    mileage = models.FloatField(verbose_name="Mileage in km", default=0)
    image = models.ImageField(upload_to ='auction_vehicles/', null=True, blank=True)
    condition = models.TextField(default="")
    additional_information = models.TextField(default="")

    class Meta:
        ordering = ["-type", "make", "model", "year"]

    def __str__(self):
        return f'{self.make} {self.model} {self.year} | {self.license_plate} | {self.type}'
   


class VehicleReport(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True, related_name="reports")
    report_file = models.FileField(upload_to='reports/vehicle/')
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

