export abstract class DomainEvent<TEntityState> {
  readonly createdAt: Date = new Date();

  abstract apply(state: TEntityState): void;
}
