import { ClassConstructor } from 'class-transformer';

export const CommandHandlerMetadataStorage = new Map<string, ClassConstructor<any>>();

export function RegisterCommandHandler(command: ClassConstructor<any>) {
  return (target: ClassConstructor<any>) => {
    CommandHandlerMetadataStorage.set(command.name, target);
  };
}
