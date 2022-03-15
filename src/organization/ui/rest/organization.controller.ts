import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import container from '../../../container';
import { AuthMiddleware } from '../../../shared/auth/auth-middleware';
import { CommandBus } from '../../../shared/events/command-bus';
import { CreateOrganizationCommand } from '../../application/command/create-organization.command-handler';
import { Participant } from '../../domain/entity/participant';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ResolveParticipant } from '../../infrastructure/auth/resolve-participant';

export class OrganizationController {
  static async create(req: Request, res: Response) {
    const { participant } = res.locals as { participant: Participant };
    const commandBus = container.get(CommandBus);

    const organizationId = OrganizationId.create();

    await commandBus.handle(
      new CreateOrganizationCommand({
        organizationId,
        participantId: participant.id,
      })
    );

    return res.status(StatusCodes.CREATED).json({ organizationId: organizationId.valueOf }).end();
  }

  // todo create query-handler
  static async me(req: Request, res: Response) {
    const { participant } = res.locals as { participant: Participant };
    const organizationRepository = container.get(OrganizationRepository);

    const organization = await organizationRepository.findOneByOwner(participant.id);

    return res.status(StatusCodes.CREATED).json(organization).end();
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const organizationRepository = container.get(OrganizationRepository);

    const organization = await organizationRepository.fineOne(new OrganizationId(id));

    return res.status(StatusCodes.CREATED).json(organization).end();
  }
}

export function getOrganizationRoutes() {
  const router = Router();

  router.post('/', AuthMiddleware, ResolveParticipant(), OrganizationController.create);
  router.get('/me', AuthMiddleware, ResolveParticipant(), OrganizationController.me);
  router.get('/:id', OrganizationController.getOne);

  return router;
}
