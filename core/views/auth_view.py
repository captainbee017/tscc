from allauth.account.views import LoginView


class LoginView(LoginView):
    template_name = 'login.html'

    def dispatch(self, *args, **kwargs):
        # import ipdb
        # ipdb.set_trace()
        return super().dispatch()