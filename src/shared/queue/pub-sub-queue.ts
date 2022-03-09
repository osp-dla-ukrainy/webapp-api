import { Channel, connect, Connection } from 'amqplib/callback_api';
import { ConsumeMessage } from 'amqplib/properties';
import { injectable } from 'inversify';
import { promisify } from 'util';
import { Logger } from '../logger';
import { QueueConstructor, QueueInterface } from './queue';

@injectable()
export class PubSubQueue implements QueueInterface {
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
    const connection = await this.connection;
    const createChannel = promisify(connection.createChannel).bind(connection);
    const channel: Channel = await createChannel();

    channel.assertExchange(this.queueName, 'fanout', {
      durable: false,
    });
    channel.publish(this.queueName, '', Buffer.from(JSON.stringify(message)));
    this.logger.log(`[x] Sent ${message.constructor.name} message`);
  }

  async consume(callback: (msg: ConsumeMessage | null, channel: Channel) => Promise<void> | void) {
    const connection = await this.connection;
    const createChannel = promisify(connection.createChannel).bind(connection);
    const channel: Channel = await createChannel();

    await channel.assertExchange(this.queueName, 'fanout', {
      durable: false,
    });

    const assertQueue = promisify(channel.assertQueue).bind(channel);

    const queue = await assertQueue('', { exclusive: true });

    channel.bindQueue(queue.queue, this.queueName, '');

    channel.consume(queue.queue, async (message: ConsumeMessage) => {
      await callback(message, channel);
    });
    this.logger.log(`[*] Waiting for messages in ${queue.queue}`);
  }
}
