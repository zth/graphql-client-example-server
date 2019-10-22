# graphql-client-example-server

A simple GraphQL server for powering examples of various GraphQL clients in various languages.

## Running

```
// You can provide the PORT env-variable to control what port the server runs on (default 4000).
yarn start;
```

## Developing

```
yarn && yarn build --watch;

// In a separate terminal
yarn start;
```

## Features to cover

- [x] Node interface (for Relay)
- [x] Globally unique IDs
- [x] Database IDs
- [x] Connection-based pagination
- [x] Limit/offset-based pagination
- [x] Mutations
- [x] Enums
- [ ] Custom scalars
- [ ] Unions
- [ ] Subscriptions

## Misc TODO

- [ ] Tests?
- [ ] Autoexport generated .graphql schema file on commit
