import os
import re

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from projects.models import Project


class Project(models.Model):
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(_('date created'), default=timezone.now)