from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .views import ProjectCreate, ProjectEdit

urlpatterns = patterns('',
    url(r'^(?i)editor/?$', ProjectCreate.as_view(), name='create-project'),
    url(r'^(?i)project/(?P<pk>\d+)/?$', ProjectEdit.as_view(), name='edit-project'),
    # url(r'^(?i)proof-of-concept/?$', TemplateView.as_view(template_name='proof-of-concept.html')),
)
