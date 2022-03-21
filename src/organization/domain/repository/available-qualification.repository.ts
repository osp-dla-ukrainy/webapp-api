import { injectable } from 'inversify';
import { AvailableQualification } from '../value-object/available-qualification.entity';

@injectable()
export abstract class AvailableQualificationRepository {
  abstract findAll(): Promise<AvailableQualification[]>;
}
