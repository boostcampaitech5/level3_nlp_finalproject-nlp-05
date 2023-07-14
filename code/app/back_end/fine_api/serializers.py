from .models import UserProfile
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