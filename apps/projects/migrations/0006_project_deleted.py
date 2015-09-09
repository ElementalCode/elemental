# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_auto_20150902_1930'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]
