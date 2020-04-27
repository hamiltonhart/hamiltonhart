---
path: "/django-psql"
title: "Django and PostGresQL"
summary: "How to setup Django with PostGresQL"
date: "2020-04-25"
tags: ["python", "django", "postgres", "code", "notes"]
---

1. Install psycopg2 and dj-database-url

   ```bash
   pipenv install psycopg2 dj-database-url
   ```

   Psycopg is a PostGresQL adapter for Python. If it is used in development `psycopg2-binary` should be used. I have had error occur otherwise and can be frustrating to troubleshoot.

2. Import `dj_database_url` into `settings.py`

   ```python
   # settings.py

   import dj_database_url
   ```

3. Update DATABASES in `settings.py` to use PostGresQL

   ```python

   # Without using environment variables

   DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'SomeName',
        'USER': 'SomeUsername',
        'PASSWORD': 'SomePassword,
        'HOST': 'localhost',
        'PORT': '5432',
        }
    }

    # Using environment variables (highly suggested)

    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env.str('DB_NAME'),
        'USER': env.str('DB_USER'),
        'PASSWORD': env.str('DB_PASS')
        'HOST': 'localhost',
        'PORT': '5432',
        }
    }
   ```

4. Optional: It may be useful to use a conditional in the `settings.py` if using SQLite for development and something else for production.
   ```python
    if DEBUG:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': 'mydatabase.sqlite3',
            }
        }
    else:
        try:
            env.str('DB_NAME')
            env.str('DB_USER')
            env.str('DB_PASS')
            db_from_env = dj_database_url.config()
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.postgresql_psycopg2',
                    'NAME': env.str('DB_NAME'),
                    'USER': env.str('DB_USER'),
                    'PASSWORD': env.str('DB_PASS'),
                    'HOST': 'localhost',
                    'PORT': '5432',
                }
            }
            DATABASES['default'].update(db_from_env)
        except:
            print("Provide PSQL environment variables in .env")
   ```
