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

    path('driver/', views.getDriver),
    path('drivers/', views.getDrivers),
    path('user/role/', views.getRole),
    path('vehicles/', views.getVehicles),
    path('appointments/', views.getAppointments),


]
