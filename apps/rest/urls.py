from django.conf.urls import include, url

from .views import ProjectDetail, UserDetail, ProjectCreate

urlpatterns = [
    # nothing
    url(r'^(?i)users/user/(?P<pk>\d+)/?$', UserDetail.as_view(), name='user-data'),
    url(r'^(?i)projects/project/(?P<pk>\d+)/?$', ProjectDetail.as_view(), name='project-data'),
    url(r'^(?i)projects/project/?$', ProjectCreate.as_view(), name='project-create'),
]