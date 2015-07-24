# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_remove_project_shared'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='shared',
            field=models.BooleanField(default=False),
        ),
    ]
