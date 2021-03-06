from django.contrib.auth.models import User
from django.db.models import Q
from requests import Response
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from core.models import Category, CallDetail, District, TypeOption
from core.serializer import CategorySerializer, TickerSerializer, DistrictSerializer, TickerDetailSerializer, \
    TypeSerializer, MainCategorySerializer, UserSerializer
from datetime import datetime

class TypeViewSet(viewsets.ModelViewSet):
    queryset = TypeOption.objects.all().order_by('name')
    serializer_class = TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True).order_by('name')
    serializer_class = CategorySerializer

    def get_queryset(self):
        params = self.request.query_params
        call_type = params.get("call_type", False)
        if call_type:
            self.queryset = self.queryset.filter(call_type=call_type)
        return self.queryset

class MainCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True).order_by('name')
    serializer_class = MainCategorySerializer

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


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50


class TicketViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all().order_by("-call_time")
    serializer_class = TickerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        params = self.request.query_params
        call_type = params.get("call_type", False)
        search_key = params.get("search_key", False)
        category = params.get("category", False)
        user = params.get("user", False)
        if call_type:
            self.queryset = self.queryset.filter(category__call_type=call_type)

        if search_key:
            self.queryset = self.queryset.filter(phone_number__icontains=search_key)

        if category:
            self.queryset = self.queryset.filter(category__id=category)

        if user:
            self.queryset = self.queryset.filter(user__id=user)
        date = params.get('date')
        if date and len(date) == 21:
            start, end = date.split("/")
            filter_start = datetime.strptime(start, '%Y-%m-%d')
            filter_end = datetime.strptime(end, '%Y-%m-%d')
            filter_end = filter_end.replace(hour=23, minute=59, second=59)
            self.queryset = self.queryset.filter(
                call_time__range=[filter_start, filter_end])

        return self.queryset



class TicketDetailViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all()
    serializer_class = TickerDetailSerializer


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
