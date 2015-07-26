from django.core.urlresolvers import reverse
from django.conf import settings
from django.test import TestCase, override_settings, Client, RequestFactory

from .models import ElementalUser

# Create your tests here.

class AccountTestCases(TestCase):

	@override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
	def setUp(self):
		self.client = Client()

	@override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
	def test_user_registration(self):
		data = {
			'username': 'testguy',
			'password1': 'supersecurepassword',
			'password2': 'supersecurepassword'
		}
		response = self.client.post(reverse('register'), data)
		self.assertEqual(response.status_code, 302)
		try:
			user = ElementalUser.objects.get(username='testguy')
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