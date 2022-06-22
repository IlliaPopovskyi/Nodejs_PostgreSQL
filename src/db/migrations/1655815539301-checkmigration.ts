import { MigrationInterface, QueryRunner } from 'typeorm';

export class checkmigration1655815539301 implements MigrationInterface {
	name = 'checkmigration1655815539301';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
