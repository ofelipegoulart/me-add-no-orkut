export function CommunityHeaderBlock({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: React.ReactNode;
}) {
  return (
    <div className="pt-[7px] pl-3 pr-2 pb-[5px]">
      <h1 className="orkut-title">{title}</h1>
      <p className="text-[11px] leading-3.5 text-[#7b7b7b] m-0 pt-0.5">{breadcrumb}</p>
    </div>
  );
}
