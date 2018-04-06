from django.urls import path

# from core.views import IndexView
from core.views.auth_view import LoginView

urlpatterns = [
    path('', LoginView.as_view(), name='login_page'),
]