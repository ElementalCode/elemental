from django.conf import settings
from django.contrib import messages
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group as AuthGroup
from django.contrib.sites.models import RequestSite
from django.core import signing
from django.core.mail import send_mail
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse, Http404
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, ListView
from django.views.generic.base import View
from django.views.generic.edit import (FormView, UpdateView, CreateView,
                                       DeleteView)

from apps.accounts.mixins import UnbannedUserMixin, LoggedInRequiredMixin
from .models import Project


class ProjectCreate(UnbannedUserMixin, TemplateView):
    template_name = 'editor.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectCreate, self).get_context_data(**kwargs)
        context['new_project'] = True
        return context


class MyProjects(UnbannedUserMixin, LoggedInRequiredMixin, ListView):
    template_name = 'my_projects.html'
    model = Project
    paginate_by = 25
    context_object_name = 'projects'

    def get_queryset(self): # add filtering later?
        return Project.objects.filter(user=self.request.user, deleted=False).order_by('updated')

class ProjectEdit(UnbannedUserMixin, TemplateView):
    template_name = 'editor.html'

    def dispatch(self, request, *args, **kwargs):
        project = Project.objects.get(id=self.kwargs['pk'])
        if project.user != request.user:
            if not project.user.can_share_projects or not project.shared or project.deleted:
                return redirect('/') # should be 404...
        return super(ProjectEdit, self).dispatch(request)

    def get_context_data(self, **kwargs):
        context = super(ProjectEdit, self).get_context_data(**kwargs)
        context['project'] = Project.objects.get(id=self.kwargs['pk'])
        return context