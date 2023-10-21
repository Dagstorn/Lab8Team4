import pytz
import calendar
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.models import User
from password_generator import PasswordGenerator

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status

from .decorators import user_type_required

from .serializers import DriverSerializer, VehicleSerializer, AppointmentSerializer, TaskSerializer, CompletedRouteSerializer, FuelingSerializer, MaintenanceSerializer, FuelingProofSerializer, MaintenanceJobSerializer

from accounts.models import Driver, FuelingPerson, MaintenancePerson, DriverReport
from vehicles.models import Vehicle, FuelingProof, MaintenanceJob, MaintenanceRecord, VehicleReport
from tasks.models import Appointment, Task, CompletedRoute



def do_time_windows_overlap(time_start1, time_end1, time_start2, time_end2):
    # Convert the time strings to datetime objects
    start1 = datetime.strptime(time_start1, "%Y-%m-%dT%H:%M")
    end1 = datetime.strptime(time_end1, "%Y-%m-%dT%H:%M")
    start2 = datetime.strptime(time_start2, "%Y-%m-%dT%H:%M")
    end2 = datetime.strptime(time_end2, "%Y-%m-%dT%H:%M")

    # Check if time window 2 starts before time window 1 ends
    # and if time window 2 ends after time window 1 starts
    if start2 < end1 and end2 > start1:
        return True
    else:
        return False
    

## -- For API calls From Admin -- ##



