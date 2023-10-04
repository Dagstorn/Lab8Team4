from django.db import models
from accounts.models import FuelingPerson
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
    license_plat = models.CharField(max_length=15, verbose_name="Licence plate")
    capacity = models.PositiveIntegerField(verbose_name="Sitting capacity")
    mileage = models.PositiveIntegerField(verbose_name="Mileage in km", default=0)
    class Meta:
        ordering = ["-type", "make", "model", "year"]

    def __str__(self):
        return f'{self.model} {self.year} | {self.license_plat} | {self.type}'
    
    def is_available(self):
        return not Task.objects.filter(car=self).exists()
    


class FuelingProof(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, related_name="fueling_proofs")
    fueling_person = models.ForeignKey(FuelingPerson, on_delete=models.SET(0), related_name="fueling_proofs")
    image_before = models.ImageField(verbose_name="image before fueling", upload_to ='fueling_records/')
    image_after = models.ImageField(verbose_name="image after fueling", upload_to ='fueling_records/')
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=100)
    amount = models.CharField(max_length=100)
    cost = models.CharField(max_length=100)


class MaintenanceJob(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now_add=True)

    
class MaintenanceRecord(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)
    service_type = models.CharField(max_length=100)
    cost = models.PositiveIntegerField()
    replaced_part_number = models.CharField()
    replaced_part_photo = models.ImageField(upload_to ='maintenance_records/')
    completed_on = models.DateTimeField(auto_now_add=True)


class AuctionVehicle(models.Model):
    image = models.ImageField(upload_to ='auction_vehicles/')
    status = models.CharField()
    cost = models.CharField()

