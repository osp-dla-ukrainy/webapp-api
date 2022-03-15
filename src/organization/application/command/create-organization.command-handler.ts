import { injectable } from 'inversify';
import { Command } from '../../../shared/events/command';
import { CommandHandler } from '../../../shared/events/command-handler';
import { RegisterCommandHandler } from '../../../shared/events/command-handler.decorator';
import { EventPublisher } from '../../../shared/events/event-publisher';
import { Organization } from '../../domain/entity/organization';
import { OrganizationException } from '../../domain/exception/organization-exception';
import { ParticipantException } from '../../domain/exception/participant-exception';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ParticipantId } from '../../domain/value-object/participant-id';

export class CreateOrganizationCommand extends Command<CreateOrganizationCommand> {
  readonly organizationId: OrganizationId;
  readonly participantId: ParticipantId;
}

@RegisterCommandHandler(CreateOrganizationCommand)
@injectable()
export class CreateOrganizationCommandHandler implements CommandHandler<CreateOrganizationCommand> {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute({ organizationId, participantId }: CreateOrganizationCommand): Promise<void> {
    const participant = await this.participantRepository.findOne(participantId);

    if (!participant) {
      throw ParticipantException.createDoesNotFound();
    }

    const organization = await this.organizationRepository.findOneByOwner(participant.id);

    if (organization) {
      throw OrganizationException.createParticipantHasAlreadyOrganization();
    }

    const newOrganization = Organization.create({
      organizationId,
      owner: participant,
    });

    this.eventPublisher.mergeContext(newOrganization);

    await this.organizationRepository.save(newOrganization);
    await newOrganization.commit();
  }
}