# Retrieve list of drivers or create new Driver object
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def drivers_list(request):
    if request.method == 'GET':   
        # get all drivers
        drivers = Driver.objects.all()
        # serialze and return data
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        try:
            # initiate random strong password generator
            pwgen = PasswordGenerator()
            # get new random password
            password = pwgen.generate()
            # get email from POST data
            email = request.data.get('email')
            # create new User object with email and password
            user = User.objects.create_user(username=email, email=email, password=password)
            # create new Driver object using User object we just created and POST data
            new_driver = Driver.objects.create(
                user = user,
                goverment_id = request.data.get('govermentId'),
                department = request.data.get('department'),
                name = request.data.get('firstname'),
                surname = request.data.get('lastname'),
                middle_name = request.data.get('middlename'),
                address = request.data.get('address'),
                phone = request.data.get('phone'),
                email = request.data.get('email'),
                license_code = request.data.get('license'),
                password = password,
            )
        except:
            return Response({'message': "Wrong data format or missing data"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = DriverSerializer(new_driver, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getDriversPaginated(request):
    # initialize paginator and get paginator instance
    paginator = PageNumberPagination()
    # set number of results returned per 1 request
    paginator.page_size = 8
    # get all drivers
    drivers = Driver.objects.all()
    # paginate drivers list
    result_page = paginator.paginate_queryset(drivers, request)
    # serialze and return data
    serializer = DriverSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)     



# Handle single driver methods
# retrieve single driver data, update driver data, delete driver
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def driver_detail(request, pk):
    try:
        # get driver by unique identifier
        driver = Driver.objects.get(pk=pk)
    except Exception as e:
        # in case if there is no driver with such id, or any other unexpected eror
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # process different methods
    if request.method == 'GET':
        # serialize driver data and convert it to appropriate format
        serializer = DriverSerializer(driver, many=False)
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        if 'email' in request.data:
            request.data.pop('email')
        if 'user' in request.data:
            request.data.pop('user')
            
        serializer = DriverSerializer(driver, data=request.data, partial=True)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({'error': "Something went wrong!"}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user = driver.user
        driver.delete()
        user.delete()
        return Response({'message': 'Driver object deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


def getCompletedTaksData(driver):
    report = dict()
    # get all associated completed routes which represent completed tasks
    routes = driver.routes.all().order_by('time_from')

    for record in routes:
        # make sure that there is an array to store value under each key
        if not record.time_from.year in report:
            report[record.time_from.year] = []

        # stores values under year key
        report[record.time_from.year].append({
            'month': record.time_from.strftime('%B'), 
            'count': 1, 
            'distance': record.distance_covered,
            'time_spent': record.time_spent,
        })
    
    # iterate through all data and combine values for same keys
    for year in report:
        result = {}
        for entry in report[year]:
            month = entry["month"]
            count = entry["count"]
            distance = entry["distance"]
            time_spent = entry["time_spent"]
            
            if month in result:
                result[month]["count"] += count
                result[month]["distance"] += distance
                result[month]["time_spent"] += time_spent
            else:
                result[month] = {"count": count, "distance": distance, "time_spent": time_spent}

        # Convert the result back to a list of dictionaries
        combined_data = [{"month": month, "count": data["count"], "distance": data["distance"], "time_spent": data["time_spent"]} for month, data in result.items()]
        report[year] = combined_data

    return report




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getDriverReportData(request, pk):
    try:
        # get driver by driver id from the url
        driver = Driver.objects.get(pk=pk)
        # create report dictionary to store all information
        report = dict()
        # get data

        report['completed_tasks'] = getCompletedTaksData(driver=driver)
        
        
        # return data
        return Response(report)
    except:
        return Response({'error': "Driver does not exist"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def driverDataSavePDF(request, pk):
    try:
        # get driver by driver id from the url
        driver = Driver.objects.get(pk=pk)
        # check if there is already reports on driver
        if len(DriverReport.objects.filter(driver=driver)) > 0:
            # if vehicle has reports update the file and date
            driver_reprot = driver.reports.all()[0]
            driver_reprot.report_file = request.FILES.get('pdfFile')
            driver_reprot.date = datetime.now().strftime('%Y-%m-%d')
        else:
            # otherwise create new report
            DriverReport.objects.create(
                driver = driver,
                report_file = request.FILES.get('pdfFile')
            )

        return Response({'status': 'ok'})
    except:
        return Response({'error': "Driver does not exist"}, status=status.HTTP_400_BAD_REQUEST)




def getFuelingData(vehicle):
    report = dict()
    # get all associated fueling reports
    fueling_reports = vehicle.fueling_proofs.all().order_by('date')
    # iterate through fueling reports and save relevant data for constructing graph such as date and fuel amount
    # the goal is to construct object with keys as years and each will have list which contains objects in format of month and fuel amount
    # example:
    # {
    #   2023: [ {'Oct': 50}, {'Sep': 95} ],
    #   2022: [ {'Sep': 15}, {'Nov': 43} ]
    # }
    for fuel_rep in fueling_reports:
        # append data under keys with months
        if fuel_rep.date.year in report:
            report[fuel_rep.date.year].append({'month': fuel_rep.date.strftime('%B'), 'amount': fuel_rep.amount})
        else:
            report[fuel_rep.date.year] = [{'month': fuel_rep.date.strftime('%B'), 'amount': fuel_rep.amount}]
    
    # iterate through all data and combine values for same keys
    for year in report:
        result = {}
        for entry in report[year]:
            month = entry["month"]
            amount = entry["amount"]
            
            if month in result:
                result[month] += amount
            else:
                result[month] = amount

        combined_data = [{"month": month, "amount": result[month]} for month in result]
        report[year] = combined_data

    return report

def getMaintenanceData(vehicle):
    report = dict()
    # get all associated maintenance records
    maintenance_records = vehicle.maintenance_records.all().order_by('date')
    for rec in maintenance_records:
        # append data under keys with months
        if rec.date.year in report:
            report[rec.date.year].append({'month': rec.date.strftime('%B'), 'count': 1, 'cost': rec.cost})
        else:
            report[rec.date.year] = [{'month': rec.date.strftime('%B'), 'count': 1, 'cost': rec.cost}]
    
    # iterate through all data and combine values for same keys
    for year in report:
        result = {}
        for entry in report[year]:
            month = entry["month"]
            count = entry["count"]
            cost = entry["cost"]
            
            if month in result:
                result[month]["count"] += count
                result[month]["cost"] += cost
            else:
                result[month] = {"count": count, "cost": cost}

        # Convert the result back to a list of dictionaries
        combined_data = [{"month": month, "count": data["count"], "cost": data["cost"]} for month, data in result.items()]
        report[year] = combined_data

    # return data
    return report
            

def getUsageData(vehicle):
    report = dict()
    # get all associated usage records
    completed_routes = vehicle.completed_routes.all().order_by('time_from')
    for record in completed_routes:
        # append data under keys with months
        if record.time_from.year in report:
            report[record.time_from.year].append({'month': record.time_from.strftime('%B'), 'count': 1, 'distance': record.distance_covered})
        else:
            report[record.time_from.year] = [{'month': record.time_from.strftime('%B'), 'count': 1, 'distance': record.distance_covered}]
    
    # iterate through all data and combine values for same keys
    for year in report:
        result = {}
        for entry in report[year]:
            month = entry["month"]
            count = entry["count"]
            distance = entry["distance"]
            
            if month in result:
                result[month]["count"] += count
                result[month]["distance"] += distance
            else:
                result[month] = {"count": count, "distance": distance}

        # Convert the result back to a list of dictionaries
        combined_data = [{"month": month, "count": data["count"], "distance": data["distance"]} for month, data in result.items()]
        report[year] = combined_data
    # return data
    return report


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getReportData(request, pk):
    try:
        # get vehicle by vehicle id from the url
        vehicle = Vehicle.objects.get(pk=pk)
        # create report dictionary to store all information
        report = dict()
        # get data
        report['fueling'] = getFuelingData(vehicle=vehicle)
        report['maintenance'] = getMaintenanceData(vehicle=vehicle)
        report['usage'] = getUsageData(vehicle=vehicle)
        # return data
        return Response(report)
    except:
        return Response({'error': "Vehicle does not exist"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getReportDataSavePDF(request, pk):
    try:
        # get vehicle by vehicle id from the url
        vehicle = Vehicle.objects.get(pk=pk)
        # check if there is already reports on vehicle
        if len(VehicleReport.objects.filter(vehicle=vehicle)) > 0:
            # if vehicle has reports update the file and date
            veh_reprot = vehicle.reports.all()[0]
            veh_reprot.report_file = request.FILES.get('pdfFile')
            veh_reprot.date = datetime.now().strftime('%Y-%m-%d')
        else:
            # otherwise create new report
            VehicleReport.objects.create(
                vehicle = vehicle,
                report_file = request.FILES.get('pdfFile')
            )

        return Response({'status': 'ok'})
    except:
        return Response({'error': "Vehicle does not exist"}, status=status.HTTP_400_BAD_REQUEST)















@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def addFueling(request):
    # try:
    pwgen = PasswordGenerator()
    password = pwgen.generate()
    email = request.data.get('email')
    user = User.objects.create_user(
        username=email, 
        email=email, 
        password=password
    )
    new_obj = FuelingPerson.objects.create(
        user = user,
        name = request.data.get('firstname'),
        surname = request.data.get('lastname'),
        middle_name = request.data.get('middlename'),
        phone = request.data.get('phone'),
        email = request.data.get('email'),
        password = password,
    )
    # except:
    #     raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)

    serializer = FuelingSerializer(new_obj, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def addMaintenance(request):
    try:
        pwgen = PasswordGenerator()
        password = pwgen.generate()
        email = request.data.get('email')
        user = User.objects.create_user(
            username=email, 
            email=email, 
            password=password
        )
        new_obj = MaintenancePerson.objects.create(
            user = user,
            name = request.data.get('firstname'),
            surname = request.data.get('lastname'),
            middle_name = request.data.get('middlename'),
            phone = request.data.get('phone'),
            email = request.data.get('email'),
            password = password
        )
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)

    serializer = MaintenanceSerializer(new_obj, many=False)
    return Response(serializer.data)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getFueling(request):
    staff = FuelingPerson.objects.all()
    serializer = FuelingSerializer(staff, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getMaintenance(request):
    staff = MaintenancePerson.objects.all()
    serializer = MaintenanceSerializer(staff, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin', 'fueling', 'maintenance'])
def vehicles_list(request):
    if request.method == 'GET':   
        # get all vehicles
        vehicles = Vehicle.objects.all()
        # serialze and return data
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        try:
            # create new Vehicles
            new_veh = Vehicle.objects.create(
                make = request.data.get('make'),
                model = request.data.get('model'),
                type = request.data.get('type'),
                year = request.data.get('year'),
                license_plate = request.data.get('license_plate'),
                capacity = request.data.get('capacity'),
                mileage = request.data.get('mileage')
            )
        except:
            return Response({'message': "Wrong data format or missing data"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = VehicleSerializer(new_veh, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin', 'fueling', 'maintenance'])
def getVehiclesPaginated(request):
    paginator = PageNumberPagination()
    paginator.page_size = 5

    vehicles = Vehicle.objects.all()
    result_page = paginator.paginate_queryset(vehicles, request)
    serializer = VehicleSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin', 'fueling', 'maintenance'])
def getVehicle(request, vid):
    try:
        vehicle = Vehicle.objects.get(id=vid)
    except:
        raise ValidationError("Wrong vehicle id", code=status.HTTP_400_BAD_REQUEST)

    serializer = VehicleSerializer(vehicle, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVehicleFuelingReports(request, vid):
    try:
        vehicle = Vehicle.objects.get(id=vid)
        reports = FuelingProof.objects.filter(vehicle=vehicle)
    except:
        raise ValidationError("Wrong vehicle id", code=status.HTTP_400_BAD_REQUEST)

    serializer = FuelingProofSerializer(reports, many=True)
    return Response(serializer.data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAppointments(request):
    paginator = PageNumberPagination()
    paginator.page_size = 8
    appointments = Appointment.objects.all()
    result_page = paginator.paginate_queryset(appointments, request)
    serializer = AppointmentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def getAppointment(request, aid):
    try:
        appointment = Appointment.objects.get(id=aid)
    except:
        raise ValidationError("Appoitnment does not exist!", code=status.HTTP_400_BAD_REQUEST)

    serializer = AppointmentSerializer(appointment, many=False)
    return Response(serializer.data)



@api_view(['GET', 'POST'])
def getTimes(request):
    t1 = request.data.get('startTime')
    t2 = request.data.get('endTime')
    print(t1)
    print(t2)
    drivers = Driver.objects.all()
    res = []
    for d in drivers:
        for t in d.tasks.all():
            t3 = t.time_from.astimezone(pytz.timezone('Asia/Almaty')).replace(microsecond=0).strftime('%Y-%m-%dT%H:%M')
            t4 = t.time_to.astimezone(pytz.timezone('Asia/Almaty')).replace(microsecond=0).strftime('%Y-%m-%dT%H:%M')
            if do_time_windows_overlap(t1, t2, str(t3),str(t4)):
                res.append({'driver': d.id,'car': t.car.id})
    return Response(res)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def createTask(request):
    try:
        driver_id = request.data.get('driver')
        driver_obj = Driver.objects.get(id=driver_id)
        veh_id = request.data.get('car')
        vehicle = Vehicle.objects.get(id=veh_id)

        input_datetime1 = datetime.strptime(request.data.get('startDate'), "%Y-%m-%dT%H:%M")
        input_datetime2 = datetime.strptime(request.data.get('endDate'), "%Y-%m-%dT%H:%M")

        new_task = Task.objects.create(
            driver=driver_obj,
            car=vehicle,
            description=request.data.get('description'),
            from_point=request.data.get('from_point'),
            to_point=request.data.get('to_point'),
            time_from=timezone.make_aware(input_datetime1, timezone.get_current_timezone()),
            time_to=timezone.make_aware(input_datetime2, timezone.get_current_timezone()),
        )

    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    
    serializer = TaskSerializer(new_task, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['admin'])
def deleteProcessedAppointment(request, aid):
    try:
        appointment = Appointment.objects.get(id=aid)
        print(appointment)
        deleted_objs = appointment.delete()
        if not deleted_objs[0] > 0:
            raise ValidationError("Appoitnment does not exist!", code=status.HTTP_400_BAD_REQUEST)
    except:
        raise ValidationError("Appoitnment does not exist!", code=status.HTTP_400_BAD_REQUEST)
    
    return Response({'status': deleted_objs[0]>0})




## -- For API calls From Driver -- ##

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def makeAppointment(request):
    try:
        new_appointment = Appointment.objects.create(
            currentPosition = request.data.get('currentPosition'),
            destination = request.data.get('destination'),
            description = request.data.get('description'),
            car_type = request.data.get('carPereferences'),
            time_from = request.data.get('startDate'),
            time_to = request.data.get('endDate'),
            additionalInfo = request.data.get('additionalInfo'),
            number_of_people = request.data.get('numberOfPeople'),
            driver = request.user.driver_acc,
        )
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    serializer = AppointmentSerializer(new_appointment, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def getDriver(request):
    driver = request.user.driver_acc
    serializer = DriverSerializer(driver, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getTasks(request):
    paginator = PageNumberPagination()
    paginator.page_size = 8
    tasks = Task.objects.all()
    result_page = paginator.paginate_queryset(tasks, request)
    serializer = TaskSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver', 'admin'])
def task_detail(request, pk):
    try:
        # get task by unique identifier
        task = Task.objects.get(pk=pk)
    except Exception as e:
        # in case if there is no driver with such id, or any other unexpected eror
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # process different methods
    if request.method == 'GET':
        # serialize driver data and convert it to appropriate format
        serializer = TaskSerializer(task, many=False)
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']: 
        # since driver and vehicle/car are nested objects we need to process them separately, since it is not done by default
        if 'driver' in request.data:
            try:
                # get driver by its id and remove driver data from request.data since we already processing it
                driver = Driver.objects.get(id=request.data.pop('driver')) 
                # manually update task driver field and save changes
                task.driver = driver
                task.save()
            except:
                return Response({'error': "Driver doesn't exist!"}, status=status.HTTP_400_BAD_REQUEST)

        if 'car' in request.data:
            try:
                # get car by its id and remove car data from request.data since we already processing it
                car = Vehicle.objects.get(id=request.data.pop('car')) 
                # manually update task car field and save changes
                task.car = car
                task.save()
            except:
                return Response({'error': "Vehicle doesn't exist!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # if there are changes to other simple fields, they will be handled automatically
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({'error': "Wrong data format!"}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        task.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def updateTask(request, tid):
    try:
        task = Task.objects.get(id=tid)
        task.status = request.data.get('status')
        task.time_from = request.data.get('timeStarted')
        task.save()

    except:
        raise ValidationError("Task does not exist", code=status.HTTP_400_BAD_REQUEST)

    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def getDriverTasks(request):
    try:
        tasks = Task.objects.filter(driver=request.user.driver_acc, status="Assigned")
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def getRoutesHistory(request):
    try:
        routes = CompletedRoute.objects.filter(driver=request.user.driver_acc)
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = CompletedRouteSerializer(routes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['driver'])
def completeTask(request, tid):
    try:
        task = Task.objects.get(id=tid)
        task.status = "Completed"
        time_spent = request.data.get('time_spent')
        timeEnded = request.data.get('timeEnded')
        task.time_to = timeEnded

        distance_covered = request.data.get('distance_covered')
        vehicle = task.car
        vehicle.mileage = vehicle.mileage + distance_covered
        vehicle.save()
        task.save()

        comp_route = CompletedRoute.objects.create(
            driver = request.user.driver_acc,
            from_point = task.from_point,
            to_point = task.to_point,
            time_from = task.time_from,
            time_to = timeEnded,
            time_spent = time_spent,
            distance_covered = distance_covered
        )

    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = CompletedRouteSerializer(comp_route, many=False)
    return Response(serializer.data)



# Fueling
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['fueling'])
def getFuelingReports(request):
    try:
        reports = request.user.fueling_acc.fueling_proofs.all()
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = FuelingProofSerializer(reports, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['fueling'])
def addFuelingReport(request):
    try:
        veh_id = request.data.get('car')
        vehicle = Vehicle.objects.get(id=veh_id)
        upload_time = datetime.strptime(request.data.get('datetime'), "%Y-%m-%dT%H:%M")
        new_obj = FuelingProof.objects.create(
            vehicle=vehicle,
            fueling_person=request.user.fueling_acc,
            image_before=request.FILES.get('image_before'),
            image_after=request.FILES.get('image_after'),
            date=timezone.make_aware(upload_time, timezone.get_current_timezone()),
            type = request.data.get('fuelType'),
            amount = request.data.get('amount'),
            cost = request.data.get('cost'),
        )

    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = FuelingProofSerializer(new_obj, many=False)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_type_required(['maintenance'])
def getMaintenanceJobs(request):
    try:
        jobs = MaintenanceJob.objects.filter(maintenance_person=request.user.maintenance_acc)
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = MaintenanceJobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_type_required(['maintenance'])
def addMaintenanceJob(request):
    try:
        veh_id = request.data.get('vehicle')
        vehicle = Vehicle.objects.get(id=veh_id)
        schedule_time = datetime.strptime(request.data.get('datetime'), "%Y-%m-%dT%H:%M")

        new_obj = MaintenanceJob.objects.create(
            vehicle=vehicle,
            description = request.data.get('description'),
            maintenance_person=request.user.maintenance_acc,
            date=timezone.make_aware(schedule_time, timezone.get_current_timezone()),
        )

    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    serializer = MaintenanceJobSerializer(new_obj, many=False)
    return Response(serializer.data)