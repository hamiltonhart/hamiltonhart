---
path: "/django-graphql-setup"
title: "Django / GraphQL Setup"
summary: "Details a basic setup of creating a GraphQL API with a Django backend using Graphene Django."
date: "2020-04-25"
tags: ["python", "django", "graphql", "code", "notes"]
---

Assumes using Pipenv to manage virtual environments.

### Installs

1. Install Graphene-Django, django-cors-headers, django-graphql-jwt

```bash
pipenv install graphene-django django-cors-headers django-graphql-jwt
```

### Settings.py

Many changes need to be made to the settings.py file.

Helpful link:

[django-cors-headers](https://pypi.org/project/django-cors-headers/)

2. Add corsheaders to the top of the INSTALLED_APPS list and to the top of the MIDDLEWARE list

```python
INSTALLED_APPS = [
    'corsheaders',
    ...

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

3. Setup Graphene schema and middleware

```python
# This can be added below MIDDLEWARE

GRAPHENE = {
    'SCHEMA': 'project_folder.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}
```

4. Setup CORS whitelisting. This can be done globally or for specific URLs. Specific URLs is more secure.

```python
# Can be put below GRAPHENE from step 3.

# Setting this to True allows all URLs to make requests. Defaults to False
CORS_ORIGIN_ALLOW_ALL = True

# This is where you specify URLs
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000", "http://www.yoururl.com"
]
```

5. Setup Authentication Backends

```python
# Can be put below CORS_ORIGIN_WHITELIST from step 4.

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]
```

### Setup URLS

6. This will allow you to point to this url with your frontend to access the GraphQL API. By settings graphiql to True, there will be a graphical representation of the API at the url. In the base urls.py file, add the following.

```python
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    ...
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
```

### Schema Files

7. Setup the base schema.py file in your project folder (the one with the settings.py file). Create the file (schema.py) and add the following.

```python
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType

# import app schemas
import myapp.schema

# Add each schema for each app to the Query class and Mutation class respectively
class Query(
    myapp.schema.Query,
    graphene.ObjectType
):
    pass


class Mutation(
    myapp.schema.Mutation,
    graphene.ObjectType
):
    # These are part of django-graphql-jwt and allow for authentication
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

```

8. Create a schema.py file for each app within the app folder. The following is an example of how to structure a schema.py file.

```python
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from graphql_jwt.decorators import login_required

# Import your model(s)
# Note that this example uses a model called TodoList. Be sure to change this throughout the example
from .models import TodoList

# Queries


class TodoListType(DjangoObjectType):
    class Meta:
        model = TodoList


class Query(graphene.ObjectType):
    todo_lists = graphene.List(TodoListType)
    todo_list = graphene.Field(TodoListType, id=graphene.Int(required=True))

    def resolve_todo_lists(self, info):
        return TodoList.objects.all()

    def resolve_todo_list(self, info, id):
        try:
            return TodoList.objects.get(id=id)
        except:
            return GraphQLError("A valid TodoList ID was not provided.")

# Mutations


class CreateTodoList(graphene.Mutation):
    todo_list = graphene.Field(TodoListType)

    class Arguments:
        title = graphene.String(required=True)

    # The @login_required decorator does just what it says, requires a user to be logged in before they can execute the mutation. Can also be added to Queries if desired.
    @login_required
    def mutate(self, info, title):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError("Login to create a Todo List.")
        todo_list = TodoList(title=title, created_by=user)
        todo_list.save()
        return CreateTodoList(todo_list=todo_list)


class UpdateTodoList(graphene.Mutation):
    todo_list = graphene.Field(TodoListType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)

    @login_required
    def mutate(self, info, id, title):
        try:
            todo_list = TodoList.objects.get(id=id)
        except:
            raise GraphQLError("A valid Todo List ID was not provided.")

        todo_list.title = title

        todo_list.save()
        return UpdateTodoList(todo_list=todo_list)


class DeleteTodoList(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            todo_list = TodoList.objects.get(id=id)
        except:
            raise GraphQLError("A valid Todo List ID was not provided.")

        todo_list.delete()
        return DeleteTodoList(id=id)


class Mutation(graphene.ObjectType):
    create_todo_list = CreateTodoList.Field()
    update_todo_list = UpdateTodoList.Field()
    delete_todo_list = DeleteTodoList.Field()
```
