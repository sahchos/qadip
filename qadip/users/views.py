from django.views.generic import UpdateView
from braces.views import LoginRequiredMixin

from allauth.account.views import SignupView

from .models import User
from .forms import UserSignupForm, UserUpdateForm


class UserProfileView(LoginRequiredMixin, UpdateView):
    model = User
    template_name = 'users/user_detail.html'
    form_class = UserUpdateForm

    def get_object(self, queryset=None):
        return User.objects.get(pk=self.request.user.pk)


class UserSignupView(SignupView):
    form_class = UserSignupForm
