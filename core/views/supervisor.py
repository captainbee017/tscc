from django.views.generic import TemplateView


class CategorySettings(TemplateView):
    template_name = "core/category_settings.html"

class NewTicket(TemplateView):
    template_name = "core/new_ticket.html"


