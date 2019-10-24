export let paginate = <T>(offset: number, limit: number, array: T[]) =>
  array.slice(offset, offset + limit);
