from django.http import Http404


class SuperuserOnlyMixin:

    def dispatch(self, request, *args, **kwargs):
        if request.user.userrole.user_role.lower() != 'superuser':
            raise Http404("Access Denied. Looks like you followed a bad link")
        return super().dispatch(request, *args, **kwargs)