import Link from "next/link";
import type { ReactNode } from "react";

/* =========================================================
   Card de miniatura reutilizável: foto linkada + nome
   centralizado (+ contagem opcional). Cobre o grid de
   amigos/comunidades (48px, fundo azul-claro) e o card das
   "comunidades relacionadas" (imagem flexível, fundo #f0f0f0).
   ========================================================= */

type ThumbCardProps = {
  href: string;
  src: string;
  name: ReactNode;
  count?: number;
  alt?: string;
  /** Elemento externo: célula de tabela ("td") ou bloco ("div", padrão). */
  as?: "div" | "td";
  /** Classes da célula externa (fundo, largura, padding). */
  className?: string;
  /** Lado da miniatura quadrada em px (padrão 48). `null` para imagem flexível. */
  size?: number | null;
  /** Classes do <img>. */
  imgClassName?: string;
  /** Wrapper opcional da imagem (ex.: área de altura fixa das relacionadas). */
  imgWrapClassName?: string;
  /** Classes do bloco do nome. */
  nameClassName?: string;
  /** Classes da contagem. */
  countClassName?: string;
};

export function ThumbCard({
  href,
  src,
  name,
  count,
  alt = "",
  as: Tag = "div",
  className = "",
  size = 48,
  imgClassName = "mx-auto border border-orkut-border",
  imgWrapClassName,
  nameClassName = "orkut-uname mt-1",
  countClassName = "text-[#8c8c8c]",
}: ThumbCardProps) {
  const img = (
    <Link href={href}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        {...(size ? { width: size, height: size } : {})}
        className={imgClassName}
      />
    </Link>
  );

  return (
    <Tag className={className}>
      {imgWrapClassName ? <div className={imgWrapClassName}>{img}</div> : img}
      <div className={nameClassName}>
        <Link href={href}>{name}</Link>
        {count != null && (
          <>
            {" "}
            <span className={countClassName}>({count})</span>
          </>
        )}
      </div>
    </Tag>
  );
}
