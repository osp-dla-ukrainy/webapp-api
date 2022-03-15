import { Channel, connect, Connection } from 'amqplib/callback_api';
import { ConsumeMessage, Message } from 'amqplib/properties';
import { injectable } from 'inversify';
import { promisify } from 'util';
import { Logger } from '../logger';
import { QueueConstructor, QueueInterface } from './queue';

@injectable()
export class RegularQueue implements QueueInterface {
  private readonly connection: Promise<Connection>;
  private readonly queueName: string;

  constructor({ password, queueName, host, username }: QueueConstructor, private readonly logger: Logger) {
    this.connection = new Promise((resolve, reject) => {
      connect(
        {
          password,
          username,
          hostname: host,
        },
        (err, connection) => {
          if (err) {
            reject(err);
          }

          resolve(connection);
        }
      );
    });
    this.queueName = queueName;
  }

  async produce<TMessage extends Record<any, any>>(message: TMessage) {
    const channel = await this.assertQueue();

    channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)));

    this.logger.log(`[x][QUEUE ${this.queueName}] Sent ${message.constructor.name}`);
  }

  async consume(callback: (msg: ConsumeMessage | Message | null, channel: Channel) => Promise<void> | void) {
    const channel = await this.assertQueue();

    await channel.assertQueue(this.queueName, { durable: true });
    channel.prefetch(1);

    channel.consume(this.queueName, async (message) => {
      await callback(message, channel);
    });
  }

  private async assertQueue() {
    const connection = await this.connection;
    const createChannel = promisify(connection.createChannel).bind(connection);
    const channel: Channel = await createChannel();

    await channel.assertQueue(this.queueName, { durable: true });

    return channel;
  }
}
