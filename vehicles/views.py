from django.shortcuts import render, redirect, get_object_or_404
from .models import Vehicle
from .forms import VehicleForm
from accounts.models import Driver
from django.contrib.auth.decorators import login_required
from tasks.models import Task

@login_required(login_url="signin")
def vehicles_list(request):
    vehicles = Vehicle.objects.all()
    context = {'vehicles': vehicles}
    return render(request, 'vehicles/vehicles_list.html', context)

@login_required(login_url="signin")
def vehicles_add(request):
    if not request.user.admin_acc:
        return redirect('homepage')
    form = VehicleForm()

    if request.method == 'POST':
        form = VehicleForm(request.POST)
        if form.is_valid():
            vehicle = form.save()
            return redirect('vehicles_list')
        
    context = {'form': form, 'entity': 'Vehicle'}
    return render(request, 'add.html', context)

@login_required(login_url="signin")
def vehicles_detail(request, vid):
    vehicle = get_object_or_404(Vehicle, id=vid)
    drivers = Driver.objects.all()
    context = {
        'vehicle': vehicle,
        'drivers': drivers
    }
    return render(request, 'vehicles/detail.html', context)
