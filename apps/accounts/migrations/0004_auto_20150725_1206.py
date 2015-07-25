# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_elementaluser_can_share_projects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='elementaluser',
            name='username',
            field=models.CharField(unique=True, max_length=20, validators=[django.core.validators.RegexValidator(b'^[a-zA-Z0-9-_]+$', message=b'Only alphanumeric characters are allowed.')]),
        ),
    ]
