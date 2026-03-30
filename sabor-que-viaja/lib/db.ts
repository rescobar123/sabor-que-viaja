import knex, { type Knex } from "knex";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var __db: Knex | undefined;
}

function createDb(): Knex {
  return knex({
    client: "better-sqlite3",
    connection: {
      filename: path.resolve(process.cwd(), "db/sabor-que-viaja.sqlite"),
    },
    useNullAsDefault: true,
  });
}

// Reutilizar la instancia en desarrollo (hot reload)
const db: Knex = global.__db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  global.__db = db;
}

export default db;
