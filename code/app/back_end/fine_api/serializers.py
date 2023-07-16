from .models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            email = validated_data['email'],
            password = validated_data['password']
        )

        return user

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'message', 'created_at', 'user')

class CombinedChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CombinedChat
        fields = ('id', 'combined_message', 'created_at', 'user')
