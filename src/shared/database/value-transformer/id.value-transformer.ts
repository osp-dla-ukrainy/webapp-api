import { ValueTransformer } from 'typeorm';
import { Id, IdConstructorType } from '../id';

export class IdValueTransformer<TValue> implements ValueTransformer {
  constructor(private readonly IdType: IdConstructorType<TValue>) {}

  to(value: Id<TValue>): TValue {
    return value.valueOf;
  }

  from(value: any): Id<TValue> {
    return new this.IdType(value) as unknown as Id<TValue>;
  }
}
