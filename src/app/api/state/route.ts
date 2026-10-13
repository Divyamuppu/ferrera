import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [s, q, t, r, c, p, sec] = await Promise.all([
      sql`select data from settings where id = 'main'`,
      sql`select key, label, url from quick_links`,
      sql`select id, tab, section_id as "sectionId", body, done, url, position::float8 as position, created_at::float8 as "createdAt" from tasks`,
      sql`select id, label, url, position::float8 as position from report_links`,
      sql`select id, tab, author_id as "authorId", body, created_at::float8 as "createdAt" from comments`,
      sql`select id, display_name as "displayName" from profiles`,
      sql`select id, tab, name, position::float8 as position, created_at::float8 as "createdAt" from sections`,
    ]);
    return NextResponse.json(
      {
        settings: s[0]?.data ?? null,
        quickLinks: q,
        tasks: t,
        reportLinks: r,
        comments: c,
        profiles: p,
        sections: sec,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[state]", e);
    return new NextResponse(String(e), { status: 500 });
  }
}
