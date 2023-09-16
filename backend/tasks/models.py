from django.db import models
from accounts.models import Driver
from django.db.models.signals import pre_save
from django.dispatch import receiver

class Appointment(models.Model):
    BODY_TYPES =(
        ("Sedan", "Sedan"), ("SUV", "SUV"), ("Hatchback", "Hatchback"), ("Coupe", "Coupe"), ("Convertible", "Convertible"), ("Wagon", "Wagon"), ("Minivan", "Minivan"), ("Pickup Truck", "Pickup Truck"), ("Crossover", "Crossover"), ("Van", "Van"), ("Sports Car", "Sports Car")
    )
    description = models.TextField()
    driver = models.ForeignKey(Driver, related_name="appointments", on_delete=models.CASCADE, null=True)
    car_type = models.CharField(max_length=20, choices=BODY_TYPES, default="Sedan")
    time_from = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    time_to = models.DateTimeField(auto_now_add=False, blank=True, null=True)

    def __str__(self):
        return f"{self.driver.name}'s appointment"
    
    class Meta:
        ordering = ['time_from']


class Task(models.Model):
    STATUS_TYPES = (
        ("Assigned", "Assigned"),
        ("In progress", "In progress"),
        ("Completed", "Completed"),
    )
    driver = models.ForeignKey(Driver, related_name="tasks", on_delete=models.CASCADE, null=True)
    car = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name="assigned_task", null=True)
    from_point = models.JSONField(verbose_name="departure point")
    to_point = models.JSONField(verbose_name="arrival point")
    time_from = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    time_to = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default="Assigned")

    def __str__(self):
        return f'Task for {self.driver} on {self.time_from.strftime("%Y-%m-%d")}'

    class Meta:
        ordering = ['time_from']


class CompletedRoutes(models.Model):
    task_id = models.ForeignKey(Task, on_delete=models.DO_NOTHING, null=True)
    driver = models.ForeignKey(Driver, related_name="routes", on_delete=models.CASCADE, null=True)
    from_point = models.JSONField(verbose_name="departure point")
    to_point = models.JSONField(verbose_name="arrival point")
    date = models.DateTimeField(auto_now_add=False)
    distance_covered = models.CharField()
    time_spent = models.CharField()

    class Meta:
        ordering = ['-date']


@receiver(pre_save, sender=Task)
def create_route_record(sender, instance, **kwargs):
    if instance.status == 'Completed':
        record = CompletedRoutes.objects.filter(task_id=instance.id)
        if len(record) == 0:
            CompletedRoutes.objects.create(
                task_id = instance,
                driver = instance.driver,
                from_point = instance.from_point,
                to_point = instance.to_point,
                date = instance.date
            )   
