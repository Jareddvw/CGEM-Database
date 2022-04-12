# Generated by Django 4.0.2 on 2022-04-12 23:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0025_remove_reference_id_alter_reference_doi'),
    ]

    operations = [
        migrations.AddField(
            model_name='reference',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='reference',
            name='DOI',
            field=models.TextField(max_length=50),
        ),
    ]