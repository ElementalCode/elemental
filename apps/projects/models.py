from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail


from apps.accounts.models import ElementalUser

class Project(models.Model):
    name = models.CharField(_('name'), max_length=50)
    user = models.ForeignKey(ElementalUser)
    shared = models.BooleanField(default=False)
    data = models.TextField()
    deleted = models.BooleanField(default=False)
    thumbnail = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.user.can_share_projects:
            self.shared = False
        super(Project, self).save(*args, **kwargs)