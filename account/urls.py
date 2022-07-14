from django.urls import path
from account.views import(
	registration_view,
	account_details_view,
	update_account_view,
	ChangePasswordView
)

app_name = 'account'

urlpatterns = [
	path('register', registration_view, name="register"),
	path('details', account_details_view, name="details"),
	path('details/update', update_account_view, name="update user info"),
	path('change-password', ChangePasswordView.as_view(), name="change password")
]