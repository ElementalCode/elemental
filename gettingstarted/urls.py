from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from landing.views import Index, SignUp, Logout
from accounts.views import ProfileView

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name='index'),
    url(r'^(?i)users/(?P<username>\w+)/?$', ProfileView.as_view(), name='profile'),
    url(r'^(?i)register/?$', SignUp.as_view(), name='register'),
    url(r'^(?i)logout/?$', Logout.as_view(), name='logout'),
    url(r'^(?i)admin/?', include(admin.site.urls)),
)
