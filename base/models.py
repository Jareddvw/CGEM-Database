from django.db import models

# Create your models here.

class T_RNA(models.Model):
    tRNA_name = models.CharField(max_length=250)
    tRNA_seq = models.TextField(blank=True, default='')

    def __str__(self):
        return self.tRNA_name

class Monomer(models.Model):
    monomer_name = models.CharField(max_length=250, blank=True, default='')
    #SMILES is only thing required for all monomers
    monomer_smiles = models.TextField(default='')
    monomer_LG = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        #returns monomer_smiles if name is blank
        return self.monomer_name or self.monomer_smiles

class Flexizyme(models.Model):
    #flexizyme name and sequence are both required
    flex_name = models.CharField(max_length=50)
    flex_sequence = models.TextField(blank=True, default='')

    def __str__(self):
        return self.flex_name

#synthetases to organisms is many-to-many relationship
class Organism(models.Model):
    organism_name = models.CharField(max_length=50)
    def __str__(self):
        return self.organism_name

#synthetases to mutations is also many-to-many
class SynthMutations(models.Model):
    mutation_name = models.CharField(max_length=25)
    def __str__(self):
        return self.mutation_name

class Synthetase(models.Model):
    synth_common_name = models.CharField(max_length=100)
    accession_id = models.CharField(max_length=50, blank=True)
    pbd_id = models.CharField(max_length=10, blank=True)
    # not sure if synthetase should be allowed to have no associated organism but rn it is allowed
    organism_id = models.ManyToManyField(Organism, related_name="organisms", blank=True)
    # WT synthetase e.g. will have no mutations
    mutations = models.ManyToManyField(SynthMutations, related_name="mutations", blank=True)
    def __str__(self):
        return self.synth_common_name

class Author(models.Model):
    first_name = models.CharField(max_length=25, blank=True, default='')
    last_name = models.CharField(max_length=25)
    def __str__(self):
        return self.last_name + ', ' + self.first_name

class Reference(models.Model):
    # DOI, title, publication date are required
    DOI = models.CharField(max_length=50)
    title = models.TextField(default='')
    publication_date = models.DateField(auto_now=False)
    # at least one author is required
    authors = models.ManyToManyField(Author, related_name="authors")
    def __str__(self):
        return self.title

#Usually only present if the reaction uses a flexizyme
class MicrohelixAssay(models.Model):

    #if the Reaction associated with the assay is deleted, the assay will be deleted as well
    conditions = models.TextField(max_length=None, blank=True, default='')
    #acylation_yield should be a percentage so need to input as value between 0 and 1
    acylation_yield = models.FloatField(null=True, blank=True)
    assay_notes = models.TextField(max_length=None, blank=True, default='')
    def __str__(self):
        return self.reaction.__str__()

## Primary object of the database ##
class Reaction(models.Model):
    #a reference can have multiple rxns listed, and reaction can have multiple references
    reference = models.ManyToManyField(Reference, related_name="references")
    #a reaction will either have a flexizyme, a synthetase, or neither (chemical acylation) so null for both.
    #if the associated flexizyme or synthetase is deleted, the reaction will be deleted too.
    flexizyme = models.ForeignKey(Flexizyme, on_delete=models.CASCADE, null=True, blank=True)
    synthetase = models.ForeignKey(Synthetase, on_delete=models.CASCADE, null=True, blank=True)
    ## double check this but each reaction and monomer have a one-to-one relationship. ##
    # if the monomer is deleted its associated reaction will be deleted too.
    monomer = models.OneToOneField(Monomer, on_delete=models.CASCADE)
    # deleting a tRNA deletes all associated reactions with that tRNA
    tRNA = models.ForeignKey(T_RNA, on_delete=models.CASCADE)

    #ribosome info is all in Reaction table bc incorporation notes are reaction-specific
    ribosome_name = models.CharField(max_length=50) #WT or mut name

    INCORPORATION_CHOICES = [
        ('Y', 'Yes'),
        ('N', 'No'),
        # percentage value
        ('P', models.FloatField())
    ]
    # for nterm and internal incorporation, can make charfield here then set choices in frontend
    # answers will be yes, no, percentage value, or "no data"(null/''?). Alternatively can make ChoiceField
    n_term_incorporation = models.CharField(max_length=1, choices=INCORPORATION_CHOICES, blank=True, default='')
    internal_incorporation = models.CharField(max_length=1, choices=INCORPORATION_CHOICES, blank=True, default='')

    READOUT_CHOICES = [
        ('LC', 'LC-MS'),
        ('SD','SDS-PAGE'),
        ('GF','GFP Fluorescence'),
        ('PE','Protein Expression')
    ]
    rib_readout = models.CharField(max_length=2, choices=READOUT_CHOICES, blank=True, default='')
    rib_incorporation_notes = models.TextField(blank=True, default='')
    #yield is percentage
    reaction_yield = models.FloatField(blank=True, null=True)
    #Kcat in min^-1
    reaction_Kcat = models.FloatField(blank=True, null=True)
    #Km in mM
    reaction_Km = models.FloatField(blank=True, null=True)
    #records when reaction was added to DB
    date_added = models.DateField(auto_now=True)
    assay = models.OneToOneField(MicrohelixAssay, blank=True, null=True, on_delete=models.SET_NULL)


