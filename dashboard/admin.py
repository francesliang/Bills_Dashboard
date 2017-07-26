from django.contrib import admin
from django.core.mail import send_mail

# Register your models here.

def email_alert(msg, from_email, to_email_list):
    subject = 'Bill Dashboard Email Alert'

    send_mail(subject, msg, from_email, to_email_list)