// Client-side helpers for talking to the Neon-backed API routes.

export async function api(op: string, p: unknown): Promise<void> {
  const r = await fetch("/api/mutate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op, p }),
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function fetchState() {
  const r = await fetch("/api/state", { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
