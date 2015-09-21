from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from apps.landing.views import (Index, SignUp, Logout, TermsOfService,
								BanPage)
from apps.accounts.views import ProfileView, UserSettings

urlpatterns = patterns('',

	# Index views
    url(r'^$', Index.as_view(), name='index'),
    url(r'^(?i)admin/?', include(admin.site.urls)),
    url(r'^(?i)terms-of-service/?$', TermsOfService.as_view(), name='terms'),
    url(r'^(?i)banned/?$', BanPage.as_view(), name='ban-page'),

    # Stuff to possibly move aside
    url(r'^(?i)users/(?P<username>\w+)/?$', ProfileView.as_view(), name='profile'),

    # Namespaces
    url(r'^(?i)projects/', include('apps.projects.urls', namespace='projects')),
    url(r'^(?i)accounts/', include('apps.accounts.urls', namespace='accounts')),

    # REST stuff
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^(?i)rest/', include('apps.rest.urls', namespace='api')),
)
