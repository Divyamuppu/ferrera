import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [s, q, t, r, c, p] = await Promise.all([
      sql`select data from settings where id = 'main'`,
      sql`select key, label, url from quick_links`,
      sql`select id, tab, body, done, url, position::float8 as position, created_at::float8 as "createdAt" from tasks`,
      sql`select id, label, url, position::float8 as position from report_links`,
      sql`select id, tab, author_id as "authorId", body, created_at::float8 as "createdAt" from comments`,
      sql`select id, display_name as "displayName" from profiles`,
    ]);
    return NextResponse.json(
      {
        settings: s[0]?.data ?? null,
        quickLinks: q,
        tasks: t,
        reportLinks: r,
        comments: c,
        profiles: p,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return new NextResponse(String(e), { status: 500 });
  }
}
