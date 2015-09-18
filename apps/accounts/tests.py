from django.core.urlresolvers import reverse
from django.conf import settings
from django.test import TestCase, override_settings, Client, RequestFactory

from .models import ElementalUser

class AccountTestCases(TestCase):

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def setUp(self):
        self.client = Client()

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_registration(self):
        data = {
            'username': 'testguy2',
            'password1': 'supersecurepassword',
            'password2': 'supersecurepassword'
        }
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 302)
        try:
            user = ElementalUser.objects.get(username='testguy2')
        except:
            user = None
        self.assertIsNotNone(user)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_registration_failures(self):
        data = {
            'username': 'testguy2',
            'password1': 'supersecurepassword',
            'password2': 'supersecurepssword'
        }
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 200)
        try:
            user = ElementalUser.objects.get(username='testguy2')
        except:
            user = None
        self.assertIsNone(user)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_change_password(self):
        u = ElementalUser(
            username='testguy3',
            password='supersecurepassword'
        )
        u.save()
        self.client.login(username='testguy3', password='supersecurepassword')

        data = {
            'current_password': 'supersecurepassword',
            'password1': 'insecurepassword',
            'password2': 'insecurepassword'
        }
        response = self.client.post(reverse('user-settings'), data)
        self.assertEqual(response.status_code, 302)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_change_password_fail(self):
        u = ElementalUser(
            username='testguy3',
            password='supersecurepassword'
        )
        u.save()
        self.client.login(username='testguy3', password='supersecurepassword')

        data = {
            'current_password': 'supersecurepassword',
            'password1': 'insecurepassword',
            'password2': 'insecurepassworddiff'
        }
        response = self.client.post(reverse('user-settings'), data)
        self.assertEqual(response.status_code, 200)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_change_email(self):
        u = ElementalUser(
            username='testguy3',
            password='supersecurepassword'
        )
        u.save()
        self.client.login(username='testguy3', password='supersecurepassword')

        data = {
            'current_password': 'supersecurepassword',
            'email': 'z@a.com'
        }
        response = self.client.post(reverse('user-settings'), data)
        self.assertEqual(response.status_code, 302)
        try:
            user = ElementalUser.objects.get(email='z@a.com')
        except:
            user = None
        self.assertIsNotNone(user)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_user_change_email_fail(self):
        u = ElementalUser(
            username='testguy3',
            password='supersecurepassword'
        )
        u.save()
        self.client.login(username='testguy3', password='supersecurepassword')

        data = {
            'current_password': 'supersecurepasswordoops',
            'email': 'z@a.com'
        }
        response = self.client.post(reverse('user-settings'), data)
        self.assertEqual(response.status_code, 200)
        try:
            user = ElementalUser.objects.get(email='z@a.com')
        except:
            user = None
        self.assertIsNone(user)