import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class Qualifications1647892151699 implements MigrationInterface {
  name = 'Qualifications1647892151699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "qualification"
                             (
                                 "qualification_id" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"             character varying NOT NULL,
                                 "organization_id"  uuid              NOT NULL,
                                 CONSTRAINT "PK_1eb50cd787f180035ee73d703cf" PRIMARY KEY ("qualification_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "qualification"
        ADD CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8" FOREIGN KEY ("organization_id") REFERENCES "organization" ("organization_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qualification"
        DROP CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8"`);
    await queryRunner.query(`DROP TABLE "qualification"`);
  }
}
