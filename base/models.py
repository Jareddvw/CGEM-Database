from django.db import models

# Create your models here.

class T_RNA(models.Model):
    tRNA_name = models.CharField(max_length=250)
    tRNA_seq = models.TextField(blank=True, default='')

    def __str__(self):
        return self.tRNA_name

class Monomer(models.Model):
    monomer_name = models.CharField(max_length=250, blank=True, default='')
    #SMILES is only thing required for all monomers.
    monomer_smiles = models.TextField(default='')
    monomer_LG = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        #returns monomer_smiles if name is blank
        return self.monomer_name or self.monomer_smiles

class Flexizyme(models.Model):
    #flexizyme name and sequence are both required
    flex_name = models.CharField(max_length=50)
    flex_sequence = models.TextField(blank=True, default='')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['flex_name', 'flex_sequence'], name='unique flexizyme name')
        ]

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

class ParentSynth(models.Model):
    parent_name = models.CharField(max_length=50, null=False, blank=False)
    # potentially will only have pbd structure codes for parent synthetase, not for synthetase mutant
    parent_pbd_id = models.CharField(max_length=10, blank=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['parent_name', 'parent_pbd_id'], name='unique parent')
        ]

class Synthetase(models.Model):
    synth_common_name = models.CharField(max_length=100)
    parent_synthetase = models.ForeignKey(ParentSynth, on_delete=models.CASCADE, null=False)
    accession_id = models.CharField(max_length=50, blank=True)
    pbd_id = models.CharField(max_length=10, blank=True)
    # not sure if synthetase should be allowed to have no associated organism but rn it is allowed
    organisms = models.ManyToManyField(Organism, related_name="synthetases", blank=True)
    # WT synthetase e.g. will have no mutations
    mutations = models.ManyToManyField(SynthMutations, related_name="synthetases", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['synth_common_name', 'accession_id'], name='unique synthetase')
        ]

    def __str__(self):
        return self.synth_common_name

class Reference(models.Model):
    # DOI, is required
    DOI = models.CharField(max_length=50)
    title = models.CharField(max_length=250, default='', blank=True)
    publication_date = models.DateField(auto_now=False, blank=True, null=True)
    journal = models.CharField(max_length=75, blank=True, default='')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['DOI', 'title', 'journal'], name='unique reference')
        ]

    def __str__(self):
        return '%d: %s' % (self.pk, self.DOI)


#Usually only present if the reaction uses a flexizyme
class MicrohelixAssay(models.Model):
    conditions = models.TextField(max_length=None, blank=True, default='')
    #acylation_yield should be a percentage so need to input as value between 0 and 1
    acylation_yield = models.FloatField(null=True, blank=True)
    assay_notes = models.TextField(max_length=None, blank=True, default='')
    def __str__(self):
        return 'Assay # %d' % (self.pk)

## Primary object of the database ##
class Reaction(models.Model):
    #a reference can have multiple rxns listed, and reaction can have multiple references

    references = models.ManyToManyField(Reference, related_name="reactions")

    #a reaction will either have a flexizyme, a synthetase, or neither (chemical acylation) so null for both.
    flexizyme = models.ForeignKey(Flexizyme, on_delete=models.SET_NULL, null=True, blank=True, related_name = 'reactions')
    synthetase = models.ForeignKey(Synthetase, on_delete=models.SET_NULL, null=True, blank=True, related_name ='reactions')
    ## there are multiple reactions with the same monomer. ##
    # if the monomer is deleted its associated reaction will be deleted too.
    monomer = models.ForeignKey(Monomer, on_delete=models.CASCADE, related_name="reactions")
    # deleting a tRNA deletes all associated reactions with that tRNA
    tRNA = models.ForeignKey(T_RNA, on_delete=models.CASCADE)

    #ribosome info is all in Reaction table bc incorporation notes are reaction-specific
    ribosome_name = models.CharField(max_length=50) #WT or mut name

    INCORPORATION_CHOICES = [
        ('Y', 'Yes'),
        ('N', 'No'),
    ]
    # for nterm and internal incorporation, can make charfield here then set choices in frontend
    # answers will be yes, no, percentage value, or "no data"(null/''?). Alternatively can make ChoiceField
    n_term_incorporation = models.CharField(max_length=1, choices=INCORPORATION_CHOICES, blank=True, default='')
    # in frontend will need to make it so if N-term or internal incorporation choices are yes, can then input a numerical value as a percentage.
    n_term_percent = models.FloatField(blank=True, null=True)
    internal_incorporation = models.CharField(max_length=1, choices=INCORPORATION_CHOICES, blank=True, default='')
    internal_percent = models.FloatField(blank=True, null=True)

    rib_readout = models.CharField(max_length=30, blank=True, default='')
    rib_incorporation_notes = models.TextField(blank=True, default='')
    # yield is percentage
    reaction_yield = models.FloatField(blank=True, null=True)
    # Kcat in min^-1
    reaction_Kcat = models.FloatField(blank=True, null=True)
    # Km in mM
    reaction_Km = models.FloatField(blank=True, null=True)
    # records when reaction was added to DB
    date_added = models.DateField(auto_now=True)
    # assay field will be set to null if the associated MicrohelixAssay is deleted.
    # Potential problem: can build up lots of assays that won't be deleted because no way to delete them.
    assay = models.OneToOneField(MicrohelixAssay, blank=True, null=True, on_delete=models.SET_NULL, related_name="reaction")

    def __str__(self):
        return 'Reaction %d: %s' % (self.pk, self.monomer.__str__())

    class Meta:
        ordering = ('id',)
        


