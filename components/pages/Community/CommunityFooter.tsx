const FOOTER_LINKS = [
  "Sobre o orkut",
  "Blog",
  "Desenvolvedores",
  "Central de Segurança",
  "Privacidade",
  "Termos",
  "Anunciar",
  "Ajuda",
];

export function CommunityFooter() {
  return (
    <div className="clear-both text-[10px] leading-[33px] pt-2 border-t border-orkut-border mt-2">
      <span className="float-right text-[#999] font-bold pr-1">Google</span>
      <span className="orkut-tahoma text-orkut-accent-pink font-bold pl-1">orkut</span>
      {FOOTER_LINKS.map((l) => (
        <span key={l}>
          {"  |  "}
          <a href="#" className="text-orkut-link">{l}</a>
        </span>
      ))}
    </div>
  );
}
