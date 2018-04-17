from django.contrib.auth.models import User
from django.views.generic import CreateView
from django.views.generic import TemplateView


class CategorySettings(TemplateView):
    template_name = "core/category_settings.html"

    def get_context_data(self, *args, **kwargs):
        data = super(CategorySettings, self).get_context_data(*args, ** kwargs)
        data['ticket_type'] = self.kwargs['ticket_type']
        return data


class ManageCallDetails(TemplateView):
    template_name = "superuser/manage_call_detail.html"


class NewTicket(TemplateView):
    template_name = "core/new_ticket.html"

    def get_context_data(self, *args, **kwargs):
        data = super(NewTicket, self).get_context_data(*args, ** kwargs)
        data['ticket_type'] = self.kwargs['ticket_type']
        return data


class Report(TemplateView):
    template_name = "core/ticket_report.html"

    def get_context_data(self, *args, **kwargs):
        data = super(Report, self).get_context_data(*args, ** kwargs)
        data['ticket_type'] = self.kwargs['ticket_type']
        return data

