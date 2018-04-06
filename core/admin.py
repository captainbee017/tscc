from django.contrib import admin

# Register your models here.
from core.models import CallDetail, UserRole, Category

admin.site.register(UserRole)
admin.site.register(CallDetail)
admin.site.register(Category)