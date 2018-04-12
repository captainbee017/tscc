from allauth.account.forms import SignupForm
from django import forms
from django.contrib.auth.models import User

from core.models import USER_ROLES, UserRole


class UserSignupForm(SignupForm):
    user_role = forms.ChoiceField(choices=USER_ROLES, required=True, widget=forms.Select())

    def save(self):
        user, created = User.objects.get_or_create(
            username=self.cleaned_data['username'])
        user.set_password(self.cleaned_data['password1'])
        user.save()
        # set user role
        UserRole.objects.get_or_create(user=user, defaults={'user_role': self.cleaned_data['user_role']})
        return


class SUPasswordChangeForm(forms.Form):
    new_password1 = forms.CharField(widget=forms.PasswordInput(), label='Password')
    new_password2 = forms.CharField(widget=forms.PasswordInput(), label='Confirm Password')

    def clean_new_password2(self):
        if not self.cleaned_data['new_password1'] != self.cleaned_data['new_password2']:
            raise forms.ValidationError('Password doesnt match. Please try again.')
        return self.cleaned_data['new_password2']

    def save(self):
        self.user.set_password(self.cleaned_data['password'])
        return
