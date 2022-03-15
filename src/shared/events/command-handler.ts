import { Command } from './command';

export interface CommandHandler<TCommand> {
  execute(command: Command<TCommand>): Promise<void>;
}
