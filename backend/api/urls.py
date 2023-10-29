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

    # from 
    path('drivers/', views.drivers_list),
    path('drivers/paginated/', views.getDriversPaginated),
    path('drivers/<str:pk>/', views.driver_detail),
    path('drivers/<str:pk>/report_data/', views.getDriverReportData),
    path('drivers/<str:pk>/report_data/savePDF', views.driverDataSavePDF),


    path('reports/', views.general_reports),
    
    path('vehicles/', views.vehicles_list),
    path('vehicles/paginated/', views.getVehiclesPaginated),
    path('vehicles/<str:vid>/', views.getVehicle),
    path('vehicles/<str:vid>/fueling/', views.getVehicleFuelingReports),
    path('vehicles/<str:pk>/report_data/', views.getReportData),

    path('vehicles/<str:pk>/report_data/savePDF', views.getReportDataSavePDF),



    path('appointments/paginated/', views.getAppointments),
    path('appointments/add/', views.makeAppointment),
    path('appointments/<str:aid>/', views.getAppointment),

    path('fueling/add/', views.addFueling),
    path('maintenance/add/', views.addMaintenance),
    path('getstaff/fueling/', views.getFueling),
    path('getstaff/maintenance/', views.getMaintenance),



    path('tasks/paginated/', views.getTasks),
    path('tasks/checktime/', views.getTimes),
    path('tasks/add/', views.createTask),
    path('tasks/<str:pk>/', views.task_detail),

    path('tasks/<str:tid>/update/', views.updateTask),

    path('tasks/<str:aid>/deleteappointment/', views.deleteProcessedAppointment),
    
    path('driver/tasks/', views.getDriverTasks),
    path('routes_history/', views.getRoutesHistory),
    path('tasks/<str:tid>/complete/', views.completeTask),


    path('auction/', views.auction_vehicles),
    # path('auction/<str:pk/', views.auction_vehicle_detail),


    # from driver
    path('driver/', views.getDriver),

    # fueling
    path('fueling/reports/', views.getFuelingReports),
    path('fueling/reports/add/', views.addFuelingReport),

    # maintenance
    path('maintenance/jobs/', views.getMaintenanceJobs),
    path('maintenance/jobs/add/', views.addMaintenanceJob),

]
