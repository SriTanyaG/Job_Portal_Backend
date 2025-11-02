
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-key')
DEBUG = config('DEBUG', default=False, cast=bool)

# ALLOWED_HOSTS for production - set via environment variable or use default
allowed_hosts_str = config('ALLOWED_HOSTS', default='localhost,127.0.0.1')
ALLOWED_HOSTS = []

# Parse and clean up ALLOWED_HOSTS - remove protocols, paths, and trailing slashes
for host in allowed_hosts_str.split(','):
    host = host.strip()
    if not host:
        continue
    
    # Remove protocol (http:// or https://)
    if '://' in host:
        host = host.split('://', 1)[1]
    
    # Remove paths and query strings (everything after first / or ?)
    host = host.split('/')[0].split('?')[0]
    
    # Remove trailing slashes
    host = host.rstrip('/')
    
    if host and host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(host)

# For Render: automatically add Render hostname if available
# Render sets RENDER_EXTERNAL_HOSTNAME environment variable
import os
render_hostname = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if render_hostname:
    # Clean up render hostname (remove protocol if present)
    if '://' in render_hostname:
        render_hostname = render_hostname.split('://', 1)[1].split('/')[0]
    if render_hostname and render_hostname not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(render_hostname)

# Clean up duplicates and empty strings
ALLOWED_HOSTS = list(set([h for h in ALLOWED_HOSTS if h]))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'drf_yasg',
    'users',
    'jobs',
    'applications',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]

WSGI_APPLICATION = 'config.wsgi.application'

# Supabase Configuration - Simple setup
# Get values directly from .env file
SUPABASE_USER = config('SUPABASE_USER', default='')
SUPABASE_HOST = config('SUPABASE_HOST', default='')
SUPABASE_PORT = config('SUPABASE_PORT', default='5432')
SUPABASE_USE_SSL = config('SUPABASE_USE_SSL', default=True, cast=bool)
SUPABASE_DB = config('SUPABASE_DB', default='')
SUPABASE_PASSWORD = config('SUPABASE_PASSWORD', default='')

# Database Configuration - Use Supabase PostgreSQL if credentials are provided
if SUPABASE_HOST and SUPABASE_DB and SUPABASE_USER and SUPABASE_PASSWORD:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': SUPABASE_DB,
            'USER': SUPABASE_USER,
            'PASSWORD': SUPABASE_PASSWORD,
            'HOST': SUPABASE_HOST,
            'PORT': SUPABASE_PORT,
            'OPTIONS': {
                'sslmode': 'require' if SUPABASE_USE_SSL else 'disable',
            },
        }
    }
else:
    # Fallback to SQLite for local development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / "db.sqlite3",
        }
    }


AUTH_PASSWORD_VALIDATORS = [{
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
}, {
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
}]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files - Not needed since resumes are stored in database rows as BinaryField
# Keep minimal media settings for any other future file uploads
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Allow public read access, individual views control write access
    ],
}



# CORS Configuration for production
CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=False, cast=bool)
cors_allowed_origins_raw = config('CORS_ALLOWED_ORIGINS', default='')

# Clean up CORS origins - remove trailing slashes and paths, only keep protocol + domain
CORS_ALLOWED_ORIGINS = []
if cors_allowed_origins_raw:
    for origin in cors_allowed_origins_raw.split(','):
        origin = origin.strip()
        # Remove trailing slash and any path
        origin = origin.rstrip('/')
        # Extract just protocol + domain (remove any path)
        if '://' in origin:
            protocol, rest = origin.split('://', 1)
            # Take only the domain part (before first /)
            domain = rest.split('/')[0]
            origin = f"{protocol}://{domain}"
        if origin and origin not in CORS_ALLOWED_ORIGINS:
            CORS_ALLOWED_ORIGINS.append(origin)

# If CORS_ALLOW_ALL_ORIGINS is False but CORS_ALLOWED_ORIGINS is empty, allow all (for local dev)
if not CORS_ALLOW_ALL_ORIGINS and not CORS_ALLOWED_ORIGINS:
    CORS_ALLOW_ALL_ORIGINS = True

# Logging Configuration
import logging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
