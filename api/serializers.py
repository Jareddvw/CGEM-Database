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

class OrganismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organism
        fields = '__all__'

class ParentSynthSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentSynth
        fields = '__all__'

class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SynthMutations
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
    authors = AuthorSerializer(many = True)
    class Meta:
        model = Reference
        fields = [
            'id',
            'DOI',
            'title',
            'publication_date',
            'journal',
            'authors'
        ]
        depth = 1
    
    def create(self, validated_data):
        authors = validated_data.pop('authors')
        ref = Reference.objects.create(**validated_data)
        for author in authors:
            try:
                new_auth = Author.objects.get(first_name=author['first_name'], last_name=author['last_name'])
            except:
                Author.objects.create(**author)
                new_auth = Author.objects.get(first_name=author['first_name'], last_name=author['last_name'])
            ref.authors.add(new_auth)
        return ref


# Need to serialize Flexizyme and Synthetase, plus sythetase FKs for Synthetase View
class FlexizymeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Flexizyme
        fields = '__all__'

class SynthetaseSerializer(serializers.ModelSerializer):
    organisms = OrganismSerializer(many = True)
    mutations = MutationSerializer(many = True)
    parent_synthetase = ParentSynthSerializer()

    class Meta:
        model = Synthetase
        fields = '__all__'
        depth = 2
    
    def create(self, validated_data):
        organisms = validated_data.pop('organisms')
        mutations = validated_data.pop('mutations')
        parent = validated_data.pop('parent_synthetase')
        if parent:
            try:
                new_parent = ParentSynth.objects.get(name=parent['name'])
            except:
                ParentSynth.objects.create(**parent)
                new_parent = ParentSynth.objects.get(name=parent['name'])
        new_synth = Synthetase.objects.create(**validated_data, parent_synthetase = new_parent)
        for organism in organisms:
            try:
                new_org = Organism.objects.get(organism_name=organism['organism_name'])
            except:
                Organism.objects.create(**organism)
                new_org = Organism.objects.get(organism_name=organism['organism_name'])
            new_synth.organisms.add(new_org)
        for mutation in mutations:
            try:
                new_mut = SynthMutations.objects.get(mutation_name=mutation['mutation_name'])
            except:
                SynthMutations.objects.create(**mutation)
                new_mut = SynthMutations.objects.get(mutation_name=mutation['mutation_name'])
            new_synth.mutations.add(new_mut)
        return new_synth

class OrganismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organism
        fields = '__all__'

class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SynthMutations
        fields = '__all__'

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
    synthetase = SynthetaseSerializer(allow_null=True)

    # references = ReferenceSerializer()

    class Meta:
        model = Reaction
        fields = '__all__'
        depth = 2
    

        