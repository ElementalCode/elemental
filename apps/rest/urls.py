from django.conf.urls import patterns, include, url

from .views import ProjectDetail

urlpatterns = patterns('',
    # nothing
    url(r'^(?i)projects/project/(?P<pk>\d+)/?$', ProjectDetail.as_view(), name='project-data'),
)
