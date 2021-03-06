"""billsdashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from registration.backends.simple.views import RegistrationView
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings

from dashboard.forms import BillsRegistrationForm
from dashboard import views

urlpatterns = [
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^register/$', RegistrationView.as_view(form_class=BillsRegistrationForm), name='registration_register'),
    url(r'^', include('registration.backends.simple.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.default, name='default'),
    #url(r'^get_bill_detail', views.get_bill_detail, name='get_bill_detail'),
    url(r'^insert_bill', views.insert_bill, name='insert_bill'),
    url(r'^list_bills', views.list_bills, name='list_bills'),
    url(r'^get_last_bills', views.get_last_bills, name='get_last_bills'),
    url(r'^get_bills_summary', views.get_bills_summary, name='get_bills_summary'),
    url(r'^dashboard', views.dashboard, name='dashboard'),
    url(r'^get_bill_overview', views.get_bill_overview, name='get_bill_overview'),
    url(r'^get_bill_history', views.get_bill_history, name='get_bill_history'),
]
urlpatterns += [url(r'^silk/', include('silk.urls', namespace='silk'))]
urlpatterns += staticfiles_urlpatterns()
