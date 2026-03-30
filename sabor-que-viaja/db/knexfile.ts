import type { Knex } from "knex";
import path from "path";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: path.resolve(process.cwd(), "db/sabor-que-viaja.sqlite"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(process.cwd(), "db/migrations"),
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.resolve(process.cwd(), "db/migrations"),
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;
