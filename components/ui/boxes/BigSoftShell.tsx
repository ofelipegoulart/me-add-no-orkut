export function BigSoftShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`orkut-col-full border border-orkut-border bg-white shadow-sm ${className}`.trim()}>
      {children}
    </div>
  );
}
