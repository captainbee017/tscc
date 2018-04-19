from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import UserRole, District
from core.districts import DISTRICTS


class Command(BaseCommand):

	def handle(self, *args, **kwargs):
		# populate district column
		for district in DISTRICTS:
			District.objects.get_or_create(name=district)


		# create superuser
		user, created = User.objects.get_or_create(username="superuser", is_active=True)
		if not created:
			print("Superuser already exists")
			return
		user.set_password('hellonepal')
		UserRole.objects.get_or_create(user=user, user_role='Superuser')
		print("User Created. Login to explore !!!")
		print("Username: superuser")
		print("Password: hellonepal")