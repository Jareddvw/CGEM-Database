from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class CustomAccountManager(BaseUserManager):

    def create_user(self, email, username, password=None, **other_fields):
        if not email:
            raise ValueError("users must have an email field.")
        if not username:
            raise ValueError("users must have a name.")
        user = self.model(
            email = self.normalize_email(email),
            username=username,
            **other_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, username, password, **other_fields):
        user = self.create_user(
            email = self.normalize_email(email),
            username=username,
            password=password,
            **other_fields
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self.db)
        return user


# overriding default User class to make email the default username field and add additional fields.

class Account(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(verbose_name='email address', unique=True)
    username = models.CharField(max_length=150, blank=True)
    orcid_id = models.CharField(verbose_name="ORCID iD", max_length=150, blank=True)
    institution = models.CharField(max_length=150, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    #included to prevent FieldError
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.USERNAME_FIELD
