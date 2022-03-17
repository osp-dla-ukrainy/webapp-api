export class GetOrganizationsByQueryResponseDto {
  readonly name: string;
  readonly location: {
    readonly city: string;
    readonly province: string;
    readonly municipality: string;
    readonly postcode: string;
    readonly state: string;
  };
  readonly contact: {
    readonly phone: string;
  };
  readonly isVerified: boolean;
  readonly qualifications: string[];
}
