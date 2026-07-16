export function BigSoftCard({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-orkut-border bg-white shadow-sm rounded-lg orkut-tahoma text-[#5a5a5a] p-1.5">
      <h2 className="text-[16px] font-semibold text-black tracking-normal">{title}</h2>
      {children}
    </div>
  );
}
