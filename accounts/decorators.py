from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect


# custom decorator to allow only certain user types to access the view
def user_type_required(allowed_user_types, return_to='homepage'):
    # takes array of strings as an argument
    # representing different user types, like : ['admin', 'driver']
    # also takes optional return_to argument
    # default value is homepage, but different url name can be specified

    # decorator function wraps the original View function
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # access the user object to examine its type
            user = request.user

            # for all user types in allowed_user_types check if current user has such One to one connection in Database
            for user_type in allowed_user_types:
                # OneToOne related_name users specific form, for example admin_acc
                # therefore we add _acc to user type
                db_related_name = user_type + "_acc"
                # check for such attribute
                if hasattr(user, db_related_name):
                    # current user have user type which is allowed
                    # we can call original view function
                    return view_func(request, *args, **kwargs)
            # redirect user to specified or default page
            return redirect(return_to)
        # return new wrapper logic
        return _wrapped_view
    return decorator
