from rest_framework import serializers

from core.models import Category, CallDetail


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'call_type', 'other_properties',)


class TickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallDetail
        fields = ('category', 'other_properties', 'other_properties', 'user',
                  'phone_number', 'status','call_time','comment')


