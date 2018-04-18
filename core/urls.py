from django.urls import path, include
from rest_framework import routers

from django.urls import re_path

from core.views.auth_view import LoginView, UserDashboardView, UserCreateView, UserChangePasswordView, DeactivateCsrView
from core.viewsets import CategoryViewSet, TicketViewSet, CategoryDetailViewSet, DistrictViewSet, TicketDetailViewSet
from core.views import supervisor as sv

router = routers.DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'ticket', TicketViewSet)
router.register(r'districts', DistrictViewSet)


urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
    path('category/<pk>/', CategoryDetailViewSet.as_view({'get':'retrieve', 'put':'update'}), name='cat_details'),
    path('', include(router.urls)),
    path('category-settings/<ticket_type>/', sv.CategorySettings.as_view(), name='category_settings'),

    path('manage-calls/list/', sv.ManageCallDetails.as_view(), name='manage_call_details'),

    path('new-ticket/<ticket_type>/', sv.NewTicket.as_view(), name='new_ticket'),
    path('reports/<ticket_type>', sv.Report.as_view(), name='report'),
    path('ticket-approve/', sv.ticket_approve, name='ticket_approve'),
    path('ticket-delete/', sv.ticket_delete, name='ticket_delete'),
    path('ticketdata/<pk>/', TicketDetailViewSet.as_view({'get':'retrieve'}), name='ticket_delete'),
    path('login/', LoginView.as_view(), name='login_page'),

    path('new-user/', UserCreateView.as_view(), name='add_new_user'),
    path('change-password/<username>/', UserChangePasswordView.as_view(), name='change_password'),
    path('deactivate/<username>/', DeactivateCsrView.as_view(), name='deactivate_csr'),

    path('manage-tickets/<ticket_type>/', sv.ManageTickets.as_view(), name='manage_tickets'),
]

