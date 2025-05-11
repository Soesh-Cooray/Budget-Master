from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_api, name='login_api'),
    path('signup/', views.signup_api, name='signup_api'), #add this line
]