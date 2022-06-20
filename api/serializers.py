from rest_framework import serializers

from base.models import *
from rdkit import Chem
from drf_writable_nested.serializers import WritableNestedModelSerializer

from rest_framework.exceptions import APIException

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

class TRNASerializer(serializers.ModelSerializer):
    class Meta:
        model = T_RNA
        fields = '__all__'

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = '__all__'
        depth = 1

class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SynthMutations
        fields = '__all__'

class OrganismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organism
        fields = '__all__'

# Need to serialize Flexizyme and Synthetase, plus sythetase FKs for Synthetase View
class FlexizymeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Flexizyme
        fields = '__all__'

class ParentSynthSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentSynth
        fields = '__all__'

class SynthetaseSerializer(WritableNestedModelSerializer):
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

        # Adding parent synthetase to Synthetase object:
        try: 
            new_parent, _ = ParentSynth.objects.get_or_create(parent_name=parent['parent_name'], parent_pbd_id=parent['parent_pbd_id'])
        except:
            new_parent = ParentSynth.objects.filter(parent_name=parent['parent_name'], parent_pbd_id=parent['parent_pbd_id']).first()
        new_synth = Synthetase.objects.create(**validated_data, parent_synthetase=new_parent) 
        new_synth.save()
        # Adding organisms and mutations to Synthetase object:
        for organism in organisms:
            try:
                new_org = Organism.objects.filter(organism_name=organism['organism_name']).first()
                if not new_org:
                    new_org = Organism.objects.create(**organism)
            except:
                new_org = Organism.objects.get(organism_name=organism['organism_name'])
            new_synth.organisms.add(new_org)
        for mutation in mutations:
            try:
                new_mut, _ = SynthMutations.objects.get_or_create(mutation_name=mutation['mutation_name'])
            except:
                new_mut = SynthMutations.objects.filter(mutation_name=mutation['mutation_name']).first()
            new_synth.mutations.add(new_mut)
        return new_synth

    # works for PUT but not PATCH
    def update(self, instance, validated_data):
        # organisms and mutations are ManyToMany relationships
        organisms = validated_data.pop('organisms')
        mutations = validated_data.pop('mutations')
        # parent synthetase and synthetase have FK relationship
        parent = validated_data.pop('parent_synthetase')

        Synthetase.objects.filter(id=instance.id).update(**validated_data)
        instance.organisms.clear()
        instance.mutations.clear()

        if parent:
            parentID = parent.pop(id)
            updated_parent, created = ParentSynth.objects.update_or_create(id=parentID, defaults=parent)
            instance.parent_synthetase = updated_parent
            instance.save()
        if organisms:
            for organism in organisms:
                try:
                    new_org = Organism.objects.get(organism_name=organism['organism_name'])
                except:
                    Organism.objects.create(**organism)
                    new_org = Organism.objects.get(organism_name=organism['organism_name'])
                instance.organisms.add(new_org)
        if mutations:
            for mutation in mutations:
                try:
                    new_mut = SynthMutations.objects.get(mutation_name=mutation['mutation_name'])
                except:
                    SynthMutations.objects.create(**mutation)
                    new_mut = SynthMutations.objects.get(mutation_name=mutation['mutation_name'])
                instance.mutations.add(new_mut)
        return instance


############### Reaction Content Serializers ##############

# for table view (e.g. search results or browse all)
class ReactionTableContentsSerializer(serializers.ModelSerializer):

    acylation_yield = serializers.SerializerMethodField('get_acylation_yield_from_assay')
    synthetase = serializers.SerializerMethodField('get_synthetase')
    flexizyme = serializers.SerializerMethodField('get_flexizyme')
    monomer = serializers.SerializerMethodField('get_monomer')
    monomer_smiles = serializers.SerializerMethodField('get_monomer_smiles')

    class Meta:
        model = Reaction
        # either flex or synth will be blank 
        fields = [
            'id',
            'flexizyme',
            'synthetase',
            'monomer',
            'monomer_smiles',
            'n_term_incorporation',
            'n_term_percent',
            'internal_incorporation',
            'internal_percent',
            'acylation_yield',
        ]

    def get_monomer_smiles(self, reaction):
        if reaction.monomer:
            name = reaction.monomer.monomer_smiles
            return name

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
            return None


