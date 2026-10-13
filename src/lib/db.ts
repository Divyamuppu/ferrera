import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;
let _sql: Sql | null = null;
let _ready: Promise<void> | null = null;

function getSql(): Sql {
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

function ensureSchema(db: Sql) {
  if (!_ready) {
    _ready = (async () => {
      await db`create table if not exists settings (id text primary key, data jsonb not null default '{}'::jsonb)`;
      await db`create table if not exists quick_links (key text primary key, label text not null default '', url text not null default '')`;
      await db`create table if not exists tasks (id text primary key, tab text not null, body text not null default '', done boolean not null default false, url text not null default '', position double precision not null default 0, created_at bigint not null, created_by text)`;
      await db`alter table tasks add column if not exists section_id text`;
      await db`create table if not exists sections (id text primary key, tab text not null, name text not null, position double precision not null default 0, created_at bigint not null)`;
      await db`create table if not exists report_links (id text primary key, label text not null default '', url text not null default '', position double precision not null default 0, created_at bigint not null)`;
      await db`create table if not exists comments (id text primary key, tab text not null, author_id text not null, body text not null, created_at bigint not null)`;
      await db`create table if not exists profiles (id text primary key, display_name text not null default '', created_at bigint not null)`;
    })().catch((e) => {
      _ready = null;
      throw e;
    });
  }
  return _ready;
}

export const sql = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
  const db = getSql();
  await ensureSchema(db);
  return db(strings, ...values);
}) as unknown as Sql;
