from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from django.contrib.auth.models import User


QUERY_TYPE = (
    (1, 'Query'),
    (2, 'Complain'),
)

STATUS_CHOICE = (
    ('Pending', 'Pending'),
    ('Inprogress', 'Inprogress'),
    ('Completed', 'Completed'),
)
USER_ROLES = (
    ('CSR', 'CSR'),
    ('Moderator', 'Moderator'),
    ('Superuser','Superuser'),
)


class UserRole(models.Model):
    """
    CSR; can only write/create forms(both query and complains
    Moderator; can both read/write forms
    Superuser: All permissions
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_role = models.CharField(max_length=20, choices=USER_ROLES, default='CSR')

    def __str__(self):
        return self.user_role


class TypeOption(models.Model):
    name = models.CharField(max_length=50)


class Category(models.Model):
    name = models.CharField(max_length=64)
    call_type = models.SmallIntegerField(choices=QUERY_TYPE, default=1)
    parent = models.ForeignKey("self", related_name="sub_categories", null=True, blank=True, on_delete=models.SET_NULL)
    has_district = models.BooleanField(default=True)
    has_type = models.BooleanField(default=False)
    types = ArrayField(models.IntegerField(), null=True)
    other_properties = JSONField()

    def __str__(self):
        return self.name


    # @property
    # def has_child(self):
    #     import ipdb;
    #     ipdb.set


class District(models.Model):
    name = models.CharField(max_length=50)


class CallDetail(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='call_detail')
    other_properties = JSONField()
    user = models.ForeignKey(User, related_name='call_author', on_delete=models.SET_NULL, null=True)
    phone_number = models.CharField(max_length=30)
    district = models.ForeignKey(District, related_name="calls", on_delete=models.SET_NULL, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICE, default='Pending')
    types = models.ForeignKey(TypeOption, related_name="call_detail", on_delete=models.SET_NULL, null=True, blank=True)
    call_time = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(null=True, blank=True)
    modified_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return "{} {}".format(self.category, self.phone_number)
