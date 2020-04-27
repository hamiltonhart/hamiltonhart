---
path: "/django-react-heroku"
title: "Deploy A Django / React Project on Heroku"
summary: "How to setup a Django / React project for deployment on Heroku."
date: "2020-04-25"
tags:
  [
    "react",
    "graphql",
    "javascript",
    "django",
    "python",
    "deployment",
    "code",
    "notes",
  ]
---

Primary Source:
[Deploy Django and React on Heroku](https://librenepal.com/article/django-and-create-react-app-together-on-heroku/)

## Django Setup

### **Initial Django Installs**

1. Create a virtual environment, install Django and create a new project.

2. Install gunicorn and whitenoise

```bash
pipenv install gunicorn whitenoise
```

3. Save a requirements file.

   Of course, this should be run after installing any new pip package

```bash
pipenv lock -r > requirements.txt
```

### **Settings.py File**

4. Set `ALLOWED_HOSTS`

```python
ALLOWED_HOSTS = ['*']

# or (and much preferred outside of development)

ALLOWED_HOSTS = ['127.0.0.1', 'yoururl.com', 'other-necessary-urls']
```

5. Add WhiteNoise middleware

```python
MIDDLEWARE = [
   'django.middleware.security.SecurityMiddleware',
   'whitenoise.middleware.WhiteNoiseMiddleware',
   ....other middlewares....
   ]
```

6. Set static files

```python
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

REACT_APP_DIR = os.path.join(BASE_DIR, 'frontend')

STATICFILES_DIRS = [
   os.path.join(REACT_APP_DIR, 'build', 'static'),
]
```

Using these settings allows us to maintain some organization by having the React App in the 'frontend' folder

### **Procfile**

7. Create a Procfile (for Heroku) and include the following (be sure to substitute the name of your project)

```
release: python manage.py migrate
web: gunicorn project_folder_name.wsgi
```

Including the release `release` process type will run the command following it when pushing changes to the dyno

## Staticfiles Setup

8. Create a `staticfiles` folder as Heroku does not always create one.

```bash
mkdir staticfiles && touch staticfiles/.gitkeep
```

The `.gitkeep` file is because git will not track empty directories and therefore would not track staticfiles otherwise.

### **Git**

**Sensitive information should be set to environment variables before making a `commit` to ensure it stays out of VCS**

9. Create a .gitignore file and include the following

```
*.log
*.pot
*.pyc
.env
.env.staging
__pycache__/
local_settings.py
*.sqlite3
media

# don't track virtualenv, ever!

venv/

# don't track node_modules because we'll be using yarn install and it will create this

node_modules

# On our project configuration, the output of the collectstatic will be stored in
# staticfiles directory. We are ignoring files inside staticfiles but we'll track this # folder itself so that collectstatic can work on Heroku

staticfiles/*
```

10. Create a git repo, add all files and make the first commit

```bash
git init
git add --all
git commit -m "Initial Commit"
```

## React Setup

1. Within the base directory, create a new react project called frontend

```bash
npx create-react-app frontend
```

2. Add the newly added content to git

```bash
git add .
git commit -m "Add React"
```

3. In the `frontend/package.json` file, add the following

```json
"proxy": "http://localhost:8000"
```

This is for proxying requests during the development

## Serving React From Django

1. In the Django Project Directory, create a views.py file

```bash
cd project_directory
touch views.py
```

2. In the newly created views.py file, add the following:

```python

import os
import logging
from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings

class FrontendAppView(View):
   """
   Serves the compiled frontend entry point (only works if you have run `yarn
   build`).
   """
   index_file_path = os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')

   def get(self, request):
      try:
            with open(self.index_file_path) as f:
               return HttpResponse(f.read())
      except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
               """
               This URL is only used when you have built the production
               version of the app. Visit http://localhost:3000/ instead after
               running `yarn start` on the frontend/ directory
               """,
               status=501,
            )

```

3. Create a url pattern to serve this view

```python
from django.contrib import admin
from django.urls import path, include, re_path
from .views import FrontendAppView

urlpatterns = [
   path('admin/', admin.site.urls),
   .... other urlpatterns.....
   # have it as the last urlpattern for BrowserHistory urls to work
   re_path(r'^', FrontendAppView.as_view()),
]
```

## Heroku Deployment

1. Create a `package.json` file in the root directory

```bash
touch package.json
```

2. Add the following to the newly created json file (change `project_name` and `author`)

```json
{
  "name": "project_name",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "",
  "author": "Your Name",
  "license": "MIT",
  "private": true,
  "scripts": {
    "heroku-prebuild": "NODE_ENV=production cd frontend/ && yarn install && yarn build && cd .."
  },
  "cacheDirectories": ["frontend/node_modules"]
}
```

3. Create an empty `yarn.lock` file so heroku will make `yarn` available

```bash
touch yarn.lock
```

4. Deploy to Heroku

```bash
heroku apps:create -a herokuprojectname
heroku buildpacks:set heroku/python
heroku buildpacks:add --index 1 heroku/nodejs

git push heroku master
```

This creates a new Heroku project (which also adds heroku as a git remote).

Set python and node as Heroku buildpacks. Nodejs will be set as the first so that it is complete when the Python buildpack runs `collectstatic`

5. Open the heroku page

```bash
heroku open
```
