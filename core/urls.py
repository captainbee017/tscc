from django.urls import path, include
from rest_framework import routers

from django.urls import re_path

from core.views.auth_view import LoginView, UserDashboardView
from core.viewsets import CategoryViewSet, TicketViewSet

router = routers.DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'ticket', TicketViewSet)



urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]
