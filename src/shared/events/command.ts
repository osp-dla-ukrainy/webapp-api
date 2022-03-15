export abstract class Command<TCommand> {
  constructor(command: TCommand) {
    Object.assign(this, command);
  }
}
