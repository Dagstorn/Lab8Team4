# Generated by Django 4.2.5 on 2023-10-17 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0015_vehiclereport_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehiclereport',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
