import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";

export default async function FotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <BigSharpShell title="Fotos" breadcrumbLabel="Fotos">
        <div className="text-[12px] text-[#5a5a5a]">
          Nenhuma foto adicionada ainda.
        </div>
      </BigSharpShell>
      <div className="orkut-col-right">
        <SidebarSocialBox>
          <OrkutFriends friends={FRIENDS} userId={id} title="amigos" />
        </SidebarSocialBox>
        <SidebarSocialBox>
          <OrkutCommunities communities={COMMUNITIES} userId={id} title="comunidades" />
        </SidebarSocialBox>
      </div>
    </div>
  );
}
