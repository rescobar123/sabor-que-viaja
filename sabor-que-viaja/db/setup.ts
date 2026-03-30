/**
 * Script de inicialización de la base de datos.
 * Ejecuta: npx tsx db/setup.ts
 */
import knex from "knex";
import path from "path";
import fs from "fs";

async function setup() {
  const dbPath = path.resolve(process.cwd(), "db/sabor-que-viaja.sqlite");

  const db = knex({
    client: "better-sqlite3",
    connection: { filename: dbPath },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(process.cwd(), "db/migrations"),
    },
  });

  console.log("🔧 Ejecutando migraciones...");
  await db.migrate.latest();
  console.log("✅ Base de datos lista en:", dbPath);
  console.log("📊 Tablas creadas: users, subscriptions, orders");

  await db.destroy();
}

setup().catch((err) => {
  console.error("❌ Error en setup:", err);
  process.exit(1);
});
