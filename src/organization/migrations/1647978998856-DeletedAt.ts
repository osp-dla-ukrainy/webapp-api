import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedAt1647978998856 implements MigrationInterface {
  name = 'DeletedAt1647978998856';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qualification"
        ADD "deleted_at" TIMESTAMP`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qualification"
        DROP COLUMN "deleted_at"`);
  }
}
