from django.core.management.base import BaseCommand, CommandError
from core.models import District

districts = [
    "Jhapa",
    "Ilam"
    "Pachthar"
    "Taplejung"
    ]

class Command(BaseCommand):
    help = 'Create Districts'


    def handle(self, *args, **options):
        for d in districts:
            try:
                obj, _created = District.objects.get_or_create(name=d)
            except Exception:
                raise CommandError('Errot')

            self.stdout.write(self.style.SUCCESS('Successfully created'))