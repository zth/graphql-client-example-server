# Changelog

## master

## 1.4.0

- Bump dependencies
- Move to GraphQL Yoga
- Add @defer/stream support
- Now every DB operation results in a delay, set to 500ms by default
- Paginated and connection resolvers now return AsyncIterable on results and edges.

Kudos to @XiNiHa who did the whole modernization!

## 1.2.0

- Added new simple mutation variants for the todo's, that are more easily usable with Apollo.

## 1.1.3

- Adjust image URL:s for user avatars.

## 1.1.2

- Releases now include `README.md`.

## 1.1.1

- Added root field `userById` to retrieve a `User` by `id`.
