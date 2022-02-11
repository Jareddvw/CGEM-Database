from rest_framework import serializers

from base.models import *

#serializers for database models in base.models

################ Helper Serializers ################ 

class AssaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MicrohelixAssay
        fields = '__all__'

class MonomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monomer
        fields = '__all__'


# references and authors have manytomany relationship
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'id',
            'first_name',
            'last_name'
        ]

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = [
            'id',
            'DOI',
            'title',
            'publication_date',
            'authors'
        ]
        depth = 1


# Need to serialize Flexizyme and Synthetase 
class FlexizymeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Flexizyme
        fields = [
            'flex_name',
            'flex_sequence'
        ]

class SynthetaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Synthetase
        fields = '__all__'
        depth = 2


############### Reaction Content Serializers ##############

# for table view (e.g. search results or browse all)
class ReactionTableContentsSerializer(serializers.ModelSerializer):

    acylation_yield = serializers.SerializerMethodField('get_acylation_yield_from_assay')
    synthetase = serializers.SerializerMethodField('get_synthetase')
    flexizyme = serializers.SerializerMethodField('get_flexizyme')
    monomer = serializers.SerializerMethodField('get_monomer')

    class Meta:
        model = Reaction
        # either flex or synth will be blank
        fields = [
            'id',
            'flexizyme',
            'synthetase',
            'monomer',
            'n_term_incorporation',
            'internal_incorporation',
            'acylation_yield',
        ]

    def get_monomer(self, reaction):
        if reaction.monomer:
            name = reaction.monomer.__str__()
            return name
        else:
            return reaction.monomer

    def get_synthetase(self, reaction):
        if reaction.synthetase:
            synth = reaction.synthetase.__str__()
            return synth
        else:
            return reaction.synthetase

    def get_flexizyme(self, reaction):
        if reaction.flexizyme:
            flex = reaction.flexizyme.__str__()
            return flex
        else:
            return reaction.flexizyme

    def get_acylation_yield_from_assay(self, reaction):
        if reaction.assay:
            y = reaction.assay.acylation_yield
            return y
        else:
            return ''


# for individual reaction page — gives all attributes of the given reaction
class ReactionSerializer(serializers.ModelSerializer):

    assay = AssaySerializer()
    flexizyme = FlexizymeSerializer()
    synthetase = SynthetaseSerializer()
    # references = ReferenceSerializer()

    class Meta:
        model = Reaction
        fields = '__all__'
        depth = 2
        