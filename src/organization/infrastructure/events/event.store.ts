import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEvent } from '../../../shared/events/domain-event';

@Entity()
export class EventStore<TData extends DomainEvent> extends BaseEntity {
  static createFromDomainEvent(domainEvent: DomainEvent | DomainEvent[]): EventStore<any>[] {
    const domainEvents = Array.isArray(domainEvent) ? domainEvent : [domainEvent];

    return domainEvents.map(
      (e) =>
        new EventStore({
          data: e,
          entity: e.entity,
          type: e.constructor.name,
        })
    );
  }

  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  readonly type: string;

  @Column()
  readonly entity: string;

  @Column({ type: 'jsonb' })
  readonly data: TData;

  @Generated('increment')
  @Column({ type: 'bigint' })
  readonly version: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  constructor(partial: Partial<EventStore<TData>>) {
    super();
    Object.assign(this, partial);
  }
}
