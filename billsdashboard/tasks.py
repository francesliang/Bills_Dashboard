import os, sys
from celery import app
from celery.schedules import crontab

from dashboard.management.commands.duedate_alert import check_duedate

to_email_list = ['']

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=8),
        check_bill_duedate.s(to_email_list),
        #crontab(10.0),
        #test_celery.s('Celery scheduler running!'),
        #name='every 10 secs'
    )

@app.task
def test_celery(msg):
    print msg

@app.task
def check_bill_duedate(to_email_list):
    check_duedate(to_email_list)