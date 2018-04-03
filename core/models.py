from django.db import models

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


class CallDetail(models.Model):
    query_type = models.CharField(max_length=20, choices=QUERY_TYPE, default='Query')
    call_time = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICE, default='Pending')

    def __str__(self):
        return self.query_type