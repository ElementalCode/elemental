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


class ProjectOwnership(models.Model):
	user = models.ForeignKey('ElementalUser')
	project = models.ForeignKey(Project)

	def __unicode__(self):
		return '{0} - {1}'.format(self.user, self.project)


class ElementalUserManager(BaseUserManager):

    def _create_user(self, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True,
                                 **extra_fields)


class ElementalUser(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True,
	)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
	projects = models.ManyToManyField(Project, null=True, blank=True,
										   through='ProjectOwnership')

	USERNAME_FIELD = 'email'