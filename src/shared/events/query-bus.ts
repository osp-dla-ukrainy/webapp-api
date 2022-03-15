import { injectable } from 'inversify';
import { QueryHandler } from './query-handler';

@injectable()
export class QueryBus {
  constructor(private readonly queryHandlers: Map<string, QueryHandler<any, any>>) {}

  handle<TQuery, TQueryResult>(query: TQuery): Promise<TQueryResult> {
    const queryName = query.constructor.name;
    const queryHandlers = this.queryHandlers.get(query.constructor.name);

    if (!queryHandlers) {
      throw new Error(`QueryHandler does not found for query: ${queryName}`);
    }

    return queryHandlers.execute(query);
  }
}
