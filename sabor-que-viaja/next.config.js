/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["knex", "better-sqlite3"],
  },
};

module.exports = nextConfig;
