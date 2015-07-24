from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from apps.landing.views import (Index, SignUp, Logout, TermsOfService)
from apps.accounts.views import ProfileView

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name='index'),
    url(r'^(?i)users/(?P<username>\w+)/?$', ProfileView.as_view(), name='profile'),
    url(r'^(?i)register/?$', SignUp.as_view(), name='register'),
    url(r'^(?i)logout/?$', Logout.as_view(), name='logout'),
    url(r'^(?i)admin/?', include(admin.site.urls)),
    url(r'^(?i)terms-of-service/?$', TermsOfService.as_view(), name='terms'),

    url(r'^(?i)projects/', include('apps.projects.urls', namespace='projects')),
)
