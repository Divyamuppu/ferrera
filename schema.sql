-- Ferrera Social HQ — Neon (Postgres) schema
-- Run once: paste into the Neon SQL Editor, or `npm run db:setup`.

create table if not exists settings (
  id   text primary key,
  data jsonb not null default '{}'::jsonb
);

create table if not exists quick_links (
  key   text primary key,
  label text not null default '',
  url   text not null default ''
);

create table if not exists tasks (
  id         text primary key,
  tab        text not null,          -- weekly | socials | website | performance | build-discover | build-define | launch
  body       text not null default '',
  done       boolean not null default false,
  url        text not null default '',
  position   double precision not null default 0,
  created_at bigint not null,
  created_by text,
  section_id text                    -- Build › Discover / Define sections
);
create index if not exists tasks_tab_idx on tasks (tab);

create table if not exists sections (
  id         text primary key,
  tab        text not null,          -- build-discover | build-define
  name       text not null,
  position   double precision not null default 0,
  created_at bigint not null
);

create table if not exists report_links (
  id         text primary key,
  label      text not null default '',
  url        text not null default '',
  position   double precision not null default 0,
  created_at bigint not null
);

create table if not exists comments (
  id         text primary key,
  tab        text not null,          -- main tab; Build chat is shared by Discover + Define
  author_id  text not null,
  body       text not null,
  created_at bigint not null
);
create index if not exists comments_tab_idx on comments (tab);

create table if not exists profiles (
  id           text primary key,
  display_name text not null default '',
  created_at   bigint not null
);
