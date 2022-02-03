from django.db import models
from managers import *

# Create your models here.

class T_RNA(models.Model):
    tRNA_name = models.CharField(max_length = 250)
    tRNA_seq = models.TextField
        
    def __str__(self):
        return self.tRNA_name

class Monomer(models.Model):
    monomer_name = models.CharField(max_length = 250)
    monomer_smiles = models.TextField
    monomer_LG = models.CharField(max_length = 100)

    def __str__(self):
        return self.monomer_name

class Flexizyme(models.Model):
    flex_name = models.CharField(max_length = 50)
    flex_sequence = models.TextField

#synthetases to organisms is many-to-many relationship
class Organism(models.Model):
    organism_name = models.CharField(max_length = 50)

#synthetases to mutations is also many-to-many
class SynthMutations(models.Model):
    mutation_name = models.CharField(max_length=25)

class Synthetase(models.Model):
    synth_common_name = models.CharField(max_length = 100)
    accession_id = models.CharField(max_length = 50)
    pbd_id = models.CharField(max_length = 10)
    organism_id = models.ManyToManyField(Organism, related_name="organisms")
    mutations = models.ManyToManyField(SynthMutations, related_name="mutations")

class Author(models.Model):
    first_name = models.CharField(null=True, max_length = 25)
    last_name = models.CharField(max_length = 25)

class Reference(models.Model):
    DOI = models.CharField(max_length = 50)
    authors = models.ManyToManyField(Author, related_name="authors")
    publication_date = models.DateField(auto_now=False)


## Primary object of the database ##
class Reaction(models.Model):
    #a reference can have multiple rxns listed, and reaction can have multiple references
    reference = models.ManyToManyField(Reference, related_name = "references")
    #a reaction will either have a flexizyme, a synthetase, or neither (chemical acylation) so null for both.
    #if the associated flexizyme or synthetase is deleted, the reaction will be deleted too.
    flexizyme = models.ForeignKey(Flexizyme, on_delete=models.CASCADE, null=True)
    synthetase = models.ForeignKey(Synthetase, on_delete=models.CASCADE, null=True)
    ## double check this but each reaction and monomer have a one-to-one relationship. ##
    # if the monomer is deleted its associated reaction will be deleted too.
    monomer = models.OneToOneField(Monomer, on_delete=models.CASCADE)
    # deleting a tRNA deletes all associated reactions with that tRNA
    tRNA = models.ForeignKey(T_RNA, on_delete=models.CASCADE)

    #ribosome info is all in Reaction table bc incorporation notes are reaction-specific
    ribosome_name = models.CharField(max_length=50) #WT or mut name

    # for nterm and internal incorporation, can make charfield here then set choices in frontend
    # answers will be yes, no, percentage value, or "no data". Alternatively can make ChoiceField
    n_term_incorporation = models.CharField(max_length = 5, null=True)
    internal_incorporation = models.CharField(max_length = 5, null=True)

    READOUT_CHOICES = [
        ('LC', 'LC-MS'),
        ('SD','SDS-PAGE'),
        ('GF','GFP Fluorescence'),
        ('PE','Protein Expression')
    ]
    rib_readout = models.CharField(max_length = 2, choices = READOUT_CHOICES, null=True)
    rib_incorporation_notes = models.TextField(null=True)
    #yield is percentage
    reaction_yield = models.FloatField(null=True)
    #Kcat in min^-1
    reaction_Kcat = models.FloatField(null = True)
    #Km in mM
    reaction_Km = models.FloatField(null=True)


#Usually only present if the reaction uses a flexizyme
class MicrohelixAssay(models.Model):
    
    #if the Reaction associated with the assay is deleted, the assay will be deleted as well
    reaction = models.ForeignKey(Reaction, on_delete=models.CASCADE)
    conditions = models.TextField(max_length = None)
    #acylation_yield should be a percentage so need to input as value between 0 and 1
    acylation_yield = models.FloatField(null = True)
    assay_notes = models.TextField(max_length = None)
