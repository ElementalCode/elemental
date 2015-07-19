from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from landing.views import Index

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gettingstarted.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', Index.as_view(), name='index'),
    url(r'^admin/', include(admin.site.urls)),

)
