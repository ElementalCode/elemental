from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail


from accounts.models import ElementalUser

class Project(models.Model):
    name = models.CharField(_('name'), max_length=50, blank=True)
    user = models.ForeignKey(ElementalUser)
	# shared = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name