from django.core.urlresolvers import reverse
from django.conf import settings
from django.test import TestCase, override_settings, Client, RequestFactory

# Create your tests here.

class LandingTestCases(TestCase):

	@override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
	def setUp(self):
		self.client = Client()