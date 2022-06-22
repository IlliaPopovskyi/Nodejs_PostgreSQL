import {MigrationInterface, QueryRunner} from "typeorm";

export class fixmanytomany1655816095638 implements MigrationInterface {
    name = 'fixmanytomany1655816095638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_moderators_user" ("groupId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_11e487e679d10177e43342ea811" PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a36d453c69201ba773f2ed4e62" ON "group_moderators_user" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5049fed7600d229619772b599c" ON "group_moderators_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "group_moderators_user" ADD CONSTRAINT "FK_a36d453c69201ba773f2ed4e621" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "group_moderators_user" ADD CONSTRAINT "FK_5049fed7600d229619772b599c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_moderators_user" DROP CONSTRAINT "FK_5049fed7600d229619772b599c8"`);
        await queryRunner.query(`ALTER TABLE "group_moderators_user" DROP CONSTRAINT "FK_a36d453c69201ba773f2ed4e621"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5049fed7600d229619772b599c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a36d453c69201ba773f2ed4e62"`);
        await queryRunner.query(`DROP TABLE "group_moderators_user"`);
    }

}
