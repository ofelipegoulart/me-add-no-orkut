export function BigAccentShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-orkut-border bg-white shadow-sm orkut-col-main-inner ${className}`.trim()}>
      {children}
    </div>
  );
}
