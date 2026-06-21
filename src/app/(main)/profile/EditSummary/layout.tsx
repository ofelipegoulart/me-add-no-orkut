import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/LeftSideBar/container-bar";

export default async function EditSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const displayName = session?.user?.name ?? "";
  const userId = session?.user?.userId ?? "";

  let avatarUrl = "";
  if (session?.user?.jwt) {
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
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} avatarUrl={avatarUrl} />
      </div>
      {children}
    </>
  );
}
