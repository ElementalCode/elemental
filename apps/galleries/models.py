from django.db import models

from apps.projects.models import Project
from apps.accounts.models import ElementalUser

class Gallery(models.Model):
    name = models.CharField(max_length=25)


class ProjectToGallery(models.Model):
    project = models.ForeignKey(Project)
    gallery = models.ForeignKey('Gallery')

    def __unicode__(self):
        return '{0} is in {1}'.format(self.project.name, self.gallery.name)