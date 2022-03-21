import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class CascadeOnQualification1647895123864 implements MigrationInterface {
  name = 'CascadeOnQualification1647895123864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qualification"
        DROP CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8"`);
    await queryRunner.query(`ALTER TABLE "qualification"
        ADD CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8" FOREIGN KEY ("organization_id") REFERENCES "organization" ("organization_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qualification"
        DROP CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8"`);
    await queryRunner.query(`ALTER TABLE "qualification"
        ADD CONSTRAINT "FK_0c1ab9bdecfa341da3dce897ba8" FOREIGN KEY ("organization_id") REFERENCES "organization" ("organization_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
