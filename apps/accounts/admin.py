from django.contrib import admin
from django.db.models import Q

from .models import ElementalUser


class ElementalUserAdmin(admin.ModelAdmin):
    search_fields = ('username', )
    list_filter = ('groups', )

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

admin.site.register(ElementalUser, ElementalUserAdmin)