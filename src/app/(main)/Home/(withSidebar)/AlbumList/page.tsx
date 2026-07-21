import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlbumListPage } from "@/components/pages/Albums/AlbumListPage";

export default async function HomeAlbumListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;

  return <AlbumListPage homeHref="/Home" albumListHref="/Home/AlbumList" userId={userId} />;
}
