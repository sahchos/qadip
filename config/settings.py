import os

import environ
import sys
import psycopg2.extensions


ROOT_DIR = environ.Path(__file__) - 2  # (/a/myfile.py - 2 = /)
APPS_DIR = ROOT_DIR.path('qadip')

sys.path.append('qadip')

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_SECRET_KEY=(str, os.environ.get('DJANGO_SECRET_KEY')),
    DJANGO_ADMINS=(list, []),
    DJANGO_ALLOWED_HOSTS=(list, os.environ.get('DJANGO_ALLOWED_HOSTS')),
    DJANGO_STATIC_ROOT=(str, str(APPS_DIR('staticfiles'))),
    DJANGO_MEDIA_ROOT=(str, str(APPS_DIR('media'))),
    DATABASE_URL=(str, os.environ.get('DATABASE_URL')),

    DJANGO_DEFAULT_FROM_EMAIL=(str, os.environ.get('DJANGO_DEFAULT_FROM_EMAIL')),
    DJANGO_EMAIL_BACKEND=(str, os.environ.get('DJANGO_EMAIL_BACKEND')),
    DJANGO_EMAIL_HOST=(str, os.environ.get('DJANGO_EMAIL_HOST')),
    DJANGO_EMAIL_HOST_PASSWORD=(str, os.environ.get('DJANGO_EMAIL_HOST_PASSWORD')),
    DJANGO_EMAIL_HOST_USER=(str, os.environ.get('DJANGO_EMAIL_HOST_USER')),
    DJANGO_EMAIL_PORT=(int, os.environ.get('DJANGO_EMAIL_PORT')),
    DJANGO_EMAIL_USE_TLS=(bool, os.environ.get('DJANGO_EMAIL_USE_TLS')),

    DJANGO_SERVER_EMAIL=(str, os.environ.get('DJANGO_SERVER_EMAIL')),
    DJANGO_USE_DEBUG_TOOLBAR=(bool, False),
    DJANGO_USE_DEBUG_SILK=(bool, False),
    DJANGO_TEST_RUN=(bool, False),
)

environ.Env.read_env()

EMAIL_BACKEND = env('DJANGO_EMAIL_BACKEND')
EMAIL_HOST = env('DJANGO_EMAIL_HOST')
EMAIL_HOST_PASSWORD = env('DJANGO_EMAIL_HOST_PASSWORD') or os.environ['DJANGO_EMAIL_HOST']
EMAIL_HOST_USER = env('DJANGO_EMAIL_HOST_USER')
EMAIL_PORT = env('DJANGO_EMAIL_PORT')
EMAIL_USE_TLS = env.bool('DJANGO_EMAIL_USE_TLS')

DEBUG = env.bool("DJANGO_DEBUG")
DJANGO_USE_DEBUG_TOOLBAR = env.bool('DJANGO_USE_DEBUG_TOOLBAR')
DJANGO_USE_DEBUG_SILK = env.bool('DJANGO_USE_DEBUG_SILK')

SECRET_KEY = env('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS')
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ADMINS = tuple([tuple(admins.split(':')) for admins in env.list('DJANGO_ADMINS')])

MANAGERS = ADMINS

TIME_ZONE = 'UTC'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = True

USE_L10N = True

USE_TZ = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
    }
}

import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500, default=env('DATABASE_URL'))
DATABASES['default'].update(db_from_env)

DJANGO_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
)

THIRD_PARTY_APPS = (
    'django_extensions',
    'widget_tweaks',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'crispy_forms',
    'constance',
    'constance.backends.database',
)

LOCAL_APPS = (
    'qadip.users',
)

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

AUTH_USER_MODEL = 'users.User'
ADMIN_URL = r'^admin/'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'
CONSTANCE_CONFIG = {
    'SITE_TITLE': ('DIPLOMA PROJECT', 'Site title'),
    'SITE_LOGO_URL': ('http://aurora-hall.ru/assets/images/afisha/717x311/krovostok-717.jpg', 'Site logo img URL.'),
}

# See: http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = 'bootstrap3'

DEFAULT_FROM_EMAIL = env('DJANGO_DEFAULT_FROM_EMAIL')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            str(APPS_DIR.path('templates')),
        ],
        'OPTIONS': {
            'debug': DEBUG,
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            'context_processors': [
                'constance.context_processors.config',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATIC_URL = '/static/'
STATIC_ROOT = env('DJANGO_STATIC_ROOT')

MEDIA_URL = '/media/'
MEDIA_ROOT = env('DJANGO_MEDIA_ROOT')

STATICFILES_DIRS = (
    str(APPS_DIR.path('static')),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    }
]

# allauth configuration
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False

LOGIN_URL = 'account_login'
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'account_login'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'WARN',
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True
        },
    }
}
