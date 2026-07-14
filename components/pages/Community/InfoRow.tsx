import type { ReactNode } from "react";

// Linha da ficha (label 25% à direita / valor 73%), alternando fundo.
export function InfoRow({
  label,
  children,
  alt,
}: {
  label: string;
  children: ReactNode;
  alt: boolean;
}) {
  return (
    <div className={`flow-root p-0.5 ${alt ? "bg-orkut-panel-alt" : "bg-orkut-panel"}`}>
      <p className="float-left w-1/4 text-right pr-[2%] m-0 text-[12px] leading-[17px] text-[#676767]">
        {label}
      </p>
      <p className="float-left w-[73%] m-0 text-[12px] leading-[17px] text-black">{children}</p>
    </div>
  );
}
