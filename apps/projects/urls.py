from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .views import ProjectEdit

urlpatterns = patterns('',
    url(r'^(?i)editor/?$', ProjectEdit.as_view(), name='create-project'),
)
