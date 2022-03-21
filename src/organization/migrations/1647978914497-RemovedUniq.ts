import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedUniq1647978914497 implements MigrationInterface {
  name = 'RemovedUniq1647978914497';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        DROP CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0"`);

    await queryRunner.query(`
        INSERT INTO public.available_qualification (name) VALUES ('Prawo jazdy kat. D');
        INSERT INTO public.available_qualification (name) VALUES ('j. hiszpański');
        INSERT INTO public.available_qualification (name) VALUES ('j. niemiecki');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization"
        ADD CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name")`);
  }
}
