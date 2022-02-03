from rest_framework import serializers

from base.models import *

#serializers for database models in base.models

class ReactionSerializer(models.ModelSerializer):
    class Meta:
        model = Reaction
        fields = [
            'id',
            'DOI',
            'flexizyme',
            'synthetase',
            'monomer',
            
        ]