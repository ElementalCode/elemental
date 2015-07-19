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
from accounts.models import ElementalUser


class Index(FormView):
    template_name = 'index.html'
    form_class = LoginForm
    success_url = reverse_lazy('index')
    
    def form_valid(self, form):
        super(Index, self).form_valid(form)
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user = authenticate(username=email, password=password)

        if user is not None:
            if user.is_active:
                login(self.request, user)
                return super(Index, self).form_valid(form)
            else:
                form.errors['non_field_errors'] = ['Your account is not active.']
                return render(self.request, 'index.html',
                              {'form': form})
        else:
            form.errors['non_field_errors'] = ['Invalid login']
            return render(self.request, 'index.html',
                          {'form': form})


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
        print form.cleaned_data.get('email')
        print form.cleaned_data.get('password1')
        user = authenticate(username=form.cleaned_data.get('email'),
                            password=form.cleaned_data.get('password1'))
        print user
        print ElementalUser.objects.all()
        print user in ElementalUser.objects.all()
        login(self.request, user)
        return redirect(reverse('profile'))