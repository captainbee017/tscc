from django.contrib.auth.models import User
from django.views.generic import CreateView
from django.views.generic import ListView
from django.views.generic import TemplateView

from core.mixins import SuperuserOnlyMixin
from core.models import CallDetail, QUERY_TYPE


class CategorySettings(TemplateView):
    template_name = "core/category_settings.html"


class ManageCallDetails(TemplateView):
    template_name = "superuser/manage_call_detail.html"


class NewTicket(TemplateView):
    template_name = "core/new_ticket.html"


class Report(TemplateView):
    template_name = "core/ticket_report.html"


class ManageTickets(SuperuserOnlyMixin, ListView):
    """
    Manage tickets:
    receive ticket categories from kwargs and filter categories as such
    """
    model = CallDetail
    template_name = 'superuser/manage_ticket.html'

    def get_queryset(self, **kwargs):
        ticket_type = self.kwargs['ticket_type']
        qt = [a[0] for a in QUERY_TYPE if a[1].lower() == ticket_type]
        return super().get_queryset(**kwargs).filter(category__call_type=qt[0])

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx['ticket_type'] = self.kwargs['ticket_type']
        return ctx

