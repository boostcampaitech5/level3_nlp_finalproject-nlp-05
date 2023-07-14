from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
from django.urls import path

urlpatterns = [
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/", AuthAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path('google/login', google_login, name='google_login'),
    path('google/callback/', google_callback, name='google_callback'),
    path('google/login/finish/', GoogleLogin.as_view(), name='google_login_todjango'),
]
