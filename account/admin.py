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
        'is_superuser'
    )
    search_fields = ('email', 'username', 'orcid_id', 'institution')
    readonly_fields = ('id', 'date_joined', 'last_login')

    fieldsets = ()
    list_filter = ()

admin.site.register(Account, AccountAdmin)