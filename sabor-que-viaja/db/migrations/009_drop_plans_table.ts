import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("plans");
}

export async function down(knex: Knex): Promise<void> {
  // No recreamos — si necesitas revertir, usa un backup
}
