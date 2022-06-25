# from django.shortcuts import render
from asyncore import read
from functools import partial
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework import generics
from rest_framework import mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet, NumberFilter, BooleanFilter, CharFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from django.db.models import F
from sqlalchemy import true

from base.models import *
from .serializers import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django_rdkit.models import *


class ReactionFilter(FilterSet):

    id = NumberFilter()
    id__gte = NumberFilter(field_name='id', lookup_expr='gte')
    id__lte = NumberFilter(field_name='id', lookup_expr='lte')
    assay__gte = NumberFilter(field_name='assay__acylation_yield', lookup_expr='gte')
    assay__lte = NumberFilter(field_name='assay__acylation_yield', lookup_expr='lte')
    smiles__substruct = CharFilter(field_name='monomer__monomer_smiles', lookup_expr='substruct')
    
    class Meta:
        model = Reaction
        fields = ['id', 'assay__acylation_yield']


defaultSearchFields = [
    'id',
    'flexizyme__flex_name',
    'synthetase__synth_common_name',
    'synthetase__organisms__organism_name',
    'synthetase__parent_synthetase__parent_name',
    'monomer__monomer_name',
    'monomer__monomer_smiles',
    'monomer__monomer_LG',
    'references__DOI',
    'references__title',
    'references__journal',
    'rib_readout',
    'assay__assay_notes'
]
defaultFilteringFields = {
    'id': ['gte', 'lte', 'exact'],
    'assay__acylation_yield': ['exact', 'gte', 'lte'],
    'flexizyme': ['isnull'],
    'flexizyme__flex_name': ['iexact', 'icontains'],
    'synthetase': ['isnull'],
    'synthetase__synth_common_name': ['iexact', 'icontains'],
    'synthetase__parent_synthetase__parent_name': ['iexact', 'icontains'],
    'synthetase__organisms__organism_name': ['iexact', 'icontains'],
    'synthetase__mutations__mutation_name': ['iexact', 'icontains'],
    'monomer__monomer_name': ['iexact', 'icontains'],
    'monomer__monomer_smiles': ['iexact', 'substruct'],
    'monomer__monomer_LG': ['iexact', 'icontains'],
    'date_added': ['exact'],
    'rib_readout': ['iexact', 'icontains'],
    'references__DOI': ['iexact', 'icontains'],
    'n_term_incorporation': ['iexact'],
    'internal_incorporation': ['iexact'],
    'n_term_percent': ['exact', 'gte', 'lte'],
    'internal_percent': ['exact', 'gte', 'lte'],
    'rib_incorporation_notes': ['iexact', 'icontains'],
    # 'reaction_yield': ['iexact', 'gte', 'lte'],
    # 'reaction_Kcat': ['iexact', 'gte', 'lte'],
    # 'reaction_Km': ['iexact', 'gte', 'lte'],
}
defaultOrderingFields = [
    'id',
    'internal_incorporation',
    'internal_percent',
    'assay__acylation_yield',
    'n_term_percent',
    'n_term_incorporation'
]

###### Overriding JWT Serializer + View to return more info about user ########
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_admin'] = user.is_admin
        # ...
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


###### Views for reactions in table format e.g. as search results or "browse all" page #######
class ReactionTableViewPagination(LimitOffsetPagination):
    default_limit = 50

class NullsAlwaysLastOrderingFilter(OrderingFilter):
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        if ordering:
            f_ordering = []
            for o in ordering:
                if not o:
                    continue
                if o[0] == '-':
                    f_ordering.append(F(o[1:]).desc(nulls_last=True))
                else:
                    f_ordering.append(F(o).asc(nulls_last=True))
            return queryset.order_by(*f_ordering)
        return queryset


class ReactionTableView(generics.ListAPIView):
    queryset = Reaction.objects.all()
    serializer_class = ReactionTableContentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, NullsAlwaysLastOrderingFilter)
    filter_fields = defaultFilteringFields
    search_fields = defaultSearchFields
    ordering_fields = defaultOrderingFields

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


class MonomerView(viewsets.ModelViewSet):
    serializer_class = MonomerSerializer
    def get_queryset(self):
        return Monomer.objects.all()

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
    pagination_class = ReactionTableViewPagination

    # overriding perform_create so user gets added to model on create.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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

    filter_backends = (DjangoFilterBackend, SearchFilter, NullsAlwaysLastOrderingFilter)
    filter_fields = defaultFilteringFields
    search_fields = defaultSearchFields
    ordering_fields = defaultOrderingFields


class UserReactionsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReactionTableContentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, NullsAlwaysLastOrderingFilter)
    filter_fields = defaultFilteringFields
    search_fields = defaultSearchFields
    ordering_fields = defaultOrderingFields
    pagination_class = ReactionTableViewPagination

    def get_queryset(self):
        return Reaction.objects.filter(user=self.request.user)

class PostPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.method == 'GET':
            return True
        elif request.method == 'POST':
            return True
        else:
            return request.user.is_staff

class ReactionDraftView(viewsets.ModelViewSet):
    permission_classes = [PostPermission]
    serializer_class = ReactionDraftSerializer
    pagination_class = ReactionTableViewPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        drafts = ReactionDraft.objects.all()
        return drafts


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