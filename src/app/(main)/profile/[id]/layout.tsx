import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/Sidebar/container-bar";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const displayName = session?.user?.name ?? "";
  const isOwnProfile = session?.user?.userId === id;

  let avatarUrl = "";
  if (isOwnProfile && session?.user?.jwt) {
    try {
      const res = await fetch(`${process.env.API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${session.user.jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        avatarUrl = data.avatar ?? "";
      }
    } catch {}
  }

  return (
    <>
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar displayName={displayName} isOwnProfile={isOwnProfile} userId={id} avatarUrl={avatarUrl} />
      </div>
      {children}
    </>
  );
}
