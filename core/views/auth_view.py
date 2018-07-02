from allauth.account.views import LoginView, SignupView
from django.contrib.admin.forms import AdminPasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import FormView
from django.views.generic import TemplateView
from django.views.generic import UpdateView

from core.models import CallDetail
from core.forms import UserSignupForm, SUPasswordChangeForm
from django.contrib.auth.models import User
from django.contrib.auth.views import PasswordChangeView

from core.mixins import SuperuserOnlyMixin


class LoginView(LoginView):
    template_name = 'login.html'

    def form_valid(self, form):
        _username = form.cleaned_data['login']
        try:
            _user = User.objects.get(username=_username)
            if not _user.is_active:
                form._errors['login'] = ["Access Denied. Contact Supervisor"]
                return super().form_invalid(form)
        except User.DoesNotExist:
            pass
        return super().form_valid(form)


class UserDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'csr/dashboard.html'

    def dispatch(self, request, *args, **kwargs):
        self.user_role = self.request.user.userrole.user_role.lower()
        return super(UserDashboardView, self).dispatch(request, **kwargs)

    def get_template_names(self):
        return '{}/dashboard.html'.format(self.user_role)

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)

        ctx['query_tickets'] = CallDetail.objects.filter(category__call_type=1).select_related('category').count()
        ctx['complain_tickets'] = CallDetail.objects.filter(category__call_type=2).select_related('category').count()
        return ctx


class UserChangePasswordView(FormView):
    template_name = 'superuser/change_password_form.html'
    form_class = SUPasswordChangeForm


class UserCreateView(SuperuserOnlyMixin, FormView):
    template_name = 'superuser/user_form.html'
    form_class = UserSignupForm
    success_url = reverse_lazy('add_new_user')

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['users'] = User.objects.select_related('userrole').filter(is_active=True, is_superuser=False, userrole__user_role__isnull=False)
        return ctx

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)

    def form_invalid(self, form):
        # import ipdb
        # ipdb.set_trace()
        return super().form_invalid(form)


class DeactivateCsrView(SuperuserOnlyMixin, UpdateView):
    template_name = 'superuser/deactivate_csr.html'
    model = User
    fields = ('is_active', )
    success_url = reverse_lazy('add_new_user')

    def get_object(self, queryset=None):
        user = get_object_or_404(User, username=self.kwargs['username'])
        return user

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()
        return super().post(request, **kwargs)
