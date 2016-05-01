from django.db import models

from apps.accounts.models import ElementalUser

class Project(models.Model):
    name = models.CharField('name', max_length=50)
    user = models.ForeignKey(ElementalUser)
    shared = models.BooleanField(default=False)
    data = models.TextField()
    deleted = models.BooleanField(default=False)
    thumbnail = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    featured = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.user.trusted:
            self.shared = False
        super(Project, self).save(*args, **kwargs)