from .views import *
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()
router.register('profile', UserProfileViewSet)
router.register(r'chat-messages', ChatMessageViewSet, basename='chat-message')
router.register(r'combined-chats', CombinedChatViewSet,
                basename='combined-chat')

urlpatterns = [
    path('google/login', google_login, name='google_login'),
    path('google/callback/', google_callback, name='google_callback'),
    path('google/login/finish/', GoogleLogin.as_view(), name='google_login_todjango'),
    path('', include(router.urls)),
]
