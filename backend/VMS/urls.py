from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('accounts/', include('accounts.urls')),
    path('vehicles/', include('vehicles.urls')),
    path('tasks/', include('tasks.urls')),
    path('api/', include('api.urls')),
]
