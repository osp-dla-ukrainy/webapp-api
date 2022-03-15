import { ClassConstructor } from 'class-transformer';

export const QueryHandlerMetadataStorage = new Map<string, ClassConstructor<any>>();

export function RegisterQueryHandler(query: ClassConstructor<any>) {
  return (target: ClassConstructor<any>) => {
    QueryHandlerMetadataStorage.set(query.name, target);
  };
}
