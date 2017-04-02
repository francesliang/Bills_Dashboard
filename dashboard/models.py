from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Bills(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    due_date = models.DateTimeField()
    amount = models.FloatField()
