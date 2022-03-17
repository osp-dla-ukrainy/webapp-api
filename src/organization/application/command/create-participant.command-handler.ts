import { injectable } from 'inversify';
import { CommandHandler } from '../../../shared/events/command-handler';
import { RegisterCommandHandler } from '../../../shared/events/command-handler.decorator';
import { EventPublisher } from '../../../shared/events/event-publisher';
import { ParticipantException } from '../../domain/exception/participant-exception';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Participant } from '../../domain/entity/participant';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { UnitOfWork } from '../../infrastructure/events/unit-of-work';

export class CreateParticipantCommand {
  constructor(readonly userId: string, readonly participantId: ParticipantId) {}
}

@RegisterCommandHandler(CreateParticipantCommand)
@injectable()
export class CreateParticipantCommandHandler implements CommandHandler<CreateParticipantCommand> {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute({ participantId, userId }: CreateParticipantCommand): Promise<void> {
    const uow = UnitOfWork.create();

    const participant = await uow.participantRepository.findOneByUserId({ userId });

    if (participant) {
      throw ParticipantException.createParticipantAlreadyExists();
    }

    try {
      await uow.startTransaction();

      const newParticipant = Participant.createEntity({
        id: participantId,
        userId,
      });

      this.eventPublisher.mergeContext(newParticipant);

      await uow.saveParticipant(newParticipant);
      await uow.persist();

      await newParticipant.commit();

      await uow.commitTransaction();
    } catch (e) {
      await uow.rollbackTransaction();

      throw e;
    }
  }
}
