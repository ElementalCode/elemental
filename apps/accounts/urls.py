from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from views import ProfileView, UserSettings, SignUp, Logout, Login

urlpatterns = patterns('',
	url(r'^(?i)settings/?$', UserSettings.as_view(), name='user-settings'),
    url(r'^(?i)register/?$', SignUp.as_view(), name='register'),
    url(r'^(?i)logout/?$', Logout.as_view(), name='logout'),
    url(r'^(?i)login/?$', Login.as_view(), name="login"),
)