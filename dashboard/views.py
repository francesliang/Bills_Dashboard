import json

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse

from dashboard.models import Bills 

def default(request):
    return render(request, 'index.html')
    
    
@csrf_exempt
def insert_bill(request):
    success = False
    params = request.POST
    created_date = params.get('created_date')
    bill_name = params.get('bill_name')
    due_date =  params.get('due_date')
    amount = params.get('amount')

    obj, is_created = Bills.objects.get_or_create( \
        created=created_date,
        name=bill_name,
        due_date=due_date,
        amount=amount)
    print "insert_bill ", bill_name, due_date, amount

    return HttpResponse(json.dumps({'success': success}), content_type="application/json")

@csrf_exempt
def get_bills(request):
    params = request.GET
    bills = list(Bills.objects.all().values_list('name', flat=True))
    data = dict()
    for b in bills:
    	dates = list(Bills.objects.filter(name=b).values_list('due_date', flat=True))
        dates = [d.strftime('%m-%d-%Y') for d in dates]
    	amounts = list(Bills.objects.filter(name=b).values_list('amount', flat=True))
    	data[b] = {
    		"due_dates": dates,
    		"amounts": amounts
    	}

    return HttpResponse(json.dumps(data), content_type ="application/json")
     
@csrf_exempt
def list_bills(request):
    bills = list(Bills.objects.all().values_list('name', flat=True))
    bills = list(set(bills))

    return HttpResponse(json.dumps(bills), content_type="application/json")

@csrf_exempt
def get_last_bills(request):
    data = dict()
    bills = list(Bills.objects.all().values_list('name', flat=True))
    for b in bills:
        if b:
            last_b = Bills.objects.filter(name=b).order_by('-due_date')[0]
            data[b] = {
                'amount': last_b.amount,
                'due_date': last_b.due_date.strftime('%d-%m-%Y')
            }
    print data
    return HttpResponse(json.dumps(data), content_type ="application/json")
    

@csrf_exempt
def summarise_bills(request):

    return




