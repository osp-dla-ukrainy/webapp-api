import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../../../shared/exception/http.exception';

export class OrganizationException extends HttpException {
  static createParticipantHasAlreadyOrganization() {
    return new OrganizationException({
      message: 'Participant has already organization',
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
