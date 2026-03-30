import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
  // Tabla de planes de suscripción
  await knex.schema.createTable("plans", (table) => {
    table.increments("id").primary();
    table.string("uuid").notNullable().unique();
    table.string("name").notNullable();
    table.integer("eggs_per_week").notNullable();
    table.enum("egg_size", ["small", "large"]).notNullable();
    table.decimal("price_monthly", 10, 2).notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Tabla de precios para pedidos únicos
  await knex.schema.createTable("egg_prices", (table) => {
    table.increments("id").primary();
    table.enum("egg_size", ["small", "large"]).notNullable().unique();
    table.decimal("price_per_egg", 10, 2).notNullable();
    table.decimal("price_per_carton", 10, 2).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // ── Seed: planes de suscripción ──────────────────────────────────────────
  await knex("plans").insert([
    { uuid: uuidv4(), name: "Plan Familiar", eggs_per_week: 30, egg_size: "small", price_monthly: 120.00 },
    { uuid: uuidv4(), name: "Plan Familiar", eggs_per_week: 30, egg_size: "large", price_monthly: 150.00 },
    { uuid: uuidv4(), name: "Plan Grande",   eggs_per_week: 60, egg_size: "small", price_monthly: 220.00 },
    { uuid: uuidv4(), name: "Plan Grande",   eggs_per_week: 60, egg_size: "large", price_monthly: 280.00 },
  ]);

  // ── Seed: precios pedido único ────────────────────────────────────────────
  await knex("egg_prices").insert([
    { egg_size: "small", price_per_egg: 1.25, price_per_carton: 30.00 },
    { egg_size: "large", price_per_egg: 1.75, price_per_carton: 42.00 },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("egg_prices");
  await knex.schema.dropTableIfExists("plans");
}
