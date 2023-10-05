from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/token/verify/', TokenVerifyView.as_view(), name='token_verify'),


    # from admin
    path('drivers/', views.getDrivers),
    path('drivers/add/', views.addDriver),
    
    path('vehicles/', views.getVehicles),
    path('vehicles/<str:vid>/', views.getVehicle),
    path('vehicles/<str:vid>/fueling/', views.getVehicleFuelingReports),
    path('appointments/', views.getAppointments),
    path('appointments/add/', views.makeAppointment),
    path('appointments/<str:aid>/', views.getAppointment),

    path('fueling/add/', views.addFueling),
    path('maintenance/add/', views.addMaintenance),
    path('getstaff/fueling/', views.getFueling),
    path('getstaff/maintenance/', views.getMaintenance),


    # from driver
    path('driver/', views.getDriver),
    path('tasks/', views.getTasks),
    path('tasks/add/', views.createTask),
    path('tasks/<str:tid>/', views.getTask),
    path('tasks/<str:tid>/update/', views.updateTask),
    path('tasks/checktime/', views.getTimes),
    path('tasks/<str:aid>/deleteappointment/', views.deleteProcessedAppointment),
    
    path('driver/tasks/', views.getDriverTasks),
    path('routes_history/', views.getRoutesHistory),
    path('tasks/<str:tid>/complete/', views.completeTask),


    # fueling
    path('fueling/reports/', views.getFuelingReports),
    path('fueling/reports/add/', views.addFuelingReport),

    # maintenance
    path('maintenance/jobs/', views.getMaintenanceJobs),
    path('maintenance/jobs/add/', views.addMaintenanceJob),

]
