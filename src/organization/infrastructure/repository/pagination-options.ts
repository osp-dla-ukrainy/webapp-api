export class PaginationOptions {
  readonly offset: number;
  readonly limit: number;

  constructor({ limit = 10, page = 0 }: { page: number; limit: number }) {
    this.limit = limit;
    this.offset = page <= 0 ? 0 : page * limit - limit;
  }
}
