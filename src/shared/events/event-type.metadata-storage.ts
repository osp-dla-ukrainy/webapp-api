import { ClassConstructor } from 'class-transformer';

export const EventTypesMetadataStorage = new Map<string, { instance: ClassConstructor<any>; name: string }[]>();
