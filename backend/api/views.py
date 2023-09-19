from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import DriverSerializer
from accounts.models import Driver
from rest_framework.permissions import IsAuthenticated, IsAdminUser



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDriver(request):
    driver = request.user.driver_acc
    serializer = DriverSerializer(driver, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDrivers(request):
    drivers = Driver.objects.all()
    serializer = DriverSerializer(drivers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRole(request):
    if hasattr(request.user, 'admin_acc'):
        role = "admin"
    elif hasattr(request.user, 'driver_acc'):
        role = "driver"
    elif hasattr(request.user, 'fueling_acc'):
        role = "fueling"
    elif hasattr(request.user, 'maintenance_acc'):
        role = "maintenance"
    else:
        role = "default1"

    return Response({'role': role})


