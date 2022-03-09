import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class OrganizationPresentation1647025241086 implements MigrationInterface {
  name = 'OrganizationPresentation1647025241086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "organization_presentation"
                             (
                                 "organization_id" uuid              NOT NULL,
                                 "type"            character varying NOT NULL,
                                 "owner_id"        uuid,
                                 "owner_user_id"   uuid,
                                 CONSTRAINT "PK_1274716efb055913696aadfda75" PRIMARY KEY ("organization_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "organization_presentation"
        ADD CONSTRAINT "FK_e13c980bd1fbcb1cc83cf026aa8" FOREIGN KEY ("owner_id", "owner_user_id") REFERENCES "participant_presentation" ("participant_id", "user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization_presentation"
        DROP CONSTRAINT "FK_e13c980bd1fbcb1cc83cf026aa8"`);
    await queryRunner.query(`DROP TABLE "organization_presentation"`);
  }
}
