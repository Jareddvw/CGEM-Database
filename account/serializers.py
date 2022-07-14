from rest_framework import serializers
from account.models import Account

class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Account
        fields = [
            'email', 
            'username', 
            'institution', 
            'orcid_id', 
            'password', 
            'password2' 
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def	save(self):
        account = Account(
                    email=self.validated_data['email'],
                    username=self.validated_data['username'],
                    orcid_id=self.validated_data['orcid_id'],
                    institution=self.validated_data['institution']
                )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        account.set_password(password)
        account.save()
        return account


class AccountDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['pk', 'username', 'email', 'is_admin', 'is_staff', 'institution', 'orcid_id', 'date_joined', 'first_name']


class ChangePasswordSerializer(serializers.Serializer):
    model = Account
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

