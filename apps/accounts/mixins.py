from django.core.urlresolvers import reverse
from django.shortcuts import redirect


class UnbannedUserMixin(object):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
        	if request.user.banned:
        		return redirect(reverse('ban-page'))
        return super(UnbannedUserMixin, self).dispatch(request, *args, **kwargs)