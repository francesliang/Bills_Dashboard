import json

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from dashboard.models import Bills 

def default(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/login")

    return render(request, 'index.html')

def dashboard(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/login")

    return render(request, 'dashboard.html')

@login_required
def insert_bill(request):
    params = request.POST
    created_date = params.get('created_date')
    bill_name = params.get('bill_name')
    due_date = params.get('due_date')
    amount = params.get('amount')

    obj, is_created = Bills.objects.get_or_create( \
        owner=request.user,
        created=created_date,
        name=bill_name,
        due_date=due_date,
        amount=amount)
    print "insert_bill ", bill_name, due_date, amount

    return HttpResponse(json.dumps({'success': is_created}), content_type="application/json")

@login_required
def list_bills(request):
    bills = list(Bills.objects.filter(owner=request.user).values_list('name', flat=True))
    bills = list(set(bills))

    return HttpResponse(json.dumps(bills), content_type="application/json")

@login_required
def get_last_bills(request):
    data = dict()
    bills = list(Bills.objects.filter(owner=request.user).values_list('name', flat=True))
    for b in bills:
        if b:
            last_b = Bills.objects.filter(owner=request.user, name=b).order_by('-due_date')[0]
            data[b] = {
                'amount': last_b.amount,
                'due_date': last_b.due_date.strftime('%Y-%m-%d')
            }

    print 'last bills', data
    return HttpResponse(json.dumps(data), content_type="application/json")

@login_required
def get_bills_summary(request):
    data = dict()
    bills = list(Bills.objects.filter(owner=request.user).values_list('name', flat=True))
    total = sum(list(Bills.objects.filter(owner=request.user).values_list('amount', flat=True)))
    for b in bills:
        bill = Bills.objects.filter(owner=request.user, name=b)
        percent = sum(bill.values_list('amount', flat=True))/float(total) * 100
        data[b] = round(percent, 1)

    print 'bills summary', data
    return HttpResponse(json.dumps(data), content_type="application/json")

@login_required
def get_bill_overview(request):
    params = request.GET
    bill_name = params.get('bill_name')
    n_records = 12
    last_year = Bills.objects.filter(owner=request.user, name=bill_name).order_by('-due_date')
    if len(last_year) > n_records:
        last_year = last_year[:n_records]
    details = last_year.reverse()

    dates = list(details.values_list('due_date', flat=True))
    dates = [d.strftime('%Y-%m-%d') for d in dates]
    amounts = list(details.values_list('amount', flat=True))
    data = {
        "due_dates": dates,
        "amounts": amounts
    }
    print 'bill overview', data

    return HttpResponse(json.dumps(data), content_type="application/json")

@login_required
def get_bill_history(request):
    params = request.GET
    bill_name = params.get('bill_name')
    from_date = params.get('from_date', None)
    to_date = params.get('to_date', None)

    history = None
    if from_date is not None:
        if to_date is not None:
            history = Bills.objects.filter(owner=request.user, name=bill_name, due_date__gte=from_date, due_date__lte=to_date) \
                .order_by('due_date')
        else:
            history = Bills.objects.filter(owner=request.user, name=bill_name, due_date__gte=from_date).order_by('due_date')

    if to_date is not None and history is None:
        history = Bills.objects.filter(owner=request.user, name=bill_name, due_date__lte=to_date)

    if history is None:
        history = Bills.objects.filter(owner=request.user, name=bill_name)

    dates = [d.strftime('%Y-%m-%d') for d in list(history.values_list('due_date', flat=True))]
    amounts = list(history.values_list('amount', flat=True))
    data = {
        "due_dates": dates,
        "amounts": amounts
    }

    return HttpResponse(json.dumps(data), content_type="application/json")






