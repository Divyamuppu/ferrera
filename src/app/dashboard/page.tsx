"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";

// No login: each browser gets a stable random id so chat knows who said what.
export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = "";
    try {
      id = localStorage.getItem("ferrera-uid") || "";
    } catch {}
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      try {
        localStorage.setItem("ferrera-uid", id);
      } catch {}
    }
    setUserId(id);
  }, []);

  if (!userId) {
    return (
      <div className="login">
        <div className="login-card">
          <img src="/ferrera-logo.png" alt="Ferrera" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return <Dashboard userId={userId} />;
}
