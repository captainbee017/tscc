from django.urls import path

# from core.views import IndexView
from django.urls import re_path

from core.views.auth_view import LoginView, UserDashboardView

urlpatterns = [
    path('', LoginView.as_view(), name='login_page'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
    # re_path(r'^accounts/(?P<user_role>\w+)/$', UserDashboardView.as_view(), name='user_dashboard'),
]