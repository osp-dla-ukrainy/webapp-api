import { v4 } from 'uuid';
import { Id } from '../../../shared/database/id';

export class OrganizationId implements Id {
  static create() {
    return new OrganizationId(v4());
  }

  constructor(private readonly _id: string) {}

  get id(): string {
    return this._id;
  }
}
