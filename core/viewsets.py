from requests import Response
from rest_framework import viewsets

from core.models import Category, CallDetail, District
from core.serializer import CategorySerializer, TickerSerializer, DistrictSerializer, TickerDetailSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True).order_by('name')
    serializer_class = CategorySerializer

    def get_queryset(self):
        params = self.request.query_params
        call_type = params.get("call_type", False)
        if call_type:
            self.queryset = self.queryset.filter(call_type=call_type)
        return self.queryset


class CategoryDetailViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

    def get_queryset(self):
        params = self.request.query_params
        call_type = params.get("call_type", False)
        if call_type:
            self.queryset = self.queryset.filter(call_type=call_type)
        return self.queryset


class TicketViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all()
    serializer_class = TickerSerializer

    def get_queryset(self):
        params = self.request.query_params
        call_type = params.get("call_type", False)
        search_key = params.get("search_key", False)
        if call_type:
            self.queryset = self.queryset.filter(category__call_type=call_type)

        if search_key:
            self.queryset = self.queryset.filter(phone_number__icontains=search_key)
        return self.queryset


class TicketDetailViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all()
    serializer_class = TickerDetailSerializer


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
