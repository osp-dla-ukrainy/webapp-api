import { MigrationInterface, QueryRunner } from 'typeorm';
import { AvailableQualification } from '../domain/value-object/available-qualification.entity';

export class AvailableQualification1647894145155 implements MigrationInterface {
  name = 'AvailableQualification1647894145155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "available_qualification"
                             (
                                 "name" character varying NOT NULL,
                                 CONSTRAINT "PK_c7473909312596a784a944acd6f" PRIMARY KEY ("name")
                             )`);
    const qualifications: AvailableQualification[] = [
      new AvailableQualification({ name: 'KPP' }),
      new AvailableQualification({ name: 'Ratownik medyczyny / Pielęgniarz' }),
      new AvailableQualification({ name: 'Lekarz' }),
      new AvailableQualification({ name: 'Prawo jazdy kat. B' }),
      new AvailableQualification({ name: 'Prawo jazdy kat. C' }),
      new AvailableQualification({ name: 'Uprawnienia wózka widłowego' }),
      new AvailableQualification({ name: 'Grafik komputerowy' }),
      new AvailableQualification({ name: 'Obsługa stron internetowych' }),
      new AvailableQualification({ name: 'Media marketing' }),
      new AvailableQualification({ name: 'Prawnik' }),
      new AvailableQualification({ name: 'Pedagog / psycholog' }),
      new AvailableQualification({ name: 'Zarządzanie / logistyka' }),
      new AvailableQualification({ name: 'j. angielski' }),
      new AvailableQualification({ name: 'j. rosyjski' }),
      new AvailableQualification({ name: 'j. ukraiński' }),
    ];

    await queryRunner.manager.getRepository(AvailableQualification).insert(qualifications);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "available_qualification"`);
  }
}
