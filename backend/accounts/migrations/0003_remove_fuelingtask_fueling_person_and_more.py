# Generated by Django 4.2.5 on 2023-11-02 12:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_maintenancetask_fuelingtask'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fuelingtask',
            name='fueling_person',
        ),
        migrations.DeleteModel(
            name='MaintenanceTask',
        ),
    ]
