import { injectable } from 'inversify';
import { QueryHandler } from '../../../shared/events/query-handler';
import { RegisterQueryHandler } from '../../../shared/events/query-handler.decorator';
import { Organization } from '../../domain/entity/organization.entity';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { PaginationOptions } from '../../infrastructure/repository/pagination-options';

export class GetOrganizationsByQueryQuery {
  readonly name: string;
  readonly paginationOptions: PaginationOptions;

  constructor(data: GetOrganizationsByQueryQuery) {
    Object.assign(this, data);
  }
}

export class GetOrganizationsByQueryQueryResult {
  readonly organizations: Organization[];
}

@injectable()
@RegisterQueryHandler(GetOrganizationsByQueryQuery)
export class GetOrganizationsByQueryQueryHandler
  implements QueryHandler<GetOrganizationsByQueryQuery, GetOrganizationsByQueryQueryResult>
{
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async execute(query: GetOrganizationsByQueryQuery): Promise<GetOrganizationsByQueryQueryResult> {
    const organizations = await this.organizationRepository.findByQuery({
      name: query.name,
      paginationOptions: query.paginationOptions,
    });

    return {
      organizations,
    };
  }
}
