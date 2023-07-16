from django.contrib import admin
from fine_api import models

admin.site.register(models.UserProfile)
admin.site.register(models.ChatMessage)
admin.site.register(models.CombinedChat)