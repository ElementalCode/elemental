# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_elementaluser_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementaluser',
            name='ip',
            field=models.GenericIPAddressField(null=True, blank=True),
        ),
    ]
