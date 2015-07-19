from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail


class Project(models.Model):
    name = models.CharField(_('name'), max_length=50, blank=True)

    def __unicode__(self):
        return self.name