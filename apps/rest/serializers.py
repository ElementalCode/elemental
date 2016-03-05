from django.core.exceptions import PermissionDenied

from rest_framework import routers, serializers, viewsets

from apps.projects.models import Project
from apps.accounts.models import ElementalUser


# class UserSpecificUpdate(serializers.ModelSerializer):

#     def update(self, instance, validated_data):
#         if self.context['request'].user == instance.user:
#             super(UserSerializer, self).update(


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElementalUser
        fields = ('id', 'username', 'date_joined', 'about_me', 'working_on', )
        read_only_fields = ('username', 'date_joined', )

    def update(self, instance, validated_data):
        get = validated_data.get
        if self.context['request'].user == instance:
            # need to find a better way...
            instance.about_me = get('about_me', instance.about_me)
            instance.working_on = get('working_on', instance.working_on)
            instance.save()
            return instance
        raise PermissionDenied


class ProjectSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('username', 'shared', 'id', 'data', 'name', 'thumbnail', )

    def get_username(self, obj):
        return obj.user.username

    def update(self, instance, validated_data):
        get = validated_data.get
        if self.context['request'].user == instance.user:
            # need to find a better way...
            instance.data = get('data', instance.data)
            instance.name = get('name', instance.name)
            instance.shared = get('shared', instance.shared)
            instance.thumbnail = get('thumbnail', instance.thumbnail)
            instance.save()
            return instance
        raise PermissionDenied


class ProjectCreateSerializer(serializers.ModelSerializer):

    def create(self, kwargs):
        if self.context['request'].user.can_share_projects:
            kwargs['user'] = self.context['request'].user
            return Project.objects.create(**kwargs)
        raise PermissionDenied

    class Meta:
        model = Project
        fields = ('data', 'name', 'id', 'thumbnail', )