import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("subscriptions", (table) => {
    table.increments("id").primary();
    table.string("uuid").notNullable().unique();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.enum("plan_type", ["30", "60"]).notNullable();
    table.integer("eggs_per_week").notNullable();
    table.decimal("price_monthly", 10, 2).notNullable();
    table.enum("status", ["active", "paused"]).notNullable().defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("subscriptions");
}
