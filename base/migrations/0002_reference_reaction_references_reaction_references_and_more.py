# Generated by Django 4.0.2 on 2022-04-21 07:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('DOI', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, default='', max_length=250)),
                ('publication_date', models.DateField(blank=True, null=True)),
                ('journal', models.CharField(blank=True, default='', max_length=75)),
            ],
        ),
        migrations.CreateModel(
            name='Reaction_references',
            fields=[
                ('reference_doi', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='base.reference')),
            ],
        ),
        migrations.AddField(
            model_name='reaction',
            name='references',
            field=models.ManyToManyField(related_name='reactions', through='base.Reaction_references', to='base.Reference'),
        ),
        migrations.AddField(
            model_name='reaction_references',
            name='reaction_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.reaction'),
        ),
    ]
