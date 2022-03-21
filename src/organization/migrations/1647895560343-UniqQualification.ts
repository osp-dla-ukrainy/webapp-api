import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqQualification1647895560343 implements MigrationInterface {
    name = 'UniqQualification1647895560343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qualification" ADD CONSTRAINT "UQ_684ae4bbbd8edeb95504d6599ff" UNIQUE ("name", "organization_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qualification" DROP CONSTRAINT "UQ_684ae4bbbd8edeb95504d6599ff"`);
    }

}
