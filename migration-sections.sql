-- Run once in the Neon SQL Editor (adds sections to Discover / Define)
alter table tasks add column if not exists section_id text;

create table if not exists sections (
  id         text primary key,
  tab        text not null,
  name       text not null,
  position   double precision not null default 0,
  created_at bigint not null
);
