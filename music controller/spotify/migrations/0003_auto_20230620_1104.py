# Generated by Django 3.0.7 on 2023-06-20 05:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_room_current_song'),
        ('spotify', '0002_vote'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Vote',
            new_name='Votes',
        ),
    ]