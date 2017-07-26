from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from dashboard.models import Bills
from dashboard.admin import email_alert


def check_duedate(to_email_list, bill_name=None, alert_days=3):
    today = datetime.today()
    msg_base = "Bill %s is due on %s."
    from_email = "bills.dashboard@gmail.com"

    if bill_name is None:
        bills = Bills.objects.all().values_list('name', flat=True)
        bills = list(set(bills))
    else:
        bills = [bill_name]

    for bill in bills:
        duedates = Bills.objects.filter(name=bill).orderby('-due_date')
        duedate = duedates[0]
        time_delta = duedate - today
        if 0 < time_delta.days <= alert_days:
            msg = msg_base % (bill_name, duedate.strftime('%Y-%m-%d'))
            email_alert(msg, from_email, to_email_list)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('bill_name', type=str, help='Bill Name')
        parser.add_argument('email_list', type=str, help='List of emails separated by commas')
        parser.add_argument('alert_days', type=int, help='Number of days ahead for alert')

    def handle(self, *arg, **options):
        bill_name = options.get('bill_name', None)
        email_list = options.get('email_list', []).split(',')
        alert_days = options.get('alert_days', 3)

        check_duedate(email_list, bill_name=bill_name, alert_days=alert_days)