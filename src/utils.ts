import { PaginatedList } from "./types";

export let paginate = <T>(
  offset: number,
  limit: number,
  array: T[]
): PaginatedList<T> => ({
  results: array.slice(offset, offset + limit),
  hasNextPage: offset + limit < array.length,
  total: array.length
});
