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

    path('drivers/', views.getDrivers),
    path('drivers/add/', views.addDriver),
    path('user/role/', views.getRole),
    path('vehicles/', views.getVehicles),
    path('appointments/', views.getAppointments),
    path('appointments/add/', views.makeAppointment),
    path('appointments/<str:aid>/', views.getAppointment),

    # from driver
    path('driver/', views.getDriver),
    path('tasks/', views.getTasks),
    path('task/<str:tid>/', views.getTask),
    path('task/<str:tid>/update_status/', views.updateTaskStatus),
    path('tasks/checktime/', views.getTimes),
    path('tasks/create/', views.createTask),
    path('tasks/deleteappointment/<str:aid>/', views.deleteProcessedAppointment),
    path('driver_tasks/', views.getDriverTasks),
    path('routes_history/', views.getRoutesHistory),
    path('complete_task/<str:tid>/', views.completeTask),




]
