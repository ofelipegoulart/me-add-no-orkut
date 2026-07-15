"use client";

import { useState } from "react";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";

export function CommunityModerationNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-orkut-notice border border-orkut-notice-border px-3 py-2 mb-2">
      <p className="text-[11px] text-black m-0 mb-1.5">
        Sua participação nesta comunidade depende da aprovação do moderador.
      </p>
      <OrkutActionButton onClick={() => setVisible(false)}>
        ocultar
      </OrkutActionButton>
    </div>
  );
}
