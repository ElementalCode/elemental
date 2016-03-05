# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_elementaluser_about_me'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementaluser',
            name='working_on',
            field=models.TextField(null=True, blank=True),
        ),
    ]
