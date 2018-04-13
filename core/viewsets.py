from rest_framework import viewsets

from core.models import Category, CallDetail
from core.serializer import CategorySerializer, TickerSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer

    def get_queryset(self):
        # import ipdb
        # ipdb.set_trace()
        params = self.request.query_params
        call_type = params.get("call_type", False)
        if call_type:
            self.queryset = self.queryset.filter(call_type=call_type)
        return self.queryset


class TicketViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all()
    serializer_class = TickerSerializer
