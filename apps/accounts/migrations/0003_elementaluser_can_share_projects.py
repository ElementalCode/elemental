# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_elementaluser_banned'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementaluser',
            name='can_share_projects',
            field=models.BooleanField(default=False),
        ),
    ]
