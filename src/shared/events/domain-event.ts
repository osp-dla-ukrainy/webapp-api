export abstract class DomainEvent {
  abstract readonly entity: string;
  readonly createdAt: Date = new Date();
}
