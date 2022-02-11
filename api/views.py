# from django.shortcuts import render
from functools import partial
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination


from base.models import *
from .serializers import *

# Create your views here.


###### Views for reactions in table format e.g. as search results or "browse all" page #######
class ReactionTableViewPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 25

class ReactionTableView(generics.ListAPIView):
    """
    GET
    """
    queryset = Reaction.objects.all()
    serializer_class = ReactionTableContentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = [
        'id',
        'assay__acylation_yield',
        'flexizyme__flex_name',
        'synthetase__synth_common_name',
        'synthetase__organism_id__organism_name',
        'monomer__monomer_name',
        'monomer__monomer_smiles',
        'monomer__monomer_LG',
        'date_added',
    ]
    search_fields = [
        'id',
        'flexizyme__flex_name',
        'synthetase__synth_common_name',
        'synthetase__organism_id__organism_name',
        'monomer__monomer_name',
        'monomer__monomer_smiles',
        'monomer__monomer_LG',
        'references__DOI',
        'references__title',
        'references__authors__first_name',
        'references__authors__last_name'
    ]

    pagination_class = ReactionTableViewPagination


###### View for all references in table view ######
###### create etc for references ######


class ReferencePagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 25

class ReferenceViewSet(viewsets.ModelViewSet):
    serializer_class = ReferenceSerializer

    def get_queryset(self):
        reference = Reference.objects.all()
        return reference
    
    def create(self, request, *args, **kwargs):
        data = request.data
        new_reference = Reference.objects.create(
            DOI = data['DOI'],
            title = data['title'],
            publication_date = data['publication_date']
        )

        new_reference.save()

        # for this to work, author must already be in Author.objects, so to create a new reference with
        # new authors, you must first create the authors with AuthorViewSet then create the Reference.
        for author in data["authors"]:
            try:
                author_object = Author.objects.get(first_name=author['first_name'])
            except:
                Author.objects.create(first_name=author['first_name'], last_name=author['last_name'])
                author_object = Author.objects.get(first_name=author['first_name'])
                new_reference.authors.add(author_object)
        
        serializer = ReferenceSerializer(new_reference)
        return Response(serializer.data)
    
    pagination_class = ReferencePagination


class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer

    def get_queryset(self):
        author = Author.objects.all()
        return author


# class ReferenceTableView(generics.ListAPIView):
#     """
#     GET
#     """
#     queryset = Reference.objects.all()
#     serializer_class = ReferenceSerializer
#     filter_backends = (DjangoFilterBackend, SearchFilter)
#     filter_fields = ['DOI', 'title']
#     search_fields = ['DOI', 'title', 'authors__first_name', 'authors__last_name']

#     pagination_class = ReferencePagination


###### Views for a specific reaction ###########

@api_view(['GET'])
def reactionContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ReactionSerializer(reaction)
        return Response(serializer.data)

@api_view(['PATCH'])
def updateReactionContents(request, pk):
    try:
        reaction = Reaction.objects.get(pk=pk)
    except Reaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        serializer = ReactionSerializer(reaction, data=request.data, partial=True)
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