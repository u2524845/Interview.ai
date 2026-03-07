"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";

export function ProBadge() {
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan === "pro" ? "pro" : "free"))
      .catch(() => setPlan("free"));
  }, []);

  if (plan === "pro") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-bg text-white text-xs font-bold">
        <Crown className="h-3 w-3" />
        Pro
      </div>
    );
  }

  if (plan === "free") {
    return (
      <Link href="/upgrade">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/40 text-primary text-xs font-medium hover:bg-primary/10 transition-colors cursor-pointer">
          <Crown className="h-3 w-3" />
          Upgrade
        </div>
      </Link>
    );
  }

  return null;
}
