from django.views.generic import UpdateView
from braces.views import LoginRequiredMixin

from .models import User


class UserProfileView(LoginRequiredMixin, UpdateView):
    model = User
    template_name = 'users/user_detail.html'
    fields = ('first_name', 'last_name')

    def get_object(self, queryset=None):
        return User.objects.get(pk=self.request.user.pk)
