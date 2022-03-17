import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1647551026124 implements MigrationInterface {
  name = 'Contact1647551026124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        ADD "contact_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "UQ_1b315ca37fec4b8bdbdf1b59d28" UNIQUE ("contact_id")`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "FK_1b315ca37fec4b8bdbdf1b59d28" FOREIGN KEY ("contact_id") REFERENCES "contact" ("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "FK_1b315ca37fec4b8bdbdf1b59d28"`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "UQ_1b315ca37fec4b8bdbdf1b59d28"`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP COLUMN "contact_id"`);
  }
}
