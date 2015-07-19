from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from landing.views import Index, SignUp, Logout

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name='index'),
    url(r'^$', Index.as_view(), name='profile'),
    url(r'^register/?$', SignUp.as_view(), name='register'),
    url(r'^logout/?$', Logout.as_view(), name='logout'),
    url(r'^admin/?', include(admin.site.urls)),
)
