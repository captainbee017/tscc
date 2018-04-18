from django.contrib.auth.models import User
from django.views.generic import CreateView
from django.views.generic import ListView
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import CallDetail

from core.mixins import SuperuserOnlyMixin
from core.models import CallDetail, QUERY_TYPE


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
        can_approve = False
        if self.request.user.userrole.user_role in ["Superuser", "Moderator"]:
            can_approve =  True

        can_delete = False
        if self.request.user.userrole.user_role == "Superuser":
            can_delete =  True
        data['ticket_type'] = self.kwargs['ticket_type']
        data['can_approve'] = can_approve
        data['can_delete'] = can_delete
        return data

@api_view(["GET"])
def ticket_approve(request):
    params = request.query_params
    new_status = params.get("status", False)
    pk = params.get("pk", False)
    if new_status:
        try:
            CallDetail.objects.filter(pk=pk).update(status=new_status)
            return Response({"pk":pk}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error":"bad request"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def ticket_delete(request):
    params = request.query_params
    pk = params.get("pk", False)
    try:
        CallDetail.objects.filter(pk=pk).delete()
        return Response({"pk":pk}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
