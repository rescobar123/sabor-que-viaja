import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("egg_prices", (table) => {
    table.decimal("sub_price_per_egg", 10, 2).notNullable().defaultTo(0);
    table.decimal("sub_price_per_carton", 10, 2).notNullable().defaultTo(0);
  });

  // Precios de suscripción (más baratos que pedido único)
  await knex("egg_prices").where({ egg_size: "small" }).update({
    sub_price_per_egg: 1.00,
    sub_price_per_carton: 30.00,
  });
  await knex("egg_prices").where({ egg_size: "large" }).update({
    sub_price_per_egg: 1.40,
    sub_price_per_carton: 42.00,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("egg_prices", (table) => {
    table.dropColumn("sub_price_per_egg");
    table.dropColumn("sub_price_per_carton");
  });
}
