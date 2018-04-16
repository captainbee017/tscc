from rest_framework import serializers

from core.models import Category, CallDetail
from rest_framework.fields import CurrentUserDefault


class CategorySerializer(serializers.ModelSerializer):
    branch = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id','name', 'call_type', 'other_properties', 'parent', 'branch', 'has_district')

    def get_branch(self, obj):
        qs =  obj.sub_categories.all()
        return CategorySerializer(qs, many=True).data


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



