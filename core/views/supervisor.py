from django.views.generic import TemplateView


class CategorySettings(TemplateView):
    template_name = "core/category_settings.html"


class ManageCallDetails(TemplateView):
    template_name = "superuser/manage_call_detail.html"


class NewTicket(TemplateView):
    template_name = "core/new_ticket.html"


class Report(TemplateView):
    template_name = "core/ticket_report.html"

