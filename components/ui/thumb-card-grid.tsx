import type { ReactNode } from "react";
import { ThumbCard } from "@/components/ui/thumb-card";

export type ThumbCardGridItem = {
  key: string;
  href: string;
  src: string;
  name: ReactNode;
  count?: number;
  countIcon?: string;
};

/**
 * Grade de 3 colunas usada pelos widgets "meus amigos", "minhas comunidades"
 * e "membros" da comunidade. Preenche a última linha com células vazias em vez
 * de deixar o card esticar, garantindo a mesma largura/altura mesmo quando a
 * linha final não tem os 3 itens.
 */
export function ThumbCardGrid({
  items,
  columns = 3,
  size,
}: {
  items: ThumbCardGridItem[];
  columns?: number;
  size?: number;
}) {
  const rows = Math.ceil(items.length / columns);

  return (
    <div className="-mx-0.75">
      <table
        className="w-full text-center border-separate border-spacing-0.75"
        cellPadding={0}
        cellSpacing={0}
      >
        <tbody>
          {Array.from({ length: rows }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: columns }, (_, col) => {
                const item = items[row * columns + col];
                return item ? (
                  <ThumbCard
                    as="td"
                    key={item.key}
                    className="align-top w-1/3 bg-orkut-tab-inactive px-3 py-4"
                    href={item.href}
                    src={item.src}
                    name={item.name}
                    count={item.count}
                    countIcon={item.countIcon}
                    {...(size != null ? { size } : {})}
                  />
                ) : (
                  <td key={col} className="align-top w-1/3" />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
