import { injectable } from 'inversify';
import { Command } from '../../../shared/events/command';
import { CommandHandler } from '../../../shared/events/command-handler';
import { RegisterCommandHandler } from '../../../shared/events/command-handler.decorator';
import { EventPublisher } from '../../../shared/events/event-publisher';
import { Organization } from '../../domain/entity/organization.entity';
import { OrganizationException } from '../../domain/exception/organization-exception';
import { ParticipantException } from '../../domain/exception/participant-exception';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { GeolocationResolverService } from '../../domain/service/geolocation-resolver.service';
import { Contact } from '../../domain/value-object/contact.entity';
import { Location } from '../../domain/value-object/location.entity';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Qualification } from '../../domain/value-object/qualifications.entity';
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
  readonly contact: {
    readonly phone: string;
  };
  readonly name: string;
  readonly qualifications: string[];
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

      const [organization, organizationWithThisSameName] = await Promise.all([
        uow.organizationRepository.findOneByOwner(participant.id),
        uow.organizationRepository.findOneByName(command.name),
      ]);

      if (organization) {
        throw OrganizationException.createParticipantHasAlreadyOrganization();
      }

      if (organizationWithThisSameName) {
        throw OrganizationException.createOrganizationExistsWithGivenName();
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
        contact: Contact.createEntity({ phone: command.contact.phone }),
        name: command.name,
        qualifications: command.qualifications.map((q) => Qualification.createEntity({ name: q })),
      });

      await newOrganization.validate();

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
