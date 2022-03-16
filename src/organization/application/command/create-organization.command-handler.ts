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
import { GeolocationResolverService } from '../../domain/service/geolocation-resolver.service';
import { Location } from '../../domain/value-object/location';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { UnitOfWork } from '../../infrastructure/events/unit-of-work';

export class CreateOrganizationCommand extends Command<CreateOrganizationCommand> {
  readonly organizationId: OrganizationId;
  readonly participantId: ParticipantId;
  readonly location: {
    readonly city: string;
    readonly municipality: string;
    readonly province: string;
    readonly state: string;
    readonly postcode: string;
  };
  readonly organizationType: OrganizationType;
}

@RegisterCommandHandler(CreateOrganizationCommand)
@injectable()
export class CreateOrganizationCommandHandler implements CommandHandler<CreateOrganizationCommand> {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly participantRepository: ParticipantRepository,
    private readonly geolocationResolverService: GeolocationResolverService
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<void> {
    const uow = UnitOfWork.create();

    try {
      await uow.startTransaction();
      const participant = await uow.participantRepository.findOne(command.participantId);

      if (!participant) {
        throw ParticipantException.createDoesNotFound();
      }

      const organization = await uow.organizationRepository.findOneByOwner(participant.id);

      if (organization) {
        throw OrganizationException.createParticipantHasAlreadyOrganization();
      }

      const { location } = command;

      const newOrganization = Organization.createEntity({
        organizationId: command.organizationId,
        owner: participant,
        location: await Location.createEntity({
          city: location.city,
          province: location.province,
          municipality: location.municipality,
          postcode: location.postcode,
          state: location.state,
          geolocationResolverService: this.geolocationResolverService,
        }),
      });

      this.eventPublisher.mergeContext(newOrganization);

      await uow.saveOrganization(newOrganization);
      await uow.persist();

      await newOrganization.commit();

      await uow.commitTransaction();
    } catch (e) {
      await uow.rollbackTransaction();

      throw e;
    }
  }
}
