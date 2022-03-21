import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1647549317964 implements MigrationInterface {
  name = 'Contact1647549317964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "contact"
                             (
                                 "contact_id" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "phone"      character varying NOT NULL,
                                 CONSTRAINT "PK_b77c91f220387c3c90df787bce5" PRIMARY KEY ("contact_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD "name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD "is_verified" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        DROP COLUMN "is_verified"`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP COLUMN "name"`);
    await queryRunner.query(`DROP TABLE "contact"`);
  }
}
