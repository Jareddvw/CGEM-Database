# Generated by Django 4.0.2 on 2022-04-12 23:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0024_alter_reference_publication_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reference',
            name='id',
        ),
        migrations.AlterField(
            model_name='reference',
            name='DOI',
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]
