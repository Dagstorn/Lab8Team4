from django.shortcuts import render
from tasks.models import Appointment

def homepage(request):
    user_role = "admin"
    app1 = Appointment.objects.all().first()
    # Print the current time as it is, without formatting
    print(app1.time_from)
    context = {
        'user_role': user_role
    }
    return render(request, 'home/homepage.html', context)
