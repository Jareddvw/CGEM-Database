# from django.shortcuts import render
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from base.models import *
from .serializers import *

# Create your views here.


@api_view(['GET'])
def tableContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ReactionTableContentsSerializer(reaction)
        return Response(serializer.data)



@api_view(['GET'])
def getData (request):
    person = {'name':'Jared', 'test':'true'}
    return Response(person)



"""
functions needed:

items for displaying in table;
(pretty much) all characteristics for page view
ordering stuff?
advanced search queries
SMILES string search, need to make a function
    to filter SMILES by similarity then use that 
    to order search results somehow

"""