import { MigrationInterface, QueryRunner } from 'typeorm';

export class queuephoto1655891961952 implements MigrationInterface {
	name = 'queuephoto1655891961952';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "photo" ADD "queue_place" integer`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "photo" DROP COLUMN "queue_place"`,
		);
	}
}
