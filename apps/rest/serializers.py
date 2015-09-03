from rest_framework import routers, serializers, viewsets

from apps.projects.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Project
        fields = ('username', 'shared', 'id', 'data', 'name', )

class ProjectCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('user', 'data', 'name', )