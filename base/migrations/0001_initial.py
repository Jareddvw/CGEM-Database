# Generated by Django 4.0.2 on 2022-05-30 02:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Flexizyme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flex_name', models.CharField(max_length=50)),
                ('flex_sequence', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='MicrohelixAssay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conditions', models.TextField(blank=True, default='')),
                ('acylation_yield', models.FloatField(blank=True, null=True)),
                ('assay_notes', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Monomer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monomer_name', models.CharField(blank=True, default='', max_length=250)),
                ('monomer_smiles', models.TextField(default='')),
                ('monomer_LG', models.CharField(blank=True, default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Organism',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('organism_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ParentSynth',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent_name', models.CharField(max_length=50)),
                ('parent_pbd_id', models.CharField(blank=True, default='', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DOI', models.CharField(max_length=50)),
                ('title', models.CharField(blank=True, default='', max_length=250)),
                ('publication_date', models.DateField(blank=True, null=True)),
                ('journal', models.CharField(blank=True, default='', max_length=75)),
            ],
        ),
        migrations.CreateModel(
            name='SynthMutations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mutation_name', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='T_RNA',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tRNA_name', models.CharField(max_length=250)),
                ('tRNA_seq', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Synthetase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('synth_common_name', models.CharField(max_length=100)),
                ('accession_id', models.CharField(blank=True, max_length=50)),
                ('pbd_id', models.CharField(blank=True, max_length=10)),
                ('mutations', models.ManyToManyField(blank=True, related_name='synthetases', to='base.SynthMutations')),
                ('organisms', models.ManyToManyField(blank=True, related_name='synthetases', to='base.Organism')),
                ('parent_synthetase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.parentsynth')),
            ],
        ),
        migrations.CreateModel(
            name='Reaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ribosome_name', models.CharField(max_length=50)),
                ('n_term_incorporation', models.CharField(blank=True, choices=[('Y', 'Yes'), ('N', 'No')], default='', max_length=1)),
                ('n_term_percent', models.FloatField(blank=True, null=True)),
                ('internal_incorporation', models.CharField(blank=True, choices=[('Y', 'Yes'), ('N', 'No')], default='', max_length=1)),
                ('internal_percent', models.FloatField(blank=True, null=True)),
                ('rib_readout', models.CharField(blank=True, default='', max_length=30)),
                ('rib_incorporation_notes', models.TextField(blank=True, default='')),
                ('reaction_yield', models.FloatField(blank=True, null=True)),
                ('reaction_Kcat', models.FloatField(blank=True, null=True)),
                ('reaction_Km', models.FloatField(blank=True, null=True)),
                ('date_added', models.DateField(auto_now=True)),
                ('assay', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reaction', to='base.microhelixassay')),
                ('flexizyme', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reactions', to='base.flexizyme')),
                ('monomer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reactions', to='base.monomer')),
                ('references', models.ManyToManyField(related_name='reactions', to='base.Reference')),
                ('synthetase', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reactions', to='base.synthetase')),
                ('tRNA', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.t_rna')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('id',),
            },
        ),
    ]
