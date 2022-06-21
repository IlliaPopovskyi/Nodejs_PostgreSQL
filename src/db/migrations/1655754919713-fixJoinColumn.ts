import {MigrationInterface, QueryRunner} from "typeorm";

export class fixJoinColumn1655754919713 implements MigrationInterface {
    name = 'fixJoinColumn1655754919713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_526d442eb2db4ff86c04ce07930"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "REL_526d442eb2db4ff86c04ce0793"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "mainGroupPhotoId"`);
        await queryRunner.query(`ALTER TABLE "group" ADD "mainPhotoId" integer`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "UQ_8eead0aa79b88b94649a61b2da4" UNIQUE ("mainPhotoId")`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_8eead0aa79b88b94649a61b2da4" FOREIGN KEY ("mainPhotoId") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_8eead0aa79b88b94649a61b2da4"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "UQ_8eead0aa79b88b94649a61b2da4"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "mainPhotoId"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "mainGroupPhotoId" integer`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "REL_526d442eb2db4ff86c04ce0793" UNIQUE ("mainGroupPhotoId")`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_526d442eb2db4ff86c04ce07930" FOREIGN KEY ("mainGroupPhotoId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
