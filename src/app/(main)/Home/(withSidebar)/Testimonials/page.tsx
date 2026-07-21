import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { TestimonialsBoard } from "@/components/pages/ProfilePage/Testimonials/TestimonialsBoard";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function HomeTestimonialsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;

  const { gender } = await loadSidebarProfile(session.user.jwt, userId, true);

  return (
    // Ocupa toda a largura que restou, igual à página de Criar depoimento.
    <BigSoftShell>
      <div className="orkut-edit-page">
        <h2 className="orkut-title">Meus depoimentos</h2>
        <p className="orkut-breadcrumb">
          <Link href="/Home">Início</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          Meus depoimentos
        </p>

        <TestimonialsBoard userId={userId} isOwner gender={gender} />
      </div>
    </BigSoftShell>
  );
}
