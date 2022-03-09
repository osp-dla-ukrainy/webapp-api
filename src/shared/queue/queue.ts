import { Channel } from 'amqplib/callback_api';
import { ConsumeMessage, Message } from 'amqplib/properties';

export enum QueueType {
  PubSub = 'pubsub',
  Queue = 'queue',
}

export type QueueConstructor = {
  readonly queueName: string;
  readonly host: string;
  readonly username: string;
  readonly password: string;
  readonly queueType?: QueueType;
};

export interface QueueInterface {
  produce<TMessage extends Record<any, any>>(message: TMessage): Promise<void>;
  consume(callback: (msg: ConsumeMessage | Message | null, channel: Channel) => Promise<void> | void): Promise<void>;
}
