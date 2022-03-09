import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1646948626215 implements MigrationInterface {
  name = 'Init1646948626215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "participant_presentation"
                             (
                                 "participant_id" uuid NOT NULL,
                                 "user_id"  uuid NOT NULL,
                                 CONSTRAINT "PK_ee79491a95127bf17ac1f98616b" PRIMARY KEY ("participant_id", "user_id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "participant_presentation"`);
  }
}
