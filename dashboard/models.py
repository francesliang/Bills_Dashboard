from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    alert_enabled = models.BooleanField(default=False)

class Bills(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    due_date = models.DateTimeField()
    amount = models.FloatField()




