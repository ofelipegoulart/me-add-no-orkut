import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CommunitiesPage from "@/components/pages/Community/CommunitiesPage";

// Landing "Comunidades" (link do menu principal). A barra lateral do
// perfil e o shell vêm do layout do grupo de rotas (loggedSidebar).
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/account");
  }

  return <CommunitiesPage />;
}
