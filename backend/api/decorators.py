from functools import wraps
from rest_framework.response import Response
from rest_framework import status



# custom decorator to allow only certain user types to access the view
def user_type_required(allowed_user_types):
    # takes array of strings as an argument
    # representing different user types, like : ['admin', 'driver']

    # decorator function wraps the original function
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # access the user object to examine its type
            user = request.user

            # for all user types in allowed_user_types check if current user belongs to any of those types
            for user_type in allowed_user_types:
                # User has OneToOne connection to one of the accoutn types: driver, admin, fuelingperson or maintenanceperson
                # Therefore, each user has own related_name attribute in specific form, for example admin_acc
                # therefore we add _acc to user type
                db_related_name = user_type + "_acc"
                # check for such attribute
                if hasattr(user, db_related_name):
                    # current user have user type which is allowed
                    # we can call original view function
                    return view_func(request, *args, **kwargs)
            # user does not belong to any of the allowed user types
            return Response({'error': "You don't have correct role to make an API call"}, status=status.HTTP_400_BAD_REQUEST)
        # return new wrapper logic
        return _wrapped_view
    return decorator
