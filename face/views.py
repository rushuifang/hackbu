from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def  index(request):
    return render(request, "face/index.html")

def  maps(request):
    return render(request, "face/maps.html")