from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group as AuthGroup
from django.db import transaction

from .models import ElementalUser

class UserSettingsForm(forms.Form):
    current_password = forms.CharField(max_length=255, widget=forms.PasswordInput)
    email = forms.CharField(max_length=255, required=False)
    password1 = forms.CharField(max_length=255, widget=forms.PasswordInput, required=False)
    password2 = forms.CharField(max_length=255, widget=forms.PasswordInput, required=False)


    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(UserSettingsForm, self).__init__(*args, **kwargs)
        self.fields['email'].initial = self.user.email

    def clean_current_password(self):
        current_password = self.cleaned_data.get('current_password')
        user = authenticate(username=self.user.username, password=current_password)
        if user is None:
            raise forms.ValidationError("Incorrect password!")
        return current_password

    def clean(self):
        cleaned_data = super(UserSettingsForm, self).clean()
        pass1 = cleaned_data.get("password1")
        pass2 = cleaned_data.get("password2")
        if pass1 != pass2 and pass1 != '' and pass2 != '':
            raise forms.ValidationError("Passwords don't match!")