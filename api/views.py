# from django.shortcuts import render
from functools import partial
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import mixins
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination


from base.models import *
from .serializers import *


###### Views for reactions in table format e.g. as search results or "browse all" page #######
class ReactionTableViewPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 25

class ReactionTableView(generics.ListAPIView):

    queryset = Reaction.objects.all()
    serializer_class = ReactionTableContentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = [
        'id',
        'assay__acylation_yield',
        'flexizyme__flex_name',
        'synthetase__synth_common_name',
        'synthetase__parent_synthetase',
        'synthetase__organisms__organism_name',
        'monomer__monomer_name',
        'monomer__monomer_smiles',
        'monomer__monomer_LG',
        'date_added',
    ]
    search_fields = [
        'id',
        'flexizyme__flex_name',
        'synthetase__synth_common_name',
        'synthetase__organisms__organism_name',
        'synthetase__parent_synthetase',
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


# this function searches the given model class for an item with the given field attribute string 
# (e.g. 'mutation_name' = 'C313V'), and if it exists, adds it as an attribute of newObject. If it does not
# exist, the item must be created and then added to newObject.
def genericCreateLoop(data, modelClass, modelName, fieldName, newObject, view):
    for obj in data[modelName]:
        modelObjects = getattr(modelClass, 'objects')
        try: 
            obj_item = modelObjects.get(fieldName=getattr(obj, fieldName))
        except:
            view.as_view().create(obj)
            obj_item = modelObjects.get(fieldName=obj[fieldName])
            getattr(newObject, fieldName).add(obj_item)


class ReferencePagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 25

class ReferenceViewSet(viewsets.ModelViewSet, mixins.CreateModelMixin):
    serializer_class = ReferenceSerializer

    def get_queryset(self):
        reference = Reference.objects.all()
        return reference
    
    pagination_class = ReferencePagination
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ['DOI', 'title']
    search_fields = ['DOI', 'title', 'authors__first_name', 'authors__last_name']


class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer

    def get_queryset(self):
        author = Author.objects.all()
        return author
    
    def create(self, request, *args, **kwargs):
        data = request.data
        new_auth = Author.objects.create(
            first_name = data['first_name'],
            last_name = data['last_name']
        )
        new_auth.save()
        serializer = AuthorSerializer(new_auth)
        return Response(serializer.data)


class FlexizymeView(viewsets.ModelViewSet):
    serializer_class = FlexizymeSerializer

    def get_queryset(self):
        flex = Flexizyme.objects.all()
        return flex

# organism and mutation views for Sythetase View
class OrganismView(viewsets.ModelViewSet):
    serializer_class = OrganismSerializer
    def get_queryset(self):
        organisms = Organism.objects.all()
        return organisms

class MutationView(viewsets.ModelViewSet):
    serializer_class = MutationSerializer
    def get_queryset(self):
        mutations = SynthMutations.objects.all()
        return mutations

class SynthetaseView(viewsets.ModelViewSet, mixins.CreateModelMixin):
    serializer_class = SynthetaseSerializer
    def get_queryset(self):
        synth = Synthetase.objects.all()
        return synth

###### Views for a specific reaction. With POST, PATCH, and DELETE methods ###########

class ReactionViewSingle(viewsets.ModelViewSet, mixins.CreateModelMixin):
    serializer_class = ReactionSerializer
    def get_queryset(self):
        reaction = Reaction.objects.all()
        return reaction
    
    def post(self, request):
        return self.create(request)



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