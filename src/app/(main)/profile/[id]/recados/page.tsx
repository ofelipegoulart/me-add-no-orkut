import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import type { Scrap } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { MarkScrapsRead } from "@/components/pages/Scraps/mark-scraps-read";
import { ScrapsList } from "@/components/pages/Scraps/scraps-list";

export default async function RecadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  let scraps: Scrap[] = [];
  let totalCount = 0;

  if (session?.user?.jwt) {
    try {
      const res = await fetch(`${process.env.API_URL}/users/${id}/scraps?page=0&size=50`, {
        headers: { Authorization: `Bearer ${session.user.jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        scraps = data.content ?? [];
        totalCount = data.totalElements ?? scraps.length;
      }
    } catch {
      // fallback to empty
    }
  }

  const unreadIds = scraps.filter((s) => s.readAt === null).map((s) => s.id);

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <MarkScrapsRead scrapIds={unreadIds} />
      <div className="orkut-col-main flex flex-col gap-1.25">
        <ScrapsList initialScraps={scraps} ownerId={id} totalCount={totalCount} />
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutFriends friends={FRIENDS} userId={id} />
        </div>
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutCommunities communities={COMMUNITIES} userId={id} />
        </div>
      </div>
    </div>
  );
}
