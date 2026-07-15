import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { TestimonialsBoard } from "@/components/pages/ProfilePage/Testimonials/TestimonialsBoard";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function HomeTestimonialsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;
  const displayName = session.user.name ?? "Usuário";

  const { avatarUrl, infoLines, gender } = await loadSidebarProfile(
    session.user.jwt,
    userId,
    true,
  );

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile
          userId={userId}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </div>
      {/* Ocupa toda a largura que restou, igual à página de Criar depoimento. */}
      <div className="orkut-col-full border border-orkut-border bg-white shadow-sm">
        <div className="orkut-edit-page">
          <h2 className="orkut-edit-title">Meus depoimentos</h2>
          <p className="orkut-edit-breadcrumb">
            <Link href="/Home">Início</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            Meus depoimentos
          </p>

          <TestimonialsBoard userId={userId} isOwner gender={gender} />
        </div>
      </div>
    </div>
  );
}
