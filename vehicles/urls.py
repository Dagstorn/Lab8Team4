from django.urls import path
from . import views

urlpatterns = [
    path('', views.vehicles_list, name="vehicles_list"),
    path('add/', views.vehicles_add, name="vehicles_add"),
    path('details/<str:vid>/', views.vehicles_detail, name="vehicles_detail"),
]