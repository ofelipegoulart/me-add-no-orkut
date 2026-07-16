export function BigSharpShell({
  title,
  breadcrumbLabel,
  homeHref = "#",
  full = false,
  children,
}: {
  title: React.ReactNode;
  breadcrumbLabel: React.ReactNode;
  homeHref?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${full ? "orkut-col-full" : "orkut-col-main"} overflow-hidden rounded-sm border border-orkut-border bg-white shadow-sm`}
    >
      <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td className="pb-2 px-2 pt-2">
              <h1 className="orkut-title text-black py-1.75 pb-1.25">{title}</h1>
            </td>
          </tr>
          <tr>
            <td className="px-2 pb-3">
              <p className="orkut-breadcrumb">
                <a href={homeHref}>Início</a>
                <span className="orkut-breadcrumb-sep">&gt;</span>
                {breadcrumbLabel}
              </p>
            </td>
          </tr>
          <tr>
            <td className="px-2 pb-4">{children}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
