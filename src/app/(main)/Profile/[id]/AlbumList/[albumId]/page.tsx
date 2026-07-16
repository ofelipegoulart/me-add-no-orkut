import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumDetailPage } from "@/components/pages/Albums/AlbumDetailPage";

export default async function ProfileAlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string; albumId: string }>;
}) {
  const { id, albumId } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <AlbumDetailPage
        albumId={albumId}
        homeHref="/Home"
        albumListHref={`/Profile/${id}/AlbumList`}
        isOwner={isOwner}
      />
    </div>
  );
}
