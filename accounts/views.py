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

class ProfileView(TemplateView):
	template_name = 'profile.html'

	def get_context_data(self, **kwargs):
		context = super(ProfileView, self).get_context_data(**kwargs)
		context['user'] = ElementalUser.objects.get(username__iexact=self.kwargs['username'])
		return context
