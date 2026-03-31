import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("egg_prices", (table) => {
    table.dropColumn("price_per_egg");
    table.dropColumn("sub_price_per_egg");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("egg_prices", (table) => {
    table.decimal("price_per_egg", 10, 2).notNullable().defaultTo(0);
    table.decimal("sub_price_per_egg", 10, 2).notNullable().defaultTo(0);
  });
}
