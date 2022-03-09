import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class AddedUser1646558031680 implements MigrationInterface {
  name = 'AddedUser1646558031680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "facebook_profile"
                             (
                                 "facebook_profile_id" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "facebook_id"         character varying NOT NULL,
                                 CONSTRAINT "UQ_e009d8d8bc0aa40c8f1154b9317" UNIQUE ("facebook_id"),
                                 CONSTRAINT "PK_dbdad69edd0448d4d5975a76043" PRIMARY KEY ("facebook_profile_id")
                             )`);
    await queryRunner.query(`CREATE TABLE "user"
                             (
                                 "user_id"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "email"               character varying NOT NULL,
                                 "first_name"          character varying NOT NULL,
                                 "last_name"           character varying NOT NULL,
                                 "facebook_profile_id" uuid,
                                 CONSTRAINT "REL_7b75bdcd50c327f132d0fbbcaa" UNIQUE ("facebook_profile_id"),
                                 CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")
                             )`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_7b75bdcd50c327f132d0fbbcaaa" FOREIGN KEY ("facebook_profile_id") REFERENCES "facebook_profile" ("facebook_profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_7b75bdcd50c327f132d0fbbcaaa"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "facebook_profile"`);
  }
}
