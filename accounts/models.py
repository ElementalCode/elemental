import os
import re

from django.contrib.auth.hashers import is_password_usable
from django.contrib.auth.models import (
	BaseUserManager,
	AbstractBaseUser,
	PermissionsMixin)
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from projects.models import Project

from django.core.validators import RegexValidator


class AuthUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(username=username, email=self.normalize_email(email),
                          )
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username=username, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class ElementalUser(AbstractBaseUser, PermissionsMixin):
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', message='Only alphanumeric characters are allowed.')

    ### Redefine the basic fields that would normally be defined in User ###
    username = models.CharField(unique=True, max_length=20, validators=[alphanumeric])
    email = models.EmailField(verbose_name='email address', unique=True, max_length=255)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, null=False)
    is_staff = models.BooleanField(default=False, null=False)

    ### Our own fields ###
    profile_image = models.ImageField(upload_to="uploads", blank=False, null=False, default="/static/images/defaultuserimage.png")
    user_bio = models.CharField(max_length=600, blank=True)

    objects = AuthUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def get_full_name(self):
        fullname = self.first_name+" "+self.last_name
        return fullname

    def get_short_name(self):
        return self.username

    def __unicode__(self):
        return self.email


# class ProjectOwnership(models.Model):
# 	user = models.ForeignKey('ElementalUser')
# 	project = models.ForeignKey(Project)

# 	def __unicode__(self):
# 		return '{0} - {1}'.format(self.user, self.project)


# class ElementalUserManager(BaseUserManager):

# 	def _create_user(self, email, password,
# 					 is_staff, is_superuser, **extra_fields):
# 		"""
# 		Creates and saves a User with the given email and password.
# 		"""
# 		now = timezone.now()
# 		if not email:
# 			raise ValueError('The given email must be set')
# 		email = self.normalize_email(email)
# 		user = self.model(email=email,
# 						  is_staff=is_staff, is_active=True,
# 						  is_superuser=is_superuser, last_login=now,
# 						  date_joined=now, **extra_fields)
# 		user.set_password(password)
# 		user.save(using=self._db)
# 		return user

# 	def create_user(self, email, password=None, **extra_fields):
# 		return self._create_user(email, password, False, False,
# 								 **extra_fields)

# 	def create_superuser(self, email, password, **extra_fields):
# 		return self._create_user(email, password, True, True,
# 								 **extra_fields)


# class ElementalUser(AbstractBaseUser, PermissionsMixin):
# 	email = models.EmailField(
# 		verbose_name='email address',
# 		max_length=255,
# 		unique=True,
# 	)
# 	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
# 	projects = models.ManyToManyField(Project, blank=True,
# 										   through='ProjectOwnership')

# 	### Redefine the basic fields that would normally be defined in User ###
# 	first_name = models.CharField(max_length=30, null=True, blank=True)
# 	last_name = models.CharField(max_length=50, null=True, blank=True)
# 	is_active = models.BooleanField(default=True, null=False)
# 	is_staff = models.BooleanField(default=False, null=False)

# 	objects = ElementalUserManager()
# 	REQUIRED_FIELDS = []
# 	USERNAME_FIELD = 'email'