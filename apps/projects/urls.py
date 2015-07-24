from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .views import ProjectEdit

urlpatterns = patterns('',
    url(r'^(?i)editor/?$', ProjectEdit.as_view(), name='create-project'),

    # resource urls
    ## js
    url(r'^(?i)js/script\.js$', TemplateView.as_view(template_name='js/script.js')),

    ## css
    url(r'^(?i)css/style\.css$', TemplateView.as_view(template_name='css/style.css', content_type='text/css')),
)
