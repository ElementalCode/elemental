from django import forms
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm

from accounts.models import ElementalUser


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(label="Password", 
                               widget=forms.PasswordInput)


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = ElementalUser
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(SignupForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user