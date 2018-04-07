from rest_framework import serializers

from core.models import Category, CallDetail
from rest_framework.fields import CurrentUserDefault


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id','name', 'call_type', 'other_properties')


class TickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallDetail
        fields = ('id','category', 'other_properties', 'other_properties', 'user',
                  'phone_number', 'status','call_time','comment')

    def create(self, validated_data):
        ticket = super(TickerSerializer, self).create(validated_data)
        ticket.user = self.context['request'].user
        ticket.save()
        return ticket



