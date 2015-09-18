from django.core.urlresolvers import reverse
from django.conf import settings
from django.test import TestCase, override_settings, Client, RequestFactory

from apps.accounts.models import ElementalUser
from .models import Project

class ProjectTestCases(TestCase):
    fixtures = ['account_test_data.json', 'project_test_data.json']

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def setUp(self):
        self.client = Client()

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_create_project(self):
        u = ElementalUser(password='password',
                          username='username',
                          can_share_projects=True)
        u.save()
        self.client.login(username='username', password='password')
        data = {
            'data': 'fake_testing_data_create',
            'name': 'my_project'
        }
        response = self.client.post(reverse('api:project-create'), data)
        self.assertEqual(response.status_code, 201)
        try:
            project = Project.objects.get(data='fake_testing_data_create')
        except:
            project = None
        self.assertIsNotNone(project)

    @override_settings(AUTH_USER_MODEL=settings.AUTH_USER_MODEL)
    def test_create_project_fail(self):
        u = ElementalUser(password='password',
                          username='username')
        u.save()
        self.client.login(username='username', password='password')
        data = {
            'data': 'fake_testing_data_create_fail',
            'name': 'my_project'
        }
        response = self.client.post(reverse('api:project-create'), data)
        self.assertEqual(response.status_code, 403)
        try:
            project = Project.objects.get(data='fake_testing_data_create_fail')
        except:
            project = None
        self.assertIsNone(project)