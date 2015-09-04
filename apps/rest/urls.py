from django.conf.urls import patterns, include, url

from .views import ProjectDetail, ProjectCreate

urlpatterns = patterns('',
    # nothing
    url(r'^(?i)projects/project/(?P<pk>\d+)/?$', ProjectDetail.as_view(), name='project-data'),
    url(r'^(?i)projects/project/?$', ProjectCreate.as_view(), name='project-create'),
)
