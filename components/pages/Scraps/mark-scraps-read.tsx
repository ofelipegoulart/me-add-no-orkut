"use client";

import { useEffect } from "react";

export function MarkScrapsRead({ scrapIds }: { scrapIds: string[] }) {
  useEffect(() => {
    if (scrapIds.length === 0) return;

    fetch("/api/scraps/mark-read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: scrapIds }),
    });
  }, [scrapIds]);

  return null;
}
