import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.string("uuid").notNullable().unique();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("subscription_id").nullable().references("id").inTable("subscriptions").onDelete("SET NULL");
    table.enum("status", ["pending", "confirmed"]).notNullable().defaultTo("pending");
    table.date("delivery_date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders");
}
