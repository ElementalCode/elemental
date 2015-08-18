# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20150725_1206'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementaluser',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]
