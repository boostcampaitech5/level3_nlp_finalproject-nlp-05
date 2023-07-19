from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import status
from rest_framework.response import Response
import jwt
from django.contrib.auth import authenticate
from django.shortcuts import render, get_object_or_404
from fine_project.settings import SECRET_KEY
import os
from django.shortcuts import redirect
from json import JSONDecodeError
from django.http import JsonResponse
import requests
from .models import *
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google import views as google_view
from datetime import date
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, filters
from .permissions import *
from rest_framework.authentication import TokenAuthentication

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": "register successs",
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )

            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)

            return res
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthAPIView(APIView):
    def get(self, request):
        try:
            access = request.COOKIES['access']
            payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
            pk = payload.get('user_id')
            user = get_object_or_404(UserProfile, pk=pk)
            serializer = UserSerializer(instance=user)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except(jwt.exceptions.ExpiredSignatureError):
            data = {'refresh': request.COOKIES.get('refresh', None)}
            serializer = TokenRefreshSerializer(data={'refresh': request.COOKIES.get('refresh_token', None)})

            if serializer.is_valid(raise_exception=True):
                access = serializer.data.get('access', None)
                refresh = serializer.data.get('refresh', None)
                payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
                pk = payload.get('user_id')
                user = get_object_or_404(UserProfile, pk=pk)
                serializer = UserSerializer(instance=user)
                res = Response(serializer.data, status=status.HTTP_200_OK)
                res.set_cookie('access', access)
                res.set_cookie('refresh', refresh)
                return res
            raise jwt.exceptions.InvalidTokenError

        except(jwt.exceptions.InvalidTokenError):
            return Response({"message": "로그인이 만료되었습니다."}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )
        if user is not None:
            serializer = UserSerializer(user)
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": "login success",
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)
            return res
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        response = Response({
            "message": "Logout success"
            }, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response

state = os.environ.get("STATE")
BASE_URL = 'http://ec2-43-201-149-19.ap-northeast-2.compute.amazonaws.com/'
GOOGLE_CALLBACK_URI = BASE_URL + 'api/user/google/callback/'

def google_login(request):
    scope = "https://www.googleapis.com/auth/userinfo.email"
    client_id = os.environ.get("SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={GOOGLE_CALLBACK_URI}&scope={scope}")

def google_callback(request):
    client_id = os.environ.get("SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    client_secret = os.environ.get("SOCIAL_AUTH_GOOGLE_SECRET")
    code = request.GET.get('code')

    token_req = requests.post(f"https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}")
    
    token_req_json = token_req.json()
    error = token_req_json.get("error")

    if error is not None:
        raise JSONDecodeError(error)

    access_token = token_req_json.get('access_token')

    user_req = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}")
    user_req_status = user_req.status_code

    if user_req_status != 200:
        return JsonResponse({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)

    user_req_json = user_req.json()
    email = user_req_json.get('email')
    name = user_req_json.get('name')
    profile_image = user_req_json.get('picture')

    return JsonResponse({"access_token": access_token, "code": code})

class GoogleLogin(SocialLoginView):
    adapter_class = google_view.GoogleOAuth2Adapter
    callback_url = GOOGLE_CALLBACK_URI
    client_class = OAuth2Client

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = UserProfile.objects.get(id=user_id)
                return ChatMessage.objects.filter(user=user)
            except ObjectDoesNotExist:
                return ChatMessage.objects.none()
        else:
            return ChatMessage.objects.none()

    def create(self, request, *args, **kwargs):
        user_id = request.POST["id"]

        user = get_user_by_id(user_id)
        if user is None:
            return Response({"error": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        request_data = request.POST.copy()
        request_data['user'] = user.id
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"chatbot_message": "hello"})

class CombinedChatViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.query_params.get('user_id')

        try:
            user = UserProfile.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        today = date.today()
        chat_messages = ChatMessage.objects.filter(
            user=user, created_at__date=today)
        combined_message = ' '.join(
            [message.message for message in chat_messages])

        combined_chat = CombinedChat.objects.create(
            combined_message=combined_message, user=user)

        combined_chat.save()

        serializer = CombinedChatSerializer(combined_chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

def get_user_by_id(user_id):
    try:
        user = UserProfile.objects.get(id=user_id)
        return user
    except UserProfile.DoesNotExist:
        return None

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = UserProfile.objects.all()
    authentication_classes = (TokenAuthentication, )
    permission_classes = (UpdateOwnProfile, )
    filter_backends = (filters.SearchFilter, )
    search_fields = ('name', 'email', )