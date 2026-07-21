import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumDetailPage } from "@/components/pages/Albums/AlbumDetailPage";

export default async function HomeAlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  return (
    <AlbumDetailPage
      albumId={albumId}
      homeHref="/Home"
      albumListHref="/Home/AlbumList"
      isOwner
    />
  );
}
