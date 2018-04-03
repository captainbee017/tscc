from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

QUERY_TYPE = (
    ('Query', 'Query'),
    ('Complain', 'Complain'),
)

STATUS_CHOICE = (
    ('Pending', 'Pending'),
    ('Inprogress', 'Inprogress'),
    ('Completed', 'Completed'),
)

USER_ROLES = (
    ('Typist', 'Typist'),
    ('Editor', 'Editor'),
    ('Superuser','Superuser'),
)


class CallDetail(models.Model):
    query_type = models.CharField(max_length=20, choices=QUERY_TYPE, default='Query')
    call_time = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICE, default='Pending')
    author = models.ForeignKey(User, related_name='call_author')

    def __str__(self):
        return self.query_type


class User(AbstractUser):
    """
    Typist; can only write/create forms(both query and complains
    Editor; can both read/write forms
    Superuser: All permissions
    """
    user_role = models.CharField(max_length=20, choices=USER_ROLES, default='Editor')