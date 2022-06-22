import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixunique1655888776396 implements MigrationInterface {
	name = 'fixunique1655888776396';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "post" DROP CONSTRAINT "UQ_d604d2a0b35bdf7f3f827a47e85"`,
		);
		await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "photo_queue"`);
		await queryRunner.query(`ALTER TABLE "post" ADD "photo_queue" jsonb`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "photo_queue"`);
		await queryRunner.query(
			`ALTER TABLE "post" ADD "photo_queue" jsonb array`,
		);
		await queryRunner.query(
			`ALTER TABLE "post" ADD CONSTRAINT "UQ_d604d2a0b35bdf7f3f827a47e85" UNIQUE ("text")`,
		);
	}
}
