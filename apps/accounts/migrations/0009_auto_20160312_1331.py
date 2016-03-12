# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_elementaluser_working_on'),
    ]

    operations = [
        migrations.RenameField(
            model_name='elementaluser',
            old_name='can_share_projects',
            new_name='trusted',
        ),
    ]
