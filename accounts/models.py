import os
import re

from django.contrib.auth.hashers import is_password_usable
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin)
from django.db import models
from django.utils import timezone

from projects.models import Project


class ProjectOwnership(models.Model):
    user = models.ForeignKey('ElementalUser')
    project = models.ForeignKey(Project)
    state = models.CharField(choices=STATES, default='pending', max_length=25)

    def __unicode__(self):
        return '{0} - {1} - {2}'.format(self.user, self.organization,
                                        self.state)


class ElementalUser(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    projects = models.ManyToManyField(Project, null=True, blank=True,
                                           through='ProjectOwnership')