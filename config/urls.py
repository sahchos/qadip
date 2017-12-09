from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

from allauth.account.views import login

urlpatterns = [
    url(r'^$', login, name='home'),
    url(settings.ADMIN_URL, include(admin.site.urls)),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^users/', include('qadip.users.urls', namespace='users')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
