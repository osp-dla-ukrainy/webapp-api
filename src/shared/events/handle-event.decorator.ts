import { ClassConstructor } from 'class-transformer';

export const EventHandlersMetadataStorage = new Map<string, ClassConstructor<any>[]>();
export const GlobalEventHandlersMetadataStorage: Set<ClassConstructor<any>> = new Set();

export function EventHandler(event: ClassConstructor<any>) {
  return (target: ClassConstructor<any>) => {
    const handlers = EventHandlersMetadataStorage.get(event.name);

    if (handlers) {
      handlers.push(target);
    } else {
      EventHandlersMetadataStorage.set(event.name, [target]);
    }
  };
}

export function GlobalEventHandler() {
  return (target: ClassConstructor<any>) => {
    GlobalEventHandlersMetadataStorage.add(target);
  };
}
