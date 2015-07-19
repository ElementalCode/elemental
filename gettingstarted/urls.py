from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from landing.views import Index, SignUp

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name='index'),
    url(r'^$', Index.as_view(), name='profile'),
    url(r'^$', SignUp.as_view(), name='register'),
    url(r'^admin/', include(admin.site.urls)),
)
