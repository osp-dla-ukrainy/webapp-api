import { StatusCodes } from 'http-status-codes';
import { HttpException, HttpExceptionConstructor } from '../../../shared/exception/http.exception';

export class ParticipantException extends HttpException {
  static createDoesNotFound(): ParticipantException {
    return new ParticipantException({
      message: 'Participant does not exist for logged user',
      status: StatusCodes.NOT_FOUND,
    } as HttpExceptionConstructor);
  }

  constructor(data: HttpExceptionConstructor) {
    super(data);
  }
}