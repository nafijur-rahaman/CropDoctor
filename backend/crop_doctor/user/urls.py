from django.urls import path
from .views import (

    UserRegisterView,
    UserLoginView,
    UserLogoutView,
    
    UserProfileView,
    UserChangePasswordView,
    
    ReviewView,
    GetAllReview,
)


urlpatterns = [
    
    
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('change-password/', UserChangePasswordView.as_view(), name='user-change-password'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    
    
    path('user-profile/', UserProfileView.as_view(), name='user-view'),
    path("update-profile/", UserProfileView.as_view(), name="update-profile"),
    
    
    
    path('review/', ReviewView.as_view(), name='user-review'),
    path('get-all-review/', GetAllReview.as_view(), name='get-all-review'),


]
