import type { ReactNode } from "react";

type ProfileCardProps = {
  title: string;
  children: ReactNode;
};

const headingClassName = [
  "m-0",
  "py-1.75 pb-1.25",
  "font-[Arial,Helvetica,sans-serif]",
  "text-[22px] font-normal leading-7 text-black",
].join(" ");

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td className="pb-1">
            <h1 className={headingClassName}>{title}</h1>
          </td>
        </tr>
        {children}
      </tbody>
    </table>
  );
}
