from __future__ import absolute_import, unicode_literals
import os

from celery import Celery, group
from celery.schedules import crontab

from dashboard import tasks

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billsdashboard.settings')

app = Celery('billsdashboard')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

'''
@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=14, minute=10),
        tasks.check_bill_duedate.s(to_email_list),
        #crontab(10.0),
        #test_celery.s('Celery scheduler running!'),
        #name='every 10 secs'
    )

    sender.add_periodic_task(crontab(10.0), tasks.test_celery.s('test celery'), name='add every 10')
'''