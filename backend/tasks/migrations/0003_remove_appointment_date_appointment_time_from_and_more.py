# Generated by Django 4.2.5 on 2023-09-15 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_task_options_remove_task_date_task_time_from_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointment',
            name='date',
        ),
        migrations.AddField(
            model_name='appointment',
            name='time_from',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='time_to',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
