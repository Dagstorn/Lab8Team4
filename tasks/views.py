from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Appointment, Task
from .forms import AppointmentForm
from vehicles.models import Vehicle
from django.db.models import Q
import json

@login_required(login_url="signin")
def appointments_list(request):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    
    appointments = Appointment.objects.all().order_by('date')
    context = {'appointments':appointments}
    return render(request, 'tasks/appointments_list.html',context)


@login_required(login_url="signin")
def make_appointment(request):
    if not hasattr(request.user, 'driver_acc'):
        return redirect('homepage')
    form = AppointmentForm()
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            new_appointment = form.save(commit=False)
            # new_appointment.date = 
            new_appointment.driver = request.user.driver_acc
            form.save()
            return redirect('drivers_personal_page', request.user.username)
        
    context = {'form': form}
    return render(request, 'tasks/make_appointment.html', context)


@login_required(login_url="signin")
def process_appointment(request, aid):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')

    appointment = get_object_or_404(Appointment, id=aid)

    # Get Vehicles with no assigned task OR Vehicles with Completed Tasks
    # Meaning get all available vehicles
    cars = Vehicle.objects.filter(
        Q(assigned_task=None) | Q(assigned_task__status='Completed')    
    )

    if request.method == 'POST':
        carId = request.POST.get('car')
        car = get_object_or_404(Vehicle, id=carId)
        latFrom = request.POST.get('latitudeFrom')
        lonFrom = request.POST.get('longitudeFrom')
        latTo = request.POST.get('latitudeTo')
        lonTo = request.POST.get('longitudeTo')

        point1 = {}
        point1['latitude'] = latFrom
        point1['longitude'] = lonFrom
        point2 = {}
        point2['latitude'] = latTo
        point2['longitude'] = lonTo
        
        new_task = Task(
            driver=appointment.driver,
            car=car,
            from_point=json.dumps(point1),
            to_point=json.dumps(point2),
            date=appointment.date
        )
        new_task.save()
        appointment.delete()

        return redirect('appointments_list')
        
    context = {'appointment': appointment, 'cars': cars}
    return render(request, 'tasks/appointment_detail.html', context)


@login_required(login_url="signin")
def tasks_list(request):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    tasks = Task.objects.all()
    print(tasks)
    context = {'tasks':tasks}
    return render(request, 'tasks/tasks.html',context)

@login_required(login_url="signin")
def task_view(request, tid):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    
    task = get_object_or_404(Task, id=tid)
    context = {
        'task':task, 
        'from_point_data': json.loads(task.from_point),
        'to_point_data': json.loads(task.to_point),
    }
    return render(request, 'tasks/task_view.html',context)
