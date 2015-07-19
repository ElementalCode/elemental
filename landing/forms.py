from django import forms
from django.core.exceptions import ValidationError

from accounts.models import ElementalUser


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(label="Password", 
                               widget=forms.PasswordInput)