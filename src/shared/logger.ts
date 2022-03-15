import { injectable } from 'inversify';
import chalk from 'chalk';

@injectable()
export abstract class Logger {
  abstract log(message: string): void;

  abstract error(message: string): void;
}

@injectable()
export class ConsoleLogLogger extends Logger {
  error(message: string): void {
    console.log(chalk.red(message));
  }

  log(message: string): void {
    console.error(chalk.green(message));
  }
}
