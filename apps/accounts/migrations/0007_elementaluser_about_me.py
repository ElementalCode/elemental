# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_elementaluser_ip'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementaluser',
            name='about_me',
            field=models.TextField(null=True, blank=True),
        ),
    ]
