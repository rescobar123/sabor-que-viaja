import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    // Producto del pedido — 'huevos' por ahora, preparado para queso/leche/etc.
    table.string("product").notNullable().defaultTo("huevos");
    // Cantidad de unidades (huevos, quesos, litros, etc.)
    table.integer("quantity").notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("product");
    table.dropColumn("quantity");
  });
}
