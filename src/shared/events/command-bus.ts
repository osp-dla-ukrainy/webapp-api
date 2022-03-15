import { injectable } from 'inversify';
import { Command } from './command';
import { CommandHandler } from './command-handler';

@injectable()
export class CommandBus {
  constructor(private readonly handlers: Map<string, CommandHandler<any>>) {}

  async handle<TCommand>(command: Command<TCommand>) {
    const commandName = command.constructor.name;
    const commandHandler = this.handlers.get(command.constructor.name);

    if (!commandHandler) {
      throw new Error(`CommandHandler does not found for command: ${commandName}`);
    }

    await commandHandler.execute(command);
  }
}
