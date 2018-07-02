from django import forms
from django.http import HttpResponseRedirect
from django.urls import reverse
from allauth.account.adapter import DefaultAccountAdapter


class MyAccountAdapter(DefaultAccountAdapter):


	def respond_user_inactive(self, request, user):
		if not request.user.is_active:
			return HttpResponseRedirect(reverse('login_page'))
		return super().respond_user_inactive(request, user)
