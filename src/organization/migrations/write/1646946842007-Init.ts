import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class Init1646946842007 implements MigrationInterface {
  name = 'Init1646946842007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "event_store"
                             (
                                 "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "entity_id"  uuid              NOT NULL,
                                 "type"       character varying NOT NULL,
                                 "entity"     character varying NOT NULL,
                                 "data"       jsonb             NOT NULL,
                                 "version"    BIGSERIAL         NOT NULL,
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_f112deaffb65c3866e4d3f0fd13" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "sent_event"
                             (
                                 "sent_event_id"  uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "status"         character varying NOT NULL,
                                 "event_store_id" uuid,
                                 CONSTRAINT "REL_cd4b00bf131580bfa2caef74f3" UNIQUE ("event_store_id"),
                                 CONSTRAINT "PK_17e0d38469458ba15d157691559" PRIMARY KEY ("sent_event_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "sent_event"
        ADD CONSTRAINT "FK_cd4b00bf131580bfa2caef74f35" FOREIGN KEY ("event_store_id") REFERENCES "event_store" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sent_event"
        DROP CONSTRAINT "FK_cd4b00bf131580bfa2caef74f35"`);
    await queryRunner.query(`DROP TABLE "sent_event"`);
    await queryRunner.query(`DROP TABLE "event_store"`);
  }
}
