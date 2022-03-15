import { v4 } from 'uuid';
import { Id } from '../../../shared/database/id';

export class ParticipantId implements Id {
  static create() {
    return new ParticipantId(v4());
  }

  constructor(private readonly _id: string) {}

  get valueOf(): string {
    return this._id;
  }

  toString(): string | number {
    return this.valueOf;
  }
}
