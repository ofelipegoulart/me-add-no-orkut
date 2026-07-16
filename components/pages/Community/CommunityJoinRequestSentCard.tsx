import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";

export function CommunityJoinRequestSentCard({ onBack }: { onBack: () => void }) {
  return (
    <SmallSoftCard className="mb-2 px-3 pt-3 pb-2.5">
      <p
        style={{ fontFamily: "Tahoma, Verdana, Arial, sans-serif" }}
        className="text-[12px] font-bold text-black m-0 mb-2"
      >
        Solicitação enviada
      </p>
      <p className="bg-orkut-panel-alt text-[12px] text-black m-0 p-2">
        Uma solicitação de participação foi enviada ao moderador.
      </p>
      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-[10px] font-bold text-orkut-link underline whitespace-nowrap cursor-pointer border-0 bg-transparent p-0"
        >
          « voltar para a comunidade
        </button>
      </div>
    </SmallSoftCard>
  );
}
