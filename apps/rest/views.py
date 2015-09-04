from django.http import HttpResponseForbidden

from rest_framework import generics, status
import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, ListView
from django.views.generic.base import View

from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from apps.projects.models import Project
from apps.accounts.mixins import LoggedInRequiredMixin
from .serializers import ProjectSerializer, ProjectCreateSerializer


class ProjectDetail(SessionAuthentication, generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return Project.objects.get(
            id=self.kwargs['pk'])

    def delete(self, request, pk):
        p = Project.objects.get(
            id=self.kwargs['pk'])
        p.deleted = True
        p.save()


class ProjectCreate(LoggedInRequiredMixin, View): # required: data, name

    def post(self, request, *args, **kwargs):

        def is_json(myjson):
            try:
                json_object = json.loads(myjson)
            except ValueError, e:
                return False
            return True

        project = Project.objects.get(id=kwargs['pk'])
        get = request.POST.get

        if is_json(get('project_data')) and get('name'):
            p = Project.objects.create(
                    data=get('project_data'),
                    name=get('name'),
                    user=request.user
                )

        return HttpResponse('')