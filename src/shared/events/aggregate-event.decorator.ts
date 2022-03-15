import { ClassConstructor } from 'class-transformer';
import { EventTypesMetadataStorage } from './event-type.metadata-storage';

export function AggregateEvent(aggregate: ClassConstructor<any>): ClassDecorator {
  return (target) => {
    const events = EventTypesMetadataStorage.get(aggregate.name);
    const newEvent = {
      name: target.name,
      instance: target as unknown as ClassConstructor<any>,
    };

    if (!events) {
      EventTypesMetadataStorage.set(aggregate.name, [newEvent]);

      return;
    }

    events.push(newEvent);
  };
}
