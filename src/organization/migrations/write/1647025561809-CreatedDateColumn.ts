import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedDateColumn1647025561809 implements MigrationInterface {
    name = 'CreatedDateColumn1647025561809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sent_event" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sent_event" DROP COLUMN "created_at"`);
    }

}
