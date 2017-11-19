import os, sys
from celery import task

from django.contrib.auth.models import User
from dashboard.management.commands.duedate_alert import check_duedate

@task()
def test_celery(msg):
    print (msg)


@task()
def check_bill_duedate():
    users = User.objects.all()
    for user in users:
        print user
        check_duedate(user)