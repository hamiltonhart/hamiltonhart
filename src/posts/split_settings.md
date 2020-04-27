---
path: "/split-django-settings"
title: "Django Split Settings"
summary: "A quick overview of one way to handle the settings.py file between production and development."
date: "2020-04-25"
tags: ["python", "django", "code", "notes"]
---

This uses a library called django-environ. The basic thought process is that by storing sensitive information in environment variables ( a .env file) can keeping them out of a VCS, deployment and security can be more easily be maintained.

[Django-Environ Docs](https://django-environ.readthedocs.io/en/latest/)

In a basic situation, there would be a development and a production environment. The basic setup is detailed below using pipenv to handle virtual environments (note that this assumes Django is already installed and a project has been started):

1. Install django-environ

   ```bash
   pipenv install django-environ
   ```

2. Create a .env file in the project folder (the same folder as the settings.py file)
3. Add the .env file to the .gitignore so it stays out of VCS
4. Set necessary environment variables in the .env file (note that a space after the = may or may not be needed)
   ```bash
   DEBUG=True
   SECRET_KEY= generated_secret_key
   DB_URL=sqlite:///my-local-sqlite.db
   PSQL_URL=psql://urser:un-githubbedpassword@127.0.0.1:8458/database
   ```
   The above shows a DB_URL and a PSQL_URL. This is just to show how the two would be formatted for SQLite and PostGresQL. The django-environ docs have more examples.

5) Setup settings.py file

   ```python3
    import environ

    env = environ.Env()
    environ.Env.read_env()

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    SECRET_KEY = env.str('SECRET_KEY')

    DEBUG = env.bool('DEBUG', default=False)

    DATABASES = {
    'default': env.db('DB_URL')
    }
   ```

   Note how str and bool are explicitely called. Some documentation includes it, sometimes it does not. I'm finding that if it is not, it may not be represented the correct way.

   Add any other settings that need to be kept secret or that would change between development and production.
