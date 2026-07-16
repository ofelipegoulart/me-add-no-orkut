import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";

export function CommunityJoinConfirmCard({
  pending,
  error,
  onConfirm,
  onCancel,
}: {
  pending: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <SmallSoftCard className="mb-2 text-left px-3 pt-3 pb-2.5">
      <p className="text-[12px] mb-1">Tem certeza de que deseja participar desta comunidade?</p>
      <div className="orkut-divider" />
      {error && <p className="text-[11px] text-red-600 mb-3">{error}</p>}
      <div className="flex items-center justify-start gap-2 mt-1.5">
        <OrkutActionButton onClick={onConfirm} disabled={pending}>
          participar
        </OrkutActionButton>
        <OrkutActionButton onClick={onCancel} disabled={pending}>
          cancelar
        </OrkutActionButton>
      </div>
    </SmallSoftCard>
  );
}
