from django.shortcuts import render

def homepage(request):
    user_role = "admin"
    context = {
        'user_role': user_role
    }
    return render(request, 'home/homepage.html', context)
