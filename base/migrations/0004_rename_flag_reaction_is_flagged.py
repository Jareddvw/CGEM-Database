# Generated by Django 4.0.2 on 2022-07-08 18:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_flag_reaction_flag'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reaction',
            old_name='flag',
            new_name='is_flagged',
        ),
    ]