from django.shortcuts import render,redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Admin, Driver, FuelingPerson, MaintenancePerson
from tasks.models import Task
from .forms import DriverForm, CustomUserCreationForm
from password_generator import PasswordGenerator
from django.db.models import Q
from .decorators import user_type_required

# login 
def signin(request):
    # Redirect user if already logged in
    if request.user.is_authenticated:
        return redirect('homepage')
    # process form 
    if request.method == "POST":
        # get form data
        username = request.POST.get('username').strip()
        password = request.POST.get('password').strip()
        # check credentials
        user = authenticate(request, username=username, password=password)
        # login user and redirect to appropriate page
        if user is not None:
            login(request, user)
            
            # if user is Driver - redirect to drivers personal page
            if hasattr(user, 'driver_acc'):
                return redirect('drivers_personal_page', user.driver_acc.user.username)
            
            return redirect('homepage')
        else:
            messages.error(request, 'User does not exist')

    return render(request, 'accounts/login_signup/login.html')

# logout user
def logoutUser(request):
    logout(request)
    return redirect('homepage')


# Creating fueling or maintenance person accounts
def register(request):
    # template variable to reduce repetition, because it is long and will be used multiple times
    template = 'accounts/login_signup/register.html'
    form = CustomUserCreationForm()
    # process form submission
    if request.method == "POST":
        # get role field from form data
        role = request.POST.get('role')     
        # get form data
        form = CustomUserCreationForm(request.POST)

        # If role field is not 2 of mentioned return error
        if role != "gas" and role != "maintenance":
            messages.error(request, 'Choose a proper role')
            return render(request, template, {'form': form})

        # Process valid form
        if form.is_valid():
            # create new user instance without saving
            user = form.save(commit=False)
            # set username field to email so that users can login by entering emails
            user.username = user.email
            # check if user with this email already exists, return error if so
            if len(User.objects.filter(username=user.email)) != 0:
                messages.error(request, 'Account with this email is already registered!')
                return render(request, template, {'form': form})
            # save user object
            user.save()
            # create Fueling person or Maintanance person account based on role
            if role == "gas":
                FuelingPerson.objects.create(user=user)
            elif role == "maintenance":
                MaintenancePerson.objects.create(user=user)
            # redirect to login page with success message
            messages.success(request, 'Account created successfully')
            return redirect('signin')
        else:
            # form is not valid
            # form errors will be automatically rendered on page
            return render(request, template, {'form': form})
            
    # render default page in GET method
    context = {'form': form}
    return render(request, template, context)


@login_required(login_url="signin")
def drivers_list(request):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    drivers = Driver.objects.all()
    return render(request, 'accounts/drivers_list.html', {'drivers':drivers})

@login_required(login_url="signin")
def drivers_detail(request, username):
    user = get_object_or_404(User, username=username)
    driver = get_object_or_404(Driver, user=user)
    context = {
        'driver': driver,
    }
    return render(request, 'accounts/detail.html', context)

@login_required(login_url="signin")
def drivers_add(request):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    
    form = DriverForm()
    pwgen = PasswordGenerator()

    if request.method == 'POST':
        form = DriverForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = pwgen.generate()
            user = User.objects.create_user(
                username=email, 
                email=email, 
                password=password
            )
            driver = form.save(commit=False)
            driver.user = user
            print(password)
            driver.password = password
            driver.save()
            return redirect('drivers_list')
        
    context = {'form': form, 'entity': 'Driver'}
    return render(request, 'add.html', context)

@login_required(login_url="signin")
def drivers_edit(request, uid):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    
    driver = get_object_or_404(Driver, id=uid)
    form = DriverForm(instance=driver)

    if request.method == 'POST':
        form = DriverForm(request.POST, instance=driver)
        if form.is_valid():
            driver = form.save()
            return redirect('drivers_list')
        
    context = {'form': form, 'entity': 'Driver'}
    return render(request, 'add.html', context)

@login_required(login_url="signin")
def drivers_delete(request, uid):
    if not hasattr(request.user, 'admin_acc'):
        return redirect('homepage')
    
    driver = get_object_or_404(Driver, id=uid)
    driver.delete()
    
    return redirect('drivers_list')


@login_required(login_url="signin")
@user_type_required(['admin'])
def staff_list(request):
    fueling_list = FuelingPerson.objects.filter(approved=True)
    maintenance_list = MaintenancePerson.objects.filter(approved=True)

    fueling_list_to_approve = FuelingPerson.objects.filter(approved=False)
    maintenance_list_to_approve = MaintenancePerson.objects.filter(approved=False)

    if request.method == 'POST':

        if 'all' in request.POST:
            for obj in fueling_list_to_approve:
                obj.approved = True
                obj.save()
            for obj in maintenance_list_to_approve:
                obj.approved = True  
                obj.save()
        elif 'approve' in request.POST:
            uid = request.POST.get('uid')
            role = request.POST.get('role')
            if role == 'fueling':
                obj = get_object_or_404(FuelingPerson, id=uid)
                obj.approved = True
                obj.save()
            if role == 'maintenance':
                obj = get_object_or_404(MaintenancePerson, id=uid)
                obj.approved = True
                obj.save()
        elif 'delete' in request.POST:
            uid = request.POST.get('uid')
            role = request.POST.get('role')
            if role == 'fueling':
                obj = get_object_or_404(FuelingPerson, id=uid)
                obj.delete()
            if role == 'maintenance':
                obj = get_object_or_404(MaintenancePerson, id=uid)
                obj.delete()   

        return redirect('staff_list')
    
    context = {
        'fueling_list': fueling_list,
        'maintenance_list': maintenance_list,
        'fueling_list_to_approve': fueling_list_to_approve,
        'maintenance_list_to_approve': maintenance_list_to_approve,
    }

    return render(request, 'accounts/staff_list.html', context)


@login_required(login_url="signin")
@user_type_required(['driver'])
def drivers_personal_page(request, username):
    # get user object
    user = get_object_or_404(User, username=username)
    # gets driver's tasks with status Assigned 
    tasks = user.driver_acc.tasks.all().filter(status='Assigned')
    # render page
    context = {'driver': user.driver_acc, 'tasks': tasks}
    return render(request, 'accounts/personal_page.html', context)


