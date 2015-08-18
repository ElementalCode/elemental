from django.contrib import admin
from django.db.models import Q
from django.contrib.auth.models import Group as AuthGroups

from .models import ElementalUser


class ElementalUserAdmin(admin.ModelAdmin):
    search_fields = ('username', )
    list_filter = ('groups', )

    superuser_fieldsets = (
        (None, {
            'fields': (
                'password', 'last_login', 'is_superuser',
                'groups', 'user_permissions', 'email',
                'is_staff', 'is_active', 'date_joined',
                'username',

                'banned', 'can_share_projects',
            )
        }),
    )

    admin_fieldsets = (
        (None, {
            'fields': (
                'password', 'last_login', 'groups',
                'user_permissions', 'email',
                'is_staff', 'is_active', 'date_joined',
                'username',

                'banned', 'can_share_projects', 'deleted', 
            )
        }),
    )

    mod_fieldsets = (
        (None, {
            'fields': (
                'password', 'last_login',
                'email', 'is_active',
                'date_joined', 'username',

                'banned', 'can_share_projects', 'deleted', 
            )
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if not request.user.is_superuser:
            auth_group = request.user.groups.all()[0].name
        if request.user.is_superuser:
            return self.superuser_fieldsets
        elif auth_group == 'admin':
            return self.admin_fieldsets
        elif auth_group == 'moderator':
            return self.mod_fieldsets

    def get_queryset(self, request):
        qs = super(ElementalUserAdmin, self).get_queryset(request)
        if not request.user.is_superuser and len(request.user.groups.all()) > 0:
            auth_group = request.user.groups.all()[0].name
        else:
            return qs
        if auth_group == 'admin':
            return qs.filter(~Q(groups__name='admin'), ~Q(is_superuser=True))
        elif auth_group == 'moderator':
            return qs.filter(~Q(groups__name='moderator'), ~Q(groups__name='admin'), ~Q(is_superuser=True))
        return qs

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        auth_groups = request.user.groups.all()
        for group in auth_groups:
            if db_field.name == 'groups':
                if group.name == 'admin':
                    groups = []
                    groups.append('moderator')
                    kwargs["queryset"] = AuthGroups.objects.filter(
                        name__in=groups)
        return super(ElementalUserAdmin, self).formfield_for_manytomany(
            db_field, request, **kwargs)

    def get_actions(self, request):
        actions = super(ElementalUserAdmin, self).get_actions(request)
        if not request.user.is_superuser:
            del actions['delete_selected']
        return actions

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        return False


admin.site.register(ElementalUser, ElementalUserAdmin)