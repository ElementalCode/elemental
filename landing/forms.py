from django import forms
from django.core.exceptions import ValidationError

from accounts.models import ElementalUser


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(label="Password", 
                               widget=forms.PasswordInput)


class SignupForm(forms.ModelForm):
    password = forms.CharField(label="Password",
                               widget=forms.PasswordInput)

    class Meta:
        model = ElementalUser
        fields = ['email', 'password', ]

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)

        for key in self.fields:
            self.fields[key].required = True

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise ValidationError('Password is too short')
        return password

    def save(self):
        with transaction.atomic():
            obj = super(SignUpForm, self).save(commit=False)
            obj.save()
            return obj
        return None