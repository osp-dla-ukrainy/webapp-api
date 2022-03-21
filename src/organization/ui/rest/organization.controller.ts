import { Request, Response, Router } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import container from '../../../container';
import { AuthMiddleware } from '../../../shared/auth/auth-middleware';
import { CommandBus } from '../../../shared/events/command-bus';
import { QueryBus } from '../../../shared/events/query-bus';
import { CreateOrganizationCommand } from '../../application/command/create-organization.command-handler';
import {
  GetOrganizationsByQueryQuery,
  GetOrganizationsByQueryQueryResult,
} from '../../application/query/get-organizations-by-query-query.handler';
import { Participant } from '../../domain/entity/participant.entity';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ResolveParticipant } from '../../infrastructure/auth/resolve-participant';
import { PaginationOptions } from '../../infrastructure/repository/pagination-options';
import { CreateOrganizationRequestDto } from './dto/create-organization.dto';
import { OrganizationRequestValidator } from './organization.request-validator';
import { OrganizationResponseSerializer } from './organization.response-serializer';

export class OrganizationController {
  static async create(req: Request, res: Response) {
    const { participant } = res.locals as { participant: Participant };
    const commandBus = container.get(CommandBus);

    const dto = matchedData(req) as CreateOrganizationRequestDto;
    const organizationId = OrganizationId.create();

    await commandBus.handle(
      new CreateOrganizationCommand({
        organizationId,
        participantId: participant.id,
        location: dto.location,
        organizationType: dto.organizationType,
        contact: dto.contact,
        name: dto.name,
        qualifications: dto.qualifications,
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

  static async getByQuery(req: Request, res: Response) {
    const queryBus = container.get(QueryBus);
    const serializer = container.get(OrganizationResponseSerializer);
    const { name, page, limit } = matchedData(req);

    const result: GetOrganizationsByQueryQueryResult = await queryBus.handle(
      new GetOrganizationsByQueryQuery({
        name,
        paginationOptions: new PaginationOptions({
          page,
          limit,
        }),
      })
    );

    return res.status(StatusCodes.OK).json({
      data: serializer.serializeCollection(result.organizations),
    });
  }
}

export function getOrganizationRoutes() {
  const router = Router();

  router.post(
    '/',
    OrganizationRequestValidator.create,
    AuthMiddleware,
    ResolveParticipant(),
    OrganizationController.create
  );
  router.get('/me', AuthMiddleware, ResolveParticipant(), OrganizationController.me);
  router.get('/', OrganizationRequestValidator.getByQuery, OrganizationController.getByQuery);

  return router;
}
