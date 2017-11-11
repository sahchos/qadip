# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import password_validation
from django.utils.translation import ugettext_lazy as _


class UserPasswordChangeForm(PasswordChangeForm):

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super(UserPasswordChangeForm, self).__init__(user, *args, **kwargs)

    def clean_new_password1(self):
        password1 = self.cleaned_data.get('new_password1')
        password_validation.validate_password(password1, self.user)
        return password1

    def clean_new_password2(self):
        password2 = self.cleaned_data.get('new_password2')
        password_validation.validate_password(password2, self.user)
        return password2

    def clean_old_password(self):
        try:
            super(UserPasswordChangeForm, self).clean_old_password()
        except forms.ValidationError:
            raise forms.ValidationError(_('Current password is incorrect'))

        return self.cleaned_data.get('new_password1')

    def clean(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(_('New and confirm password do not match'))

        return self.cleaned_data
