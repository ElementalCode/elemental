from django.http import HttpResponseForbidden

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from apps.projects.models import Project
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


class ProjectCreate(SessionAuthentication, generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateSerializer