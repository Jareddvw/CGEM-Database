# Generated by Django 4.0.2 on 2022-02-14 06:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0015_alter_reaction_internal_incorporation_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='synthetase',
            old_name='organism_id',
            new_name='organisms',
        ),
    ]
