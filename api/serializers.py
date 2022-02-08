from rest_framework import serializers

from base.models import *

#serializers for database models in base.models

# for table view (e.g. search results or browse all)
class ReactionTableContentsSerializer(serializers.ModelSerializer):

    acylation_yield = serializers.SerializerMethodField('get_acylation_yield_from_assay')

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
            'acylation_yield'
        ]
    
    def get_acylation_yield_from_assay(self, reaction):
        if reaction.assay:
            y = reaction.assay.acylation_yield
            return y
        else:
            return ''


# for individual reaction page
class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = [
            'id',
            'DOI',
            'flexizyme',
            'synthetase',
            'monomer',
            'tRNA',
            'ribosome_name',
            'n_term_incorporation',
            'internal_incorporation',
            'rib_readout',
            'rib_incorporation_notes',
            'reaction_yield',
            'reaction_Kcat',
            'reaction_Km'
        ]

class MicrohelixAssaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MicrohelixAssay
        fields = [

        ]


# make different serializers for different uses e.g. 
# for table display only need like 5 fields returned
