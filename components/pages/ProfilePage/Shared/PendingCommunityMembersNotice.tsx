import Link from "next/link";

export function PendingCommunityMembersNotice({
  communityId,
}: {
  communityId: string;
}) {
  return (
    <div className="bg-orkut-notice border border-orkut-notice-border px-3 py-2 mb-2">
      <p className="text-[11px] text-black m-0">
        As suas comunidades têm membros pendentes.
      </p>
      <Link
        href={`/Community/${communityId}/membros?tab=pending`}
        className="text-[11px] text-orkut-link-dark underline"
      >
        Aprovar ou recusar membros pendentes
      </Link>
    </div>
  );
}
