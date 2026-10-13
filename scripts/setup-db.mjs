// Creates the tables in your Neon database from schema.sql.
// Usage: DATABASE_URL=... npm run db:setup   (or put it in .env.local and run with --env-file)
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL first (your Neon connection string).");
  process.exit(1);
}
const sql = neon(url);
const statements = readFileSync(new URL("../schema.sql", import.meta.url), "utf8")
  .split(/;\s*$/m)
  .map((s) => s.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

for (const s of statements) await sql.query(s);
console.log(`Done — ${statements.length} statements applied.`);
