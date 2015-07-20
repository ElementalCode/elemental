from django import forms
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm

from accounts.models import ElementalUser


class LoginForm(forms.Form):
    email = forms.CharField(label='email')
    password = forms.CharField(label="Password", 
                               widget=forms.PasswordInput)


class SignupForm(UserCreationForm):
    email = forms.CharField(required=True)

    class Meta:
        model = ElementalUser
        fields = ("email", "password1", "password2")

    def save(self, commit=True):
        user = super(SignupForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user