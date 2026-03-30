import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("subscriptions", (table) => {
    table.enum("egg_size", ["small", "large"]).notNullable().defaultTo("large");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("subscriptions", (table) => {
    table.dropColumn("egg_size");
  });
}
