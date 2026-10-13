import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  let op: string, p: any;
  try {
    ({ op, p } = await req.json());
  } catch {
    return new NextResponse("Bad JSON", { status: 400 });
  }
  const now = Date.now();

  try {
    switch (op) {
      case "ensureProfile":
        await sql`insert into profiles (id, display_name, created_at)
                  values (${p.id}, '', ${now}) on conflict (id) do nothing`;
        break;
      case "setName":
        await sql`insert into profiles (id, display_name, created_at)
                  values (${p.id}, ${String(p.name).slice(0, 40)}, ${now})
                  on conflict (id) do update set display_name = excluded.display_name`;
        break;

      case "saveSettings":
        await sql`insert into settings (id, data) values ('main', ${JSON.stringify(p)}::jsonb)
                  on conflict (id) do update set data = settings.data || excluded.data`;
        break;
      case "saveQuickLink":
        await sql`insert into quick_links (key, label, url) values (${p.key}, ${p.label}, ${p.url})
                  on conflict (key) do update set label = excluded.label, url = excluded.url`;
        break;

      case "addTask":
        await sql`insert into tasks (id, tab, body, done, url, position, created_at, created_by)
                  values (${p.id}, ${p.tab}, ${p.body}, false, '', ${p.position}, ${p.createdAt}, ${p.createdBy})`;
        break;
      case "updateTask":
        await sql`update tasks set
                    done = coalesce(${p.done ?? null}::boolean, done),
                    body = coalesce(${p.body ?? null}::text, body),
                    url  = coalesce(${p.url ?? null}::text, url)
                  where id = ${p.id}`;
        break;
      case "deleteTask":
        await sql`delete from tasks where id = ${p.id}`;
        break;
      case "clearCompleted":
        await sql`delete from tasks where tab = ${p.tab} and done = true`;
        break;

      case "addReport":
        await sql`insert into report_links (id, label, url, position, created_at)
                  values (${p.id}, ${p.label}, ${p.url}, ${p.position}, ${p.createdAt})`;
        break;
      case "editReport":
        await sql`update report_links set label = ${p.label}, url = ${p.url} where id = ${p.id}`;
        break;
      case "deleteReport":
        await sql`delete from report_links where id = ${p.id}`;
        break;

      case "addComment":
        await sql`insert into comments (id, tab, author_id, body, created_at)
                  values (${p.id}, ${p.tab}, ${p.authorId}, ${p.body}, ${p.createdAt})`;
        break;
      case "editComment":
        await sql`update comments set body = ${p.body} where id = ${p.id} and author_id = ${p.authorId}`;
        break;
      case "deleteComment":
        await sql`delete from comments where id = ${p.id} and author_id = ${p.authorId}`;
        break;

      default:
        return new NextResponse("Unknown op", { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse(String(e), { status: 500 });
  }
}
