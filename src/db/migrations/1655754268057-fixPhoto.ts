import {MigrationInterface, QueryRunner} from "typeorm";

export class fixPhoto1655754268057 implements MigrationInterface {
    name = 'fixPhoto1655754268057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_ce9dd77c9bdc0d326d1b9034e02"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "UQ_ce9dd77c9bdc0d326d1b9034e02"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "mainUserPhotoId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mainPhotoId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d82b821b06fb9d79e8443833dec" UNIQUE ("mainPhotoId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d82b821b06fb9d79e8443833dec" FOREIGN KEY ("mainPhotoId") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d82b821b06fb9d79e8443833dec"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d82b821b06fb9d79e8443833dec"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mainPhotoId"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "mainUserPhotoId" integer`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "UQ_ce9dd77c9bdc0d326d1b9034e02" UNIQUE ("mainUserPhotoId")`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_ce9dd77c9bdc0d326d1b9034e02" FOREIGN KEY ("mainUserPhotoId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_189d5dc35a8c96fafd5330fd131" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
