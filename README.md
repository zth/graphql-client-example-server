# graphql-client-example-server

A simple GraphQL server for powering examples of various GraphQL clients in various languages.

## Running

```
// You can provide the PORT env-variable to control what port the server runs on (default 4000).
yarn start;
```

## Developing

```
yarn && yarn build:watch;

// In a separate terminal
yarn start;
```

## Features to cover

- [x] Node interface (for Relay)
- [x] Connection-based pagination
- [ ] Limit/offset-based pagination
- [x] Mutations
- [x] Enums
- [ ] Unions
- [ ] Subscriptions
