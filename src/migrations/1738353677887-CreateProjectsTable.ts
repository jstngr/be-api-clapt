import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectsTable1738353677887 implements MigrationInterface {
  name = 'CreateProjectsTable1738353677887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."projects_status_enum" AS ENUM ('active', 'deactivated')
    `);

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "owner_id" uuid NOT NULL,
        "start_date" date NOT NULL,
        "deadline" date NOT NULL,
        "budget" decimal(10,2) NOT NULL,
        "status" "public"."projects_status_enum" NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "pk_projects" PRIMARY KEY ("id"),
        CONSTRAINT "fk_projects_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_projects_owner" ON "projects"("owner_id")
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."project_members_role_enum" AS ENUM (
        'collaborator',
        'collaborator_restricted',
        'client_read',
        'client_read_write'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."project_members_status_enum" AS ENUM (
        'pending',
        'accepted',
        'declined'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "project_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "user_id" uuid,
        "email" character varying NOT NULL,
        "role" "public"."project_members_role_enum" NOT NULL DEFAULT 'collaborator',
        "status" "public"."project_members_status_enum" NOT NULL DEFAULT 'pending',
        "joined_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "pk_project_members" PRIMARY KEY ("id"),
        CONSTRAINT "fk_project_members_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_project_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_project_members_project" ON "project_members"("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_project_members_user" ON "project_members"("user_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_project_members_email_project" ON "project_members"("email", "project_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_project_members_email_project"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_project_members_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_project_members_project"`,
    );
    await queryRunner.query(`DROP TABLE "project_members"`);
    await queryRunner.query(`DROP TYPE "public"."project_members_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."project_members_role_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_projects_owner"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
  }
}
