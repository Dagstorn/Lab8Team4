from django.db import models
from accounts.models import Driver

class Appointment(models.Model):
    BODY_TYPES =(
        ("Sedan", "Sedan"), ("SUV", "SUV"), ("Hatchback", "Hatchback"), ("Coupe", "Coupe"), ("Convertible", "Convertible"), ("Wagon", "Wagon"), ("Minivan", "Minivan"), ("Pickup Truck", "Pickup Truck"), ("Crossover", "Crossover"), ("Van", "Van"), ("Sports Car", "Sports Car")
    )
    currentPosition = models.CharField(max_length=100,default='')
    destination = models.CharField(max_length=100, default='')
    description = models.TextField()
    driver = models.ForeignKey(Driver, related_name="appointments", on_delete=models.CASCADE, null=True)
    car_type = models.CharField(max_length=20, choices=BODY_TYPES, default="Sedan")
    time_from = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    time_to = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    number_of_people = models.PositiveIntegerField(default=1)
    additionalInfo = models.CharField(max_length=100, default="")
    def __str__(self):
        return f"{self.driver.name}'s appointment"
    
    class Meta:
        ordering = ['-time_from']


class Task(models.Model):
    STATUS_TYPES = (
        ("Assigned", "Assigned"),
        ("In progress", "In progress"),
        ("Completed", "Completed"),
        ("Delayed", "Delayed"),
        ("Canceled", "Canceled"),
    )
    driver = models.ForeignKey(Driver, related_name="tasks", on_delete=models.CASCADE, null=True)
    car = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name="assigned_task", null=True)
    description = models.TextField(default='')
    from_point = models.CharField(verbose_name="departure point", max_length=200)
    to_point = models.CharField(verbose_name="arrival point", max_length=200)
    time_from = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    time_to = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default="Assigned")

    def __str__(self):
        return f'Task for {self.driver} on {self.time_from.strftime("%Y-%m-%d")}'

    class Meta:
        ordering = ['-time_from']


class CompletedRoute(models.Model):
    driver = models.ForeignKey(Driver, related_name="routes", on_delete=models.CASCADE, null=True)
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.SET_NULL, related_name="completed_routes", null=True)
    from_point = models.CharField(verbose_name="departure point", max_length=200)
    to_point = models.CharField(verbose_name="arrival point", max_length=200)
    time_from = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    time_to = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    distance_covered = models.FloatField(default=0.0)
    time_spent = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-time_from']



