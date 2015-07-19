import os
import re

from django.db import models
from django.utils import timezone

from projects.models import Project


class Project(models.Model):
	name = models.CharField(max_length=255)