from django.shortcuts import render
from tasks.models import Appointment
from django.contrib.auth.models import User

def homepage(request):
    user_role = "admin"
    app1 = Appointment.objects.all().first()
    # Print the current time as it is, without formatting
    us1 = User.objects.filter(username="aizere.urazova@example.com").first()
    print(us1.id)
    context = {
        'user_role': user_role
    }
    return render(request, 'home/homepage.html', context)
