# graphql-client-example-server

A simple GraphQL server for powering examples of various GraphQL clients in various languages.

## Installation

You can install and run the server without needing to clone this repo by doing:

```
npm install -g graphql-client-example-server
```

...and then simply running with `graphql-client-example-server`.

You can also provide a `PORT` environment variable to control what port the server will run on (default `4000`).

## Developing

### Running

```
yarn start
```

### Building

```
yarn && yarn build --watch

// In a separate terminal
yarn start
```

## Features to cover

- [x] Node interface (for Relay)
- [x] Globally unique IDs
- [x] Database IDs
- [x] Connection-based pagination
- [x] Limit/offset-based pagination
- [x] Mutations
- [x] Enums
- [x] Custom scalars
- [x] Unions
- [x] Subscriptions
- [x] Defer/stream
- [x] Artifical delay's to emphasize defer/stream
