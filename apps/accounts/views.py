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
from .forms import LoginForm, SignupForm
from apps.accounts.models import ElementalUser
from apps.accounts.mixins import UnbannedUserMixin


from .models import ElementalUser
from apps.projects.models import Project

from .forms import UserSettingsForm

from .mixins import UnbannedUserMixin, LoggedInRequiredMixin

class ProfileView(UnbannedUserMixin, TemplateView):
    template_name = 'profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        context['user'] = ElementalUser.objects.get(username__iexact=self.kwargs['username'])
        if not self.request.user.is_superuser and len(self.request.user.groups.all()[0].name) > 0:
            auth_group = request.user.groups.all()[0].name

        # just a little failsafe in case of broken things...
        allowed_groups = ('admin', 'moderator', )
        if context['user'].can_share_projects or request.user.is_superuser or auth_group in allowed_groups:
            context['projects'] = Project.objects.filter(user=context['user'], shared=True)
        else:
            context['projects'] = Project.objects.none()
        
        return context

class UserSettings(LoggedInRequiredMixin, UnbannedUserMixin, FormView):
    template_name = 'user_settings.html'
    form_class = UserSettingsForm
    success_url = reverse_lazy('accounts:user-settings')

    def get_form_kwargs(self):
        kwargs = super(UserSettings, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        self.request.user.email = form.cleaned_data.get('email')
        self.request.user.save()
        if form.cleaned_data.get('password1') != '':
            self.request.user.password = form.cleaned_data.get('password1')
        self.request.user.save()
        return super(UserSettings, self).form_valid(form)

class SignUp(FormView):
    template_name = 'register.html'
    form_class = SignupForm
    success_url = '/'

    def get(self, request):
        if request.user.is_authenticated():
            return redirect(reverse('index'))
        return super(SignUp, self).get(request)

    def form_valid(self, form):
        super(SignUp, self).form_valid(form)
        form.save()
        user = authenticate(username=form.cleaned_data.get('username'),
                            password=form.cleaned_data.get('password1'))
        login(self.request, user)
        return redirect(reverse('index'))


class Logout(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect('/')

class Login(UnbannedUserMixin, FormView):
    template_name = 'login.html'
    form_class = LoginForm
    success_url = reverse_lazy('index')
    
    def form_valid(self, form):
        super(Login, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(self.request, user)
                if not user.banned:
                    return super(Login, self).form_valid(form)
                else:
                    return redirect(reverse('ban-page'))
            else:
                form.errors['non_field_errors'] = ['Your account is not active.']
                return render(self.request, 'index.html',
                              {'form': form})
        else:
            form.errors['non_field_errors'] = ['Invalid login']
            return render(self.request, 'login.html',
                          {'form': form})