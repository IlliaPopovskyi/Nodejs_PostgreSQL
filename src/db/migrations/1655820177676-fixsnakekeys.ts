import {MigrationInterface, QueryRunner} from "typeorm";

export class fixsnakekeys1655820177676 implements MigrationInterface {
    name = 'fixsnakekeys1655820177676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "typePost"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "type_post" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD "photo_queue" jsonb array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "photo_queue"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type_post"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "typePost" character varying NOT NULL`);
    }

}
