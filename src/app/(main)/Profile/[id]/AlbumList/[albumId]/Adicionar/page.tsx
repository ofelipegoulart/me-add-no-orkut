import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumsMeuAlbumPage } from "@/components/pages/Albums/AlbumsMeuAlbumPage";

// A barra lateral do perfil vem do layout de Profile/[id], que já envolve
// esta rota — não deve ser renderizada de novo aqui.
export default async function ProfileAlbumAddPhotosPage({
  params,
}: {
  params: Promise<{ id: string; albumId: string }>;
}) {
  const { id, albumId } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;

  return (
    <AlbumsMeuAlbumPage
      albumId={albumId}
      homeHref="/Home"
      albumListHref={`/Profile/${id}/AlbumList`}
      albumHref={`/Profile/${id}/AlbumList/${albumId}`}
      isOwner={isOwner}
    />
  );
}
