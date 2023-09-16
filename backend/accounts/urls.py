from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.signin, name="signin"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.register, name="register"),


    # Admin related
    path('staff/', views.staff_list, name="staff_list"),
    path('drivers/', views.drivers_list, name="drivers_list"),
    path('drivers/add/', views.drivers_add, name="drivers_add"),
    path('drivers/edit/<str:uid>/', views.drivers_edit, name="drivers_edit"),
    path('drivers/delete/<str:uid>/', views.drivers_delete, name="drivers_delete"),
    path('drivers/details/<str:username>/', views.drivers_detail, name="drivers_detail"),



    path('drivers/personal/<str:username>/', views.drivers_personal_page, name="drivers_personal_page"),





]