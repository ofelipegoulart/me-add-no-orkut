const FOOTER_LINKS = [
  { label: "Sobre orkut", href: "#" },
  { label: "Acesse orkut.com", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Desenvolvedores", href: "#" },
  { label: "Central de segurança", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "Publicidade", href: "#" },
  { label: "Ajuda", href: "#" },
];

export function OrkutFooter() {
  return (
    <div className="w-full max-w-250.75 mx-auto px-2 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-orkut-border pt-2 text-[10px]">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="orkut-tahoma font-bold text-orkut-accent-pink text-[13px]">
            orkut
          </span>
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-orkut-link-dark">
              {link.label}
            </a>
          ))}
        </div>
        <img src="/logos/google_transparent.gif" alt="Google" className="h-4" />
      </div>
    </div>
  );
}
