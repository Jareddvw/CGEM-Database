# from django.shortcuts import render
from functools import partial
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination


from base.models import *
from .serializers import *


###### Views for reactions in table format e.g. as search results or "browse all" page #######
class ReactionTableViewPagination(LimitOffsetPagination):
    default_limit = 50
    max_limit = 100

class ReactionTableView(generics.ListAPIView):

    queryset = Reaction.objects.all()
    serializer_class = ReactionTableContentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
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
        'n_term_incorporation',
        'internal_incorporation',
        'rib_readout'
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
        # 'references__DOI',
        # 'references__title',
        # 'references__journal',
        'rib_readout'
    ]
    ordering_fields = [
        'id',
        'internal_incorporation',
        'internal_percent',
        'assay__acylation_yield',
        'n_term_percent',
        'n_term_incorporation'
    ]

    pagination_class = ReactionTableViewPagination


###### View for all references in table view ######
###### create etc for references ######

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
    filter_fields = ['DOI', 'title', 'journal']
    search_fields = ['DOI', 'title', 'journal']


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

class SynthetaseView(viewsets.ModelViewSet):
    serializer_class = SynthetaseSerializer
    def get_queryset(self):
        synth = Synthetase.objects.all()
        return synth

class AssayView(viewsets.ModelViewSet):
    serializer_class = AssaySerializer
    def get_queryset(self):
        return MicrohelixAssay.objects.all()


###### Views for a specific reaction. With GET, POST, PUT, and DELETE methods ###########

class ReactionViewSingle(viewsets.ModelViewSet):
    serializer_class = ReactionSerializer
    def get_queryset(self):
        reaction = Reaction.objects.all()
        return reaction

    def post(self, request):
        return self.create(request)

    def put(self, request, id=None):
        return self.update(request, id)
        # return self.retrieve(self, request, id=id)

    def patch(self, request, id=None):
        return self.partial_update(request, id)
        # return self.retrieve(self, request, id=id)

    def delete(self, request, id=None):
        return self.destroy(request, id)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
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
        'synthetase__parent_synthetase__name',
        'monomer__monomer_name',
        'monomer__monomer_smiles',
        'monomer__monomer_LG',
        # 'references__DOI',
        # 'references__title',
    ]



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