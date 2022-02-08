from rest_framework import serializers

from base.models import *

#serializers for database models in base.models

################ Helper Serializers ################ May not actually need these, just set depth = 2 in ReactionSerializer

# Serializes Microhelix assay serialization
class AssaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MicrohelixAssay
        fields = '__all__'
    

class MonomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monomer
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class ReferencesSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True)
    class Meta:
        model = Reference
        fields = '__all__'



############### Reaction Content Serializers ##############

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
            'acylation_yield',
        ]
        depth = 1
    
    def get_acylation_yield_from_assay(self, reaction):
        if reaction.assay:
            y = reaction.assay.acylation_yield
            return y
        else:
            return ''


# for individual reaction page — gives all attributes of the given reaction
class ReactionSerializer(serializers.ModelSerializer):

    # flexizyme = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reaction
        # fields = [
        #     'id',
        #     'references',
        #     'flexizyme',
        #     'synthetase',
        #     'monomer',
        #     'tRNA',
        #     'ribosome_name',
        #     'n_term_incorporation',
        #     'internal_incorporation',
        #     'rib_readout',
        #     'rib_incorporation_notes',
        #     'reaction_yield',
        #     'reaction_Kcat',
        #     'reaction_Km',
        #     'date_added',
        #     'assay'
        # ]
        fields = '__all__'
        # depth = 2
        
    # def get_flexizyme(self, reaction):
    #     if reaction.flexizyme:
    #         return reaction.flexizyme
    #     else:
    #         return ''


# make different serializers for different uses e.g. 
# for table display only need like 5 fields returned
