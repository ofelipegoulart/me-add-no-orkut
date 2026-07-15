// Aba sem suporte no backend ainda (sem conceito de moderador/co-proprietário,
// sem cruzamento de amigos x membros). Mantém a navegação completa visível sem
// inventar dado que a API não tem.
export function CommunityComingSoonTab({ message }: { message: string }) {
  return (
    <div className="px-2 py-8 text-center text-[12px] text-[#7b7b7b]">
      {message}
    </div>
  );
}
