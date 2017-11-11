# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import AbstractUser
from django.core.urlresolvers import reverse



class User(AbstractUser):
    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return reverse('users:profile')

    @property
    def fullname(self):
        if self.first_name or self.last_name:
            return ('{} {}'.format(self.first_name, self.last_name)).strip()
        else:
            return self.username
