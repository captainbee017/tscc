from rest_framework import serializers

from core.models import Category, CallDetail, District, TypeOption
from rest_framework.fields import CurrentUserDefault


class TypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TypeOption
        fields = ('id', 'name')


class CategorySerializer(serializers.ModelSerializer):
    branch = serializers.SerializerMethodField()
    # types = TypeSerializer()

    class Meta:
        model = Category
        fields = ('id','name', 'call_type', 'other_properties', 'parent', 'branch', 'has_district', 'has_type', 'types',)

    def get_branch(self, obj):
        qs =  obj.sub_categories.all()
        return CategorySerializer(qs, many=True).data


class MainCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('id','name')



class SingleCategorySerializer(serializers.ModelSerializer):
    type_options = serializers.SerializerMethodField()

    def get_type_options(self, obj):
        types = TypeOption.objects.filter(pk__in=obj.types)

        return TypeSerializer(types, many=True).data

    class Meta:
        model = Category
        fields = ('id','name', 'other_properties', 'has_district', 'has_type', 'type_options', 'types')


class TickerSerializer(serializers.ModelSerializer):
    category_display = serializers.SerializerMethodField()
    district_display = serializers.SerializerMethodField()
    type_display = serializers.SerializerMethodField()
    date_display = serializers.SerializerMethodField()

    class Meta:
        model = CallDetail
        fields = ('id','category', 'other_properties', 'other_properties', 'user',
                  'phone_number', 'status','call_time','comment', 'category_display', 'date_display',
                  'district_display','type_display', 'district', 'types')

    def get_category_display(self, obj):
        return obj.category.name

    def get_district_display(self, obj):
        return obj.district.name if obj.district else ""

    def get_type_display(self, obj):
        return obj.types.name if obj.types else ""

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
                  'phone_number', 'status','call_time','comment', 'district','types')




