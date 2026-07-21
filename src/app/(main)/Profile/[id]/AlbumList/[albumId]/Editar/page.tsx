import { AlbumEditPage } from "@/components/pages/Albums/AlbumEditPage";

// A barra lateral do perfil vem do layout de Profile/[id], que já envolve
// esta rota — não deve ser renderizada de novo aqui.
export default async function ProfileAlbumEditPage({
  params,
}: {
  params: Promise<{ id: string; albumId: string }>;
}) {
  const { id, albumId } = await params;

  return (
    <AlbumEditPage
      albumId={albumId}
      homeHref="/Home"
      albumHref={`/Profile/${id}/AlbumList/${albumId}`}
    />
  );
}
