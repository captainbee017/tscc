from rest_framework import viewsets

from core.models import Category, CallDetail
from core.serializer import CategorySerializer, TickerSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = CallDetail.objects.all()
    serializer_class = TickerSerializer
