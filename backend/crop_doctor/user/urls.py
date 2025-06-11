from django.urls import path
from .views import (
    UserView,
    UserRegisterView,
    UserLoginView,
    UserProfileView,
    UserChangePasswordView
)


urlpatterns = [
    path('user-profile/', UserView.as_view(), name='user-view'),
    path("update-profile/", UserProfileView.as_view(), name="update-profile"),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('change-password/', UserChangePasswordView.as_view(), name='user-change-password'),
    
]
