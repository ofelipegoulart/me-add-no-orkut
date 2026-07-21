import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumsMeuAlbumPage } from "@/components/pages/Albums/AlbumsMeuAlbumPage";

export default async function HomeAlbumAddPhotosPage({
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
    <AlbumsMeuAlbumPage
      albumId={albumId}
      homeHref="/Home"
      albumListHref="/Home/AlbumList"
      albumHref={`/Home/AlbumList/${albumId}`}
    />
  );
}
