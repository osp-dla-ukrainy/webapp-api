import { injectable } from 'inversify';
import { CommandHandler } from '../../../shared/events/command-handler';
import { EventPublisher } from '../../../shared/events/event-publisher';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Participant } from '../../domain/entity/participant';
import { ParticipantRepository } from '../../domain/repository/participant.repository';

export class CreateParticipantCommand {
  constructor(readonly userId: string, readonly participantId: ParticipantId) {}
}

@injectable()
export class CreateParticipantCommandHandler implements CommandHandler<CreateParticipantCommand> {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute({ participantId, userId }: CreateParticipantCommand): Promise<void> {
    const newOwner = Participant.create({
      id: participantId,
      userId,
    });

    this.eventPublisher.mergeContext(newOwner);

    await this.participantRepository.save(newOwner);
    await newOwner.commit();
  }
}
