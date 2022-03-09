import { injectable } from 'inversify';
import {
  CreateParticipantCommand,
  CreateParticipantCommandHandler,
} from '../../../organization/application/command/create-participant.command-handler';
import { ParticipantId } from '../../../organization/domain/value-object/participant-id';

@injectable()
export abstract class OrganizationService {
  abstract createOwner(owner: { userId: string }): Promise<void>;
}

@injectable()
export class InternalOrganizationService extends OrganizationService {
  constructor(private readonly createOwnerCommandHandler: CreateParticipantCommandHandler) {
    super();
  }

  async createOwner({ userId }: { userId: string }): Promise<void> {
    const participantId = ParticipantId.create();

    await this.createOwnerCommandHandler.execute(new CreateParticipantCommand(userId, participantId));
  }
}
