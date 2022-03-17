import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class Location1647472245372 implements MigrationInterface {
  name = 'Location1647472245372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "location"
                             (
                                 "location_id"     uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "city"            character varying NOT NULL,
                                 "province"        character varying NOT NULL,
                                 "municipality"    character varying NOT NULL,
                                 "postcode"        character varying NOT NULL,
                                 "state"           character varying NOT NULL,
                                 "geolocation_lat" character varying NOT NULL,
                                 "geolocation_lng" character varying NOT NULL,
                                 CONSTRAINT "PK_b6e6c23b493859e5875de66c18d" PRIMARY KEY ("location_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD "location_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "UQ_bb9226e64e0b967157b32d8d692" UNIQUE ("location_id")`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "FK_44b825ff54ae787d79fb347c625"`);
    await queryRunner.query(`ALTER TABLE "organization"
        ALTER COLUMN "owner_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "FK_44b825ff54ae787d79fb347c625" FOREIGN KEY ("owner_id") REFERENCES "participant" ("participant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "FK_bb9226e64e0b967157b32d8d692" FOREIGN KEY ("location_id") REFERENCES "location" ("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "FK_bb9226e64e0b967157b32d8d692"`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "FK_44b825ff54ae787d79fb347c625"`);
    await queryRunner.query(`ALTER TABLE "organization"
        ALTER COLUMN "owner_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "FK_44b825ff54ae787d79fb347c625" FOREIGN KEY ("owner_id") REFERENCES "participant" ("participant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "UQ_bb9226e64e0b967157b32d8d692"`);
    await queryRunner.query(`ALTER TABLE "organization"
        DROP COLUMN "location_id"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
