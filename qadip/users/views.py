from django.shortcuts import redirect
from django.views.generic import UpdateView
from django.contrib import messages
from braces.views import LoginRequiredMixin

from allauth.account.views import SignupView, PasswordChangeView, PasswordResetView

from .models import User
from .forms import UserSignupForm, UserUpdateForm, UserPasswordResetForm


class UserProfileView(LoginRequiredMixin, UpdateView):
    model = User
    template_name = 'users/user_detail.html'
    form_class = UserUpdateForm

    def get_object(self, queryset=None):
        return User.objects.get(pk=self.request.user.pk)


class UserSignupView(SignupView):
    form_class = UserSignupForm


class UserPasswordChangeView(PasswordChangeView):
    def post(self, request, *args, **kwargs):
        if not self.request.user.check_password(self.request.POST.get("oldpassword")):
            if self.request.POST.get('password1') == self.request.POST.get('password2'):
                messages.success(self.request, 'Password successfully changed.')
                return redirect('password_change')

        return super().post(request, *args, **kwargs)

class UserPasswordResetView(PasswordResetView):
    form_class = UserPasswordResetForm
