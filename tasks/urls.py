from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.make_appointment, name="make_appointment"),
    path('list/', views.appointments_list, name="appointments_list"),

    path('process/<str:aid>/', views.process_appointment, name="process_appointment"),

    path('tasks/', views.tasks_list, name="tasks_list"),
    path('tasks/view/<str:tid>/', views.task_view, name="task_view"),

]