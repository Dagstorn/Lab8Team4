from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    # JWT authentication by DRF
    path('users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # ===============================
    
    # ADMIN API endpoints
    ## Drivers
    path('drivers/', views.drivers_list),
    path('drivers/paginated/', views.getDriversPaginated),
    path('drivers/<str:pk>/', views.driver_detail),
    path('drivers/<str:pk>/report_data/', views.getDriverReportData),
    path('drivers/<str:pk>/report_data/savePDF', views.driverDataSavePDF),

    ## Reports
    path('reports/', views.general_reports),
    
    ## Vehicles
    path('vehicles/', views.vehicles_list),
    path('vehicles/paginated/', views.getVehiclesPaginated),
    path('vehicles/<str:pk>/', views.vehicle_detail),
    path('vehicles/<str:pk>/report_data/', views.getReportData),
    path('vehicles/<str:pk>/report_data/savePDF', views.getReportDataSavePDF),

    ## Appointments
    path('appointments/paginated/', views.getAppointments),
    path('appointments/add/', views.makeAppointment),
    path('appointments/<str:aid>/', views.getAppointment),
    
    ## Tasks 
    path('tasks/paginated/', views.getTasks),
    path('tasks/checktime/', views.getTimes),
    path('tasks/add/', views.createTask),
    path('tasks/<str:pk>/', views.task_detail),
    path('tasks/<str:tid>/update/', views.updateTask),
    path('tasks/<str:aid>/deleteappointment/', views.deleteProcessedAppointment),
    
    ## Staff - fueling and maintenance
    path('staff/fueling/', views.fueling_staff),
    path('staff/fueling/<str:pk>/', views.fueling_detail),
    path('staff/maintenance/', views.maintenance_staff),
    path('staff/maintenance/<str:pk>/', views.maintenance_detail),

    
    ## Auction vehicles
    path('auction/', views.auction_vehicles),

    # ===============================

    # DRIVER API endpoints
    path('driver/', views.getDriver),
    path('driver/tasks/', views.getDriverTasks),
    path('routes_history/', views.getRoutesHistory),
    path('tasks/<str:tid>/complete/', views.completeTask),

    # FUELING PERSON API endpoints
    path('fueling/reports/', views.getFuelingReports),
    path('fueling/reports/add/', views.addFuelingReport),

    # MAINTENANCE PERSON API endpoints
    path('maintenance/perosnal_data/', views.maintenance_personal_data),
    path('maintenance/jobs/', views.maintenance_jobs_list),
    path('maintenance/jobs/<str:pk>/', views.maintenance_jobs_detail),
    path('maintenance/jobs/<str:pk>/parts/', views.maintenance_parts),
    path('maintenance/jobs/<str:pk>/complete/', views.maintenance_jobs_complete),
    path('maintenance/vehicles/paginated/', views.maintenance_vehicle_list),
    path('maintenance/vehicles/<str:pk>/', views.maintenance_vehicle_detail),

]
