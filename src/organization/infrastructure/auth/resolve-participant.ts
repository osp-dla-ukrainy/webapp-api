import { NextFunction, Request, Response } from 'express';
import container from '../../../container';
import { JwtUser } from '../../../shared/auth/jwt';
import { ParticipantException } from '../../domain/exception/participant-exception';
import { ParticipantRepository } from '../../domain/repository/participant.repository';

export function ResolveParticipant() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const participantRepository = container.get(ParticipantRepository);
    const { user } = res.locals as { user: JwtUser };

    const participant = await participantRepository.findOneByUserId({ userId: user.id });

    if (!participant) {
      throw ParticipantException.createDoesNotFound();
    }

    res.locals.participant = participant;
    next();
  };
}