# for individual reaction page — gives all attributes of the given reaction
class ReactionSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField('get_username')

    assay = AssaySerializer(allow_null=True)
    flexizyme = FlexizymeSerializer(allow_null=True)
    synthetase = SynthetaseSerializer(allow_null=True)
    ##### Not sure if monomer and tRNA should be allowed to be null.
    monomer = MonomerSerializer()
    tRNA = TRNASerializer()
    references = ReferenceSerializer(many=True)

    class Meta:
        model = Reaction
        fields = '__all__'

    def get_username(self, reaction):
        if reaction.user:
            email = reaction.user.__str__()
            return email
        else:
            return None

    def create(self, validated_data):
        # Assay is a OneToOneField
        # Monomer, tRNA, Flexizyme, and Synthetase are ForeignKeys. TRNA and Monomer may not be False.
        # References is a ManyToManyField
        assay = validated_data.pop('assay')
        monomer = validated_data.pop('monomer')
        flexizyme = validated_data.pop('flexizyme')
        synthetase = validated_data.pop('synthetase')
        references = validated_data.pop('references')
        tRNA = validated_data.pop('tRNA')

        # assay is not a required field so this action should only be performed if assay is provided
        if assay:
            new_assay = MicrohelixAssay.objects.create(**assay)
        else: 
            new_assay = assay
        # monomer and trna are required fields so will never be absent from validated_data
        try:
            new_monomer = Monomer.objects.get(monomer_smiles=monomer['monomer_smiles'])
        except:
            x = Chem.MolFromSmiles(monomer['monomer_smiles'])
            if x is not None:
                new_monomer = Monomer.objects.create(**monomer)
            else:
                raise serializers.ValidationError("invalid SMILES string provided.")
        try:
            new_trna = T_RNA.objects.get(tRNA_name=tRNA['tRNA_name'])
        except:
            new_trna = T_RNA.objects.create(**tRNA)

        if flexizyme:
            try:
                # this way you can create a new reaction using only the flexizyme name. If the flexizyme is already 
                # there, you won't need to add in the sequence either because it may already be there.
                new_flex, _ = Flexizyme.objects.get_or_create(flex_name=flexizyme['flex_name'])
            except:
                Flexizyme.objects.create(**flexizyme)
                new_flex = Flexizyme.objects.filter(flex_name=flexizyme['flex_name']).first()
        else:
            new_flex = flexizyme

        if synthetase:
            try:
                new_synth = Synthetase.objects.get(synth_common_name=synthetase['synth_common_name'])
            except:
                new_synth = Synthetase.objects.filter(synth_common_name=synthetase['synth_common_name']).first()
            print("1a", synthetase)
            print("1b", new_synth)
            # If the synthetase doesn't yet exist, we need to make it.
            if not new_synth:
                new_synth_serializer = SynthetaseSerializer(data=synthetase)
                if new_synth_serializer.is_valid():
                    new_synth_serializer.save()
                print("3a", new_synth_serializer)
                new_synth = Synthetase.objects.filter(synth_common_name=synthetase['synth_common_name']).first()
                print("3b", new_synth)
        else:
            new_synth = synthetase

        new_reaction = Reaction.objects.create(assay=new_assay, monomer=new_monomer, tRNA=new_trna, **validated_data)
        new_reaction.flexizyme = new_flex
        new_reaction.synthetase = new_synth
        new_reaction.save()
        for reference in references:
            try:
                new_ref = Reference.objects.filter(DOI=reference['DOI']).first()
                if not new_ref:
                    new_ref, _ = Reference.objects.get_or_create(**reference)
            except:
                Reference.objects.create(**reference)
                new_ref = Reference.objects.filter(DOI=reference['DOI']).first()
            new_reaction.references.add(new_ref)
        return new_reaction


        # handles PUT requests for existing reactions. 
        # main idea: get the existing object if it exists, then update the values.
        # Otherwise, create new instance of the field and replace previous field with it.
    def update(self, instance, validated_data):
        # Assay is OneToOneField
        # Monomer, tRNA, Flexizyme, and Synthetase are ForeignKeys. TRNA and Monomer may not be False.
        # References is a ManyToManyField

        currentObj = Reaction.objects.get(id=instance.id)
        assay = validated_data.get('assay', 0)
        if assay:
            validated_data.pop('assay')
            try: 
                current_assay=MicrohelixAssay.objects.get(id=instance.assay.id)
                MicrohelixAssay.objects.get(id=current_assay.id).update(**assay)
            except:
                new_assay = MicrohelixAssay.objects.create(**assay)
                currentObj.update(assay=new_assay)
        monomer = validated_data.get('monomer', 0)
        if monomer: 
            validated_data.pop('monomer')
            try:
                new_monomer = Monomer.objects.get(monomer_smiles=monomer['monomer_smiles'])
            except:
                new_monomer = Monomer.objects.create(**monomer)
            currentObj.update(monomer=new_monomer)
        flexizyme = validated_data.get('flexizyme', 0)
        if flexizyme: 
            validated_data.pop('flexizyme')
            try:
                new_flex = Flexizyme.objects.get(flex_name=flexizyme['flex_name'])
            except:
                new_flex = Flexizyme.objects.create(**flexizyme)
            currentObj.update(flexizyme=new_flex)
        synthetase = validated_data.get('synthetase', 0)
        if synthetase: 
            validated_data.pop('synthetase')
            try:
                new_synth = Synthetase.objects.filter(synth_common_name=synthetase['synth_common_name']).first()
            except:
                new_synth = Synthetase.objects.create(**synthetase)
            currentObj.update(synthetase=new_synth)
        tRNA = validated_data.get('tRNA', 0)
        if tRNA:
            validated_data.pop('tRNA')
            try:
                new_trna = T_RNA.objects.get(tRNA_name=tRNA['tRNA_name'])
            except:
                new_trna = T_RNA.objects.create(**tRNA)
            currentObj.update(tRNA = new_trna)
        references = validated_data.get('references', 0)
        if references:
            validated_data.pop('references')
            # clears existing references for this Reaction before adding in the new ones. So when calling update on references, must be sure to treat as PUT rather than PATCH.
            instance.references.clear()
            for reference in references:
                try: 
                    new_ref = Reference.objects.get(DOI=reference['DOI'])
                except:
                    new_ref = ReferenceSerializer.create(reference)
                instance.references.add(new_ref)
        currentObj.update(**validated_data)
        return instance


# Serialize only reactions by a specific author! 

    # for PUT and PATCH methods, should rely on ids. IE if you send a put or patch request you
    # should also send the ID of the thing you want to change, but for post requests you don't need it.
    

class ReactionDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReactionDraft
        fields = '__all__'
    
    user = serializers.SerializerMethodField('get_username')
    
    def get_username(self, reaction):
        if reaction.user:
            email = reaction.user.__str__()
            return email
        else:
            return None