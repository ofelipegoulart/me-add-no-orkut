import type { ButtonHTMLAttributes, ReactNode } from "react";

const actionButtonClasses = {
  // Pílula clássica do orkut (lowercase, bold, 10px, azul-petróleo) — ver .orkut-btn-pill em globals.css
  pill: "orkut-btn-pill",
  white:
    "border border-orkut-border bg-white text-[12px] tracking-tight text-orkut-link-dark font-semibold rounded-[3px] cursor-pointer px-1 py-0 leading-[1.25] hover:bg-[#f5f8ff] active:bg-[#eef3fc] disabled:opacity-50 disabled:cursor-not-allowed",
  edit:
    "border border-[#a0b0c4] bg-white text-[13px] text-orkut-link-dark font-semibold rounded-[3px] cursor-pointer px-1 py-px leading-[1.25] disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

type OrkutActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof actionButtonClasses;
  children: ReactNode;
};

export function OrkutActionButton({
  variant = "pill",
  className = "",
  type = "button",
  children,
  ...props
}: OrkutActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${actionButtonClasses[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}