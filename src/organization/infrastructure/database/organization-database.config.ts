import { SentEvent } from '../../domain/event/sent-event';
import { IdempotentConsumer } from '../../domain/presentation/idempotent-consumer';
import { OrganizationPresentation } from '../../domain/presentation/organization-presentation';
import { ParticipantPresentation } from '../../domain/presentation/participant-presentation';
import { EventStore } from '../events/event.store';

export const OrganizationWritableEntities = [EventStore, SentEvent];
export const OrganizationWritableConnection = 'organization-writable';

export const OrganizationReadableEntities = [ParticipantPresentation, OrganizationPresentation, IdempotentConsumer];
export const OrganizationReadableConnection = 'organization-readable';
