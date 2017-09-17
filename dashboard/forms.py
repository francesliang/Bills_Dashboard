from django import forms
from registration.forms import RegistrationForm

from dashboard.models import User


class BillsRegistrationForm(RegistrationForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email']