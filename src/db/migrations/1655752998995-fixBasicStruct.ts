import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixBasicStruct1655752998995 implements MigrationInterface {
	name = 'fixBasicStruct1655752998995';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "FK_d82b821b06fb9d79e8443833dec"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "UQ_d82b821b06fb9d79e8443833dec"`,
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mainPhotoId"`);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD "mainUserPhotoId" integer`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "UQ_ce9dd77c9bdc0d326d1b9034e02" UNIQUE ("mainUserPhotoId")`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_ce9dd77c9bdc0d326d1b9034e02" FOREIGN KEY ("mainUserPhotoId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_ce9dd77c9bdc0d326d1b9034e02"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP CONSTRAINT "UQ_ce9dd77c9bdc0d326d1b9034e02"`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" DROP COLUMN "mainUserPhotoId"`,
		);
		await queryRunner.query(`ALTER TABLE "user" ADD "mainPhotoId" integer`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "UQ_d82b821b06fb9d79e8443833dec" UNIQUE ("mainPhotoId")`,
		);
		await queryRunner.query(
			`ALTER TABLE "photo" ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "FK_d82b821b06fb9d79e8443833dec" FOREIGN KEY ("mainPhotoId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}
}
