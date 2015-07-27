from django.conf import settings
from django.contrib import messages
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group as AuthGroup
from django.contrib.sites.models import RequestSite
from django.core import signing
from django.core.mail import send_mail
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.views.generic import TemplateView, ListView
from django.views.generic.base import View
from django.views.generic.edit import (FormView, UpdateView, CreateView,
                                       DeleteView)


from .models import ElementalUser
from apps.projects.models import Project

from .forms import UserSettingsForm

from .mixins import UnbannedUserMixin

class ProfileView(UnbannedUserMixin, TemplateView):
    template_name = 'profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        context['user'] = ElementalUser.objects.get(username__iexact=self.kwargs['username'])
        if len(self.request.user.groups.all()[0].name) > 0:
            auth_group = request.user.groupa.all()[0].name

        # just a little failsafe in case of broken things...
        allowed_groups = ('admin', 'moderator', )
        if context['user'].can_share_projects or request.user.is_superuser or auth_group in allowed_groups:
            context['projects'] = Project.objects.filter(user=context['user'], shared=True)
        else:
            context['projects'] = False
        
        return context

class UserSettings(UnbannedUserMixin, FormView):
    template_name = 'user_settings.html'
    form_class = UserSettingsForm
    success_url = reverse_lazy('user-settings')

    def get_form_kwargs(self):
        kwargs = super(UserSettings, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        self.request.user.email = form.cleaned_data.get('email')
        if form.cleaned_data.get('password1') != '':
            self.request.user.password = form.cleaned_data.get('password1')
        self.request.user.save()
        return super(UserSettings, self).form_valid(form)