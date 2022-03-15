export interface QueryHandler<TQuery, TQueryResult> {
  execute(query: TQuery): Promise<TQueryResult>;
}
