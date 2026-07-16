import type { ReactNode } from "react";

type ProfileCardProps = {
  title: string;
  children: ReactNode;
};

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-1">
            <h1 className="orkut-title text-black py-1.75 pb-1.25">{title}</h1>
          </td>
        </tr>
        {children}
      </tbody>
    </table>
  );
}
