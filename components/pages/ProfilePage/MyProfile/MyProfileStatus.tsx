"use client";

import { useState } from "react";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { updateStatusMessage } from "@/lib/profile-service";

const MAX_LENGTH = 140;

export function MyProfileStatus({
  statusMessage = null,
}: {
  statusMessage?: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(statusMessage ?? "");
  const [savedMessage, setSavedMessage] = useState(statusMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setValue(savedMessage ?? "");
    setError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const trimmed = value.trim();
      await updateStatusMessage({ statusMessage: trimmed || null });
      setSavedMessage(trimmed || null);
      setEditing(false);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td className="pb-2">
        <div className="flex items-center gap-2 border border-orkut-border bg-white px-2 py-0.5 leading-tight">
          {editing ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={MAX_LENGTH}
              autoFocus
              disabled={saving}
              className="flex-1 border border-[#a0b0c4] bg-white px-1 font-[Tahoma] text-[12px] leading-tight tracking-[1.25px] text-black outline-none"
            />
          ) : (
            <span className="flex-1 font-[Tahoma] text-[12px] leading-tight tracking-[1.25px] text-[#999]">
              {savedMessage || "Defina seu status aqui"}
            </span>
          )}

          {editing ? (
            <>
              <OrkutActionButton onClick={handleSave} disabled={saving}>
                {saving ? "salvando..." : "salvar"}
              </OrkutActionButton>
              <OrkutActionButton onClick={handleCancel} disabled={saving}>
                cancelar
              </OrkutActionButton>
            </>
          ) : (
            <OrkutActionButton onClick={handleEdit}>editar</OrkutActionButton>
          )}
        </div>
        {error && <div className="pt-1 text-[11px] text-[#c00]">{error}</div>}
      </td>
    </tr>
  );
}
