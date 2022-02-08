# from django.shortcuts import render
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from base.models import *
from .serializers import *

# Create your views here.

# views for a specific reaction
@api_view(['GET'])
def reactionContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ReactionSerializer(reaction)
        return Response(serializer.data)

@api_view(['PUT'])
def updateReactionContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = ReactionSerializer(reaction, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data["success"] = "update successful"
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteReactionContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        operation = reaction.delete()
        data = {}
        if operation:
            data['success'] = 'deletion successful'
        else: 
            data['failure'] = 'deletion failed'
        return Response(data=data)


@api_view(['POST'])
def createReactionContents(request):
    #account = Account.objects.get(pk=1)
    return





###### View for seeing items in table format e.g. as search results ###### 

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