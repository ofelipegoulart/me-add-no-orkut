import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumListPage } from "@/components/pages/Albums/AlbumListPage";

export default async function ProfileAlbumListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <AlbumListPage
        homeHref="/Home"
        albumListHref={`/Profile/${id}/AlbumList`}
        isOwner={isOwner}
        userId={id}
      />
    </div>
  );
}
