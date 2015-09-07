from rest_framework import routers, serializers, viewsets

from apps.projects.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('username', 'shared', 'id', 'data', 'name', )

    def get_username(self, obj):
        return obj.user.username

    def update(self, instance, validated_data):
        print self.context['request']
        return instance


class ProjectCreateSerializer(serializers.ModelSerializer):

    def create(self, kwargs):
        kwargs['user'] = self.context['request'].user
        return Project.objects.create(**kwargs)

    class Meta:
        model = Project
        fields = ('data', 'name', 'id', )