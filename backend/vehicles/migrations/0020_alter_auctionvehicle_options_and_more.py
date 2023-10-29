# Generated by Django 4.2.5 on 2023-10-28 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0019_fuelingproof_driver_photo'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='auctionvehicle',
            options={'ordering': ['-type', 'make', 'model', 'year']},
        ),
        migrations.RemoveField(
            model_name='auctionvehicle',
            name='cost',
        ),
        migrations.RemoveField(
            model_name='auctionvehicle',
            name='status',
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='additional_information',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='capacity',
            field=models.PositiveIntegerField(default=5, verbose_name='Sitting capacity'),
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='condition',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='license_plate',
            field=models.CharField(default='', max_length=15, verbose_name='Licence plate'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='make',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='mileage',
            field=models.FloatField(default=0, verbose_name='Mileage in km'),
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='model',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='type',
            field=models.CharField(choices=[('Sedan', 'Sedan'), ('SUV', 'SUV'), ('Hatchback', 'Hatchback'), ('Coupe', 'Coupe'), ('Wagon', 'Wagon'), ('Minivan', 'Minivan'), ('Pickup Truck', 'Pickup Truck'), ('Crossover', 'Crossover'), ('Van', 'Van'), ('Sports Car', 'Sports Car')], default='Sedan', max_length=20),
        ),
        migrations.AddField(
            model_name='auctionvehicle',
            name='year',
            field=models.PositiveIntegerField(default=2023),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='auctionvehicle',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='auction_vehicles/'),
        ),
    ]
