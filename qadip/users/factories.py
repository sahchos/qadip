# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import factory
from django.contrib.auth.hashers import make_password

from .models import User


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    @factory.lazy_attribute_sequence
    def email(self, n):
        return '{0}_{1}@example.com'.format('user', n)

    @factory.lazy_attribute_sequence
    def username(self, n):
        return '{0}_{1}'.format('user', n)

    password = make_password('password')
    is_active = True


class AdminFactory(UserFactory):

    @factory.lazy_attribute_sequence
    def email(self, n):
        return u'admin_{0}@example.com'.format(n)

    password = make_password('password')
    is_staff = True
    is_superuser = True
