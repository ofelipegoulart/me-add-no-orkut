export function SmallSoftCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border border-orkut-border bg-white rounded-[6px] ${className}`.trim()}>
      {children}
    </div>
  );
}
