# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-12 10:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bills',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=200)),
                ('due_date', models.DateTimeField()),
                ('amount', models.FloatField()),
            ],
        ),
    ]
