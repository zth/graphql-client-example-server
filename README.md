# graphql-client-example-server

A simple GraphQL server for powering examples of various GraphQL clients in various languages.

## Installation

You can install and run the server without needing to clone this repo by doing:

```
npm install -g graphql-client-example-server
```

...and then simply running with `graphql-client-example-server`.

## Developing

### Running

```
// You can provide the PORT env-variable to control what port the server runs on (default 4000).
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

## Misc TODO

- [ ] Tests?
- [x] Autoexport generated .graphql schema file on commit
- [x] Package and publish runnable artifact to NPM (https://github.com/zeit/ncc ?)
