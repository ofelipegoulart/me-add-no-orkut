import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TestimonialWriteForm } from "@/components/pages/ProfilePage/Testimonials/TestimonialWriteForm";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function MainTestimonialWritePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // Não faz sentido escrever um depoimento sobre si mesmo.
  if (session?.user?.userId === id) {
    redirect(`/Profile/${id}`);
  }

  const { name } = await loadSidebarProfile(session?.user?.jwt, id);
  const profileName = name ?? "";

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      {/* Ocupa toda a largura que restou sem as colunas de amigos/comunidades */}
      <div className="orkut-col-full border border-orkut-border bg-white shadow-sm">
        <div className="orkut-edit-page">
          <h2 className="orkut-edit-title">Criar depoimento</h2>
          <p className="orkut-edit-breadcrumb">
            <Link href="/Home">Início</Link>
            {profileName && (
              <>
                <span className="orkut-breadcrumb-sep">&gt;</span>
                <Link href={`/Profile/${id}`}>{profileName}</Link>
              </>
            )}
            <span className="orkut-breadcrumb-sep">&gt;</span>
            Criar depoimento
          </p>

          <TestimonialWriteForm userId={id} profileName={profileName} />
        </div>
      </div>
    </div>
  );
}
