import { MigrationInterface, QueryRunner } from 'typeorm';

export class IdempotentConsumer1647294816780 implements MigrationInterface {
  name = 'IdempotentConsumer1647294816780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "idempotent_consumer"
                             (
                                 "event_id"   uuid              NOT NULL,
                                 "consumer"   character varying NOT NULL,
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_4c91000e005e6be9335b4975479" PRIMARY KEY ("event_id", "consumer")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "idempotent_consumer"`);
  }
}
