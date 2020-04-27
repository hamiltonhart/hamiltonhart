---
path: "/react-graphql-frontend-basic"
title: "React / GraphQL Frontend Setup"
summary: "A very basic setup of GraphQL with React for frontend consumption."
date: "2020-04-25"
tags: ["react", "graphql", "javascript", "code", "notes"]
---

Details the initial setup for using React to consume a GraphQL API using Apollo. The `uri` indicated in step 2 is assuming the default development port for Django and can be changed as needed.

### Installs

1. Install the following

```bash
yarn add apollo-boost @apollo/react-hooks graphql
```

### Base index.js

All of the following changes should be made within the base index.js file

2. The following can be copied and pasted into the index.js file

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { gql } from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();

const uri = "http://localhost:8000/graphql/";

export const client = new ApolloClient({
  cache,
  uri,
  fetchOptions: {
    credentials: "include",
  },
  request: operation => {
    const token = localStorage.getItem("authToken") || "";
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  },
  clientState: {
    defaults: {
      isLoggedIn: !!localStorage.getItem("authToken"),
    },
  },
});

export const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

#### Really, that's about it for immediate setup. It's nice and quick but should get you up and running with Apollo and include JWT handling for authentication.

The IS_LOGGED_IN query can be used to determine if the user is logged in or not.
