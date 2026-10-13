import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql() {
  if (!_sql) {
    const url = (process.env.DATABASE_URL || "")
      .trim()
      .replace(/^psql\s+/, "")
      .replace(/^['"]|['"]$/g, "")
      .trim();
    if (!url) throw new Error("DATABASE_URL is not set.");
    if (!/^postgres(ql)?:\/\//.test(url))
      throw new Error("DATABASE_URL must start with postgresql://");
    _sql = neon(url);
  }
  return _sql;
}

// Lazy: connects only when a query runs, so builds don't need the env var.
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getSql()(strings, ...values)) as NeonQueryFunction<false, false>;