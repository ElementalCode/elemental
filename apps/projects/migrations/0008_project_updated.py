# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_project_thumbnail'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='updated',
            field=models.DateTimeField(default=datetime.datetime(2016, 3, 4, 13, 43, 39, 736000), auto_now=True),
            preserve_default=False,
        ),
    ]
