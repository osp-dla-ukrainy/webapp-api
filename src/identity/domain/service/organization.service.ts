import { injectable } from 'inversify';
import { CreateParticipantCommand } from '../../../organization/application/command/create-participant.command-handler';
import { ParticipantId } from '../../../organization/domain/value-object/participant-id';
import { CommandBus } from '../../../shared/events/command-bus';

@injectable()
export abstract class OrganizationService {
  abstract createOwner(owner: { userId: string }): Promise<void>;
}

@injectable()
export class InternalOrganizationService extends OrganizationService {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async createOwner({ userId }: { userId: string }): Promise<void> {
    const participantId = ParticipantId.create();

    await this.commandBus.handle(new CreateParticipantCommand(userId, participantId));
  }
}
