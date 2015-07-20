from django import forms
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm

from accounts.models import ElementalUser


class LoginForm(forms.Form):
    username = forms.CharField(label='Username')
    password = forms.CharField(label="Password", 
                               widget=forms.PasswordInput)


class SignupForm(UserCreationForm):
    username = forms.CharField(required=True)

    class Meta:
        model = ElementalUser
        fields = ("username", "password1", "password2")

    def save(self, commit=True):
        user = super(SignupForm, self).save(commit=False)
        user.username = self.cleaned_data["username"]
        if commit:
            user.save()
        return user