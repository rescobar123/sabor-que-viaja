import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Reemplazar la columna enum plan_type por string sin restricción
  await knex.schema.alterTable("subscriptions", (table) => {
    table.string("plan_type_new").nullable();
  });
  await knex.raw(`UPDATE subscriptions SET plan_type_new = plan_type::text`);
  await knex.schema.alterTable("subscriptions", (table) => {
    table.dropColumn("plan_type");
  });
  await knex.schema.alterTable("subscriptions", (table) => {
    table.renameColumn("plan_type_new", "plan_type");
  });
}

export async function down(knex: Knex): Promise<void> {
  // No revertimos — evitar pérdida de datos con valores fuera de ['30','60']
}
