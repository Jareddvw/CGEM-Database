from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from account.models import Account


class AccountAdmin(UserAdmin):
    list_display = (
        'email',
        'username',
        'orcid_id',
        'institution',
        'date_joined',
        'is_admin',
        'is_staff',
    )
    search_fields = ('email', 'username', 'orcid_id', 'institution')
    readonly_fields = ('id', 'date_joined', 'last_login')

    fieldsets = ()

admin.site.register(Account, AccountAdmin)