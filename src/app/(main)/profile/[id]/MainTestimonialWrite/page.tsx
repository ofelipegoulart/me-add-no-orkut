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
    redirect(`/profile/${id}`);
  }

  const { name } = await loadSidebarProfile(session?.user?.jwt, id);
  const profileName = name ?? "";

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      {/* Ocupa toda a largura que restou sem as colunas de amigos/comunidades */}
      <div className="orkut-col-full border border-orkut-border bg-white shadow-sm">
        <div className="px-3 py-2">
          {/* Título — negrito preto, ~18px */}
          <h1 className="font-[Arial,Helvetica,sans-serif] text-[18px] font-bold text-black leading-6 mb-1">
            Criar depoimento
          </h1>

          {/* Breadcrumb — abaixo do título */}
          <p className="orkut-edit-breadcrumb flex items-center mb-3">
            <a href="/Home">Início</a>
            {profileName && (
              <>
                <span className="orkut-breadcrumb-sep">&gt;</span>
                <a href={`/profile/${id}`}>{profileName}</a>
              </>
            )}
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <span>Criar depoimento</span>
          </p>

          <TestimonialWriteForm userId={id} profileName={profileName} />
        </div>
      </div>
    </div>
  );
}
