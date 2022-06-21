import { MigrationInterface, QueryRunner } from 'typeorm';

export class typesPost1655801932415 implements MigrationInterface {
	name = 'typesPost1655801932415';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "post" ADD "typePost" character varying NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "group" ADD "accessType" character varying NOT NULL DEFAULT 'public'`,
		);
		await queryRunner.query(
			`ALTER TABLE "group" ADD "blogType" character varying NOT NULL DEFAULT 'forum'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "blogType"`);
		await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "accessType"`);
		await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "typePost"`);
	}
}
