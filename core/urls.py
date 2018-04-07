from django.urls import path, include
from rest_framework import routers

# from core.views import IndexView
from core.views.auth_view import LoginView
from core.viewsets import CategoryViewSet, TicketViewSet
from core.views import supervisor as sv

router = routers.DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'ticket', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('category-settings/', sv.CategorySettings.as_view(), name='category_settings'),
    path('login/', LoginView.as_view(), name='login_page'),
]