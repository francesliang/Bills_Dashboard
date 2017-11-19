import os, sys
from celery import task, group

from dashboard.management.commands.duedate_alert import check_duedate

@task()
def test_celery(msg):
    print (msg)


@task()
def check_bill_duedate():
    from dashboard.models import User
    users = User.objects.all()
    for user in users:
        print user
        check_duedate(user.username)



@task()
def check_bills():
    from dashboard.models import User
    users = User.objects.all()
    user_group = group(check_bill_duedate.s(user.username,) for user in users)
    user_group()