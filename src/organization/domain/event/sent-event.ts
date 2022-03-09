import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventStore } from '../../infrastructure/events/event.store';

export enum ProcessingStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class SentEvent {
  @PrimaryGeneratedColumn('uuid', { name: 'sent_event_id' })
  id: string;

  @OneToOne(() => EventStore)
  @JoinColumn()
  eventStore: EventStore<any>;

  @Column({ type: 'varchar' })
  status: ProcessingStatus;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<SentEvent>) {
    Object.assign(this, partial);
  }

  success() {
    this.status = ProcessingStatus.SUCCESS;
  }

  failed() {
    this.status = ProcessingStatus.FAILED;
  }
}
