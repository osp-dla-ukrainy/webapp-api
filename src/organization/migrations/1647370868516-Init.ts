import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class Init1647370868516 implements MigrationInterface {
  name = 'Init1647370868516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "participant"
                             (
                                 "participant_id" uuid NOT NULL,
                                 "user_id"        uuid NOT NULL,
                                 CONSTRAINT "UQ_7916773e236a9cfc13d59f96a4a" UNIQUE ("user_id"),
                                 CONSTRAINT "PK_389013d0d0a8cd76f64a767f2fa" PRIMARY KEY ("participant_id")
                             )`);
    await queryRunner.query(`CREATE TABLE "organization"
                             (
                                 "organization_id" uuid              NOT NULL,
                                 "type"            character varying NOT NULL,
                                 "owner_id"        uuid,
                                 CONSTRAINT "PK_ed1251fa3856cd1a6c98d7bcaa3" PRIMARY KEY ("organization_id")
                             )`);
    await queryRunner.query(`CREATE TABLE "event_store"
                             (
                                 "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "type"       character varying NOT NULL,
                                 "entity"     character varying NOT NULL,
                                 "data"       jsonb             NOT NULL,
                                 "version"    BIGSERIAL         NOT NULL,
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_f112deaffb65c3866e4d3f0fd13" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "FK_44b825ff54ae787d79fb347c625" FOREIGN KEY ("owner_id") REFERENCES "participant" ("participant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "FK_44b825ff54ae787d79fb347c625"`);
    await queryRunner.query(`DROP TABLE "event_store"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "participant"`);
  }
}
