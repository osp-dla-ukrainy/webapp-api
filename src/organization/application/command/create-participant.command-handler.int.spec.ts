import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { clearSchema, initTestApp } from '../../../../test/init.test';
import { saveParticipant } from '../../../../test/organization.test';
import container from '../../../container';
import { CommandBus } from '../../../shared/events/command-bus';
import { Participant } from '../../domain/entity/participant.entity';
import { ParticipantCreated } from '../../domain/event/participant-created';
import { ParticipantException } from '../../domain/exception/participant-exception';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { OrganizationConnection } from '../../infrastructure/database/organization-database.config';
import { EventStore } from '../../infrastructure/events/event.store';
import { CreateParticipantCommand } from './create-participant.command-handler';

describe('CreateParticipantCommandHandler integration tests', () => {
  let commandBus: CommandBus;

  beforeAll(async () => {
    await initTestApp();

    commandBus = container.get(CommandBus);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    await clearSchema();
  });

  it('should create participant', async () => {
    const participantId = ParticipantId.create();
    const userId = v4();

    await commandBus.handle(new CreateParticipantCommand(userId, participantId));

    const result = await getRepository(Participant, OrganizationConnection).findOne();

    expect(result).toMatchObject({
      id: expect.any(ParticipantId),
      userId,
    } as Participant);
  });

  it('should invoke ParticipantCreated event', async () => {
    const participantId = ParticipantId.create();
    const userId = v4();

    await commandBus.handle(new CreateParticipantCommand(userId, participantId));

    const result = await getRepository(EventStore, OrganizationConnection).findOne();

    expect(result).toMatchObject({
      id: expect.any(String),
      data: {
        userId,
        participantId: expect.any(Object),
      },
      entity: Participant.name,
      type: ParticipantCreated.name,
    } as EventStore<ParticipantCreated>);
  });

  it('should throw exception, when participant exists for given userId', async () => {
    const participantId = ParticipantId.create();
    const { userId } = await saveParticipant();

    await expect(commandBus.handle(new CreateParticipantCommand(userId, participantId))).rejects.toThrow(
      ParticipantException
    );
  });
});
