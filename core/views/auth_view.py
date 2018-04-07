from allauth.account.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from django.views import View
from django.views.generic import TemplateView


class LoginView(LoginView):
    template_name = 'login.html'


class UserDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'csr/dashboard.html'

    def dispatch(self, request, *args, **kwargs):
        self.user_role = self.request.user.userrole.user_role.lower()
        return super(UserDashboardView, self).dispatch(request, **kwargs)

    def get_template_names(self):
        return '{}/dashboard.html'.format(self.user_role)
