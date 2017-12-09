from django.views.generic import UpdateView
from braces.views import LoginRequiredMixin

from allauth.account.views import PasswordResetView

from .models import User


class UserProfileView(LoginRequiredMixin, UpdateView):
    model = User
    template_name = 'users/user_detail.html'
    fields = ('first_name', 'last_name')

    def get_object(self, queryset=None):
        return User.objects.get(pk=self.request.user.pk)

    def form_valid(self, form):
        data = form.cleaned_data
        # 500
        if any(data.get(f) == '' for f in self.fields):
            return None

        return super().form_valid(form)


class UserPasswordResetView(PasswordResetView):

    def post(self, request, *args, **kwargs):
        # 500
        if request.POST.get('email') == '':
            return None

        return super().post(request, *args, **kwargs)
