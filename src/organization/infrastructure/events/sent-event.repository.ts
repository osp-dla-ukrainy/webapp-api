import { injectable } from 'inversify';
import { SentEvent } from '../../domain/event/sent-event';

@injectable()
export abstract class SentEventRepository {
  abstract findNewest(): Promise<SentEvent | undefined>;
  abstract save(entity: SentEvent): Promise<void>;
}
