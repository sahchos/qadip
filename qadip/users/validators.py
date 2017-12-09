from django.core.exceptions import ValidationError
from django.utils.translation import ungettext

class MaxLengthValidator(object):
    """
    Validate whether the password is of a max length.
    """
    def __init__(self, max_length=8):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                ungettext(
                    "This password is too long. It must contain < %(max_length)d character.",
                    "This password is too long. It must contain < %(max_length)d characters.",
                    self.max_length
                ),
                code='password_too_short',
                params={'max_length': self.max_length},
            )

    def get_help_text(self):
        return ungettext(
            "Your password must contain < %(max_length)d character.",
            "Your password must contain < %(max_length)d characters.",
            self.max_length
        ) % {'max_length': self.max_length}
