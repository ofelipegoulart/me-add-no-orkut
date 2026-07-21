import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumEditPage } from "@/components/pages/Albums/AlbumEditPage";

export default async function HomeAlbumEditPage({
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
    <AlbumEditPage
      albumId={albumId}
      homeHref="/Home/AlbumList"
      albumHref={`/Home/AlbumList/${albumId}`}
    />
  );
}
