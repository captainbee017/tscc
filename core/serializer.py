from rest_framework import serializers

from core.models import Category, CallDetail, District
from rest_framework.fields import CurrentUserDefault


class CategorySerializer(serializers.ModelSerializer):
    branch = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id','name', 'call_type', 'other_properties', 'parent', 'branch', 'has_district')

    def get_branch(self, obj):
        qs =  obj.sub_categories.all()
        return CategorySerializer(qs, many=True).data

class SingleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id','name', 'other_properties', 'has_district')


class TickerSerializer(serializers.ModelSerializer):
    category_display = serializers.SerializerMethodField()
    district_display = serializers.SerializerMethodField()
    date_display = serializers.SerializerMethodField()

    class Meta:
        model = CallDetail
        fields = ('id','category', 'other_properties', 'other_properties', 'user',
                  'phone_number', 'status','call_time','comment', 'category_display', 'date_display','district_display', 'district')

    def get_category_display(self, obj):
        return obj.category.name

    def get_district_display(self, obj):
        return obj.district.name if obj.district else ""

    def get_date_display(self, obj):
        return obj.call_time.strftime('%Y-%m-%d %H:%M')

    def create(self, validated_data):
        ticket = super(TickerSerializer, self).create(validated_data)
        ticket.user = self.context['request'].user
        ticket.save()
        return ticket


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ('id', 'name')

class TickerDetailSerializer(serializers.ModelSerializer):
    category = SingleCategorySerializer()
    district = DistrictSerializer()

    class Meta:
        model = CallDetail
        fields = ('id','category', 'other_properties', 'user',
                  'phone_number', 'status','call_time','comment', 'district')




