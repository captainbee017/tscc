from django.db import models
from django.contrib.auth.models import User


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
        return self.user.first_name



class CallDetail(models.Model):
    call_type = models.CharField(max_length=20, choices=QUERY_TYPE, default='Query')
    status = models.CharField(max_length=30, choices=STATUS_CHOICE, default='Pending')
    submitted_by = models.ForeignKey(User, related_name='call_author', on_delete=models.SET_NULL, null=True)
    call_time = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=20, blank=True, null=True)


    def __str__(self):
        return self.query_type
