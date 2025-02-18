import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738353677886 implements MigrationInterface {
    name = 'InitialMigration1738353677886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying(100) NOT NULL, "lastname" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying, "full_name" character varying NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "email_verification_token" character varying, "reset_password_token" character varying, "magic_link_token" character varying, "refresh_token" character varying, "google_id" character varying, "avatar_url" character varying, "login_attempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP, "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
