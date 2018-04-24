from django.views.generic import TemplateView
from django.http import Http404
from core.models import Category


class NewTicketView(TemplateView):
	template_name = 'new_ticket.html'

	def dispatch(self, request, *args, **kwargs):
		self.ticket_type = self.kwargs['ticket_type']
		return super().dispatch(request, *args, **kwargs)

	def get_context_data(self, *args, **kwargs):
		ctx = super().get_context_data(*args, **kwargs)
		ctx['ticket_type'] = self.ticket_type
		ctx['categories'] = self.get_categories()
		return ctx

	def get_categories(self):
		if self.ticket_type == 'query':
			call_type = 1
		elif self.ticket_type == 'complain':
			call_type = 2
		else:
			raise Http404("Invalid link")
		return Category.objects.filter(call_type=call_type, parent__isnull=True)
