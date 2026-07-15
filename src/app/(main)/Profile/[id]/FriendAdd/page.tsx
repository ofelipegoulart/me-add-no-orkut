import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getProfileOverviewServer,
  getReceivedFriendRequestsServer,
  getSentFriendRequestsServer,
} from "@/lib/profile-service-server";
import { FriendAddForm } from "@/components/pages/ProfilePage/FriendAdd/FriendAddForm";

export default async function FriendAddPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.jwt) {
    redirect("/account");
  }

  const jwt = session.user.jwt;
  const viewerId = session.user.userId;

  // Não faz sentido enviar pedido para si mesmo.
  if (viewerId === id) {
    redirect(`/Profile/${id}`);
  }

  let targetName = "Usuário";
  // Se já são amigos ou já há pedido pendente, o fluxo é resolvido no botão do
  // perfil — nada a enviar aqui. Decidimos fora do try para não confundir o
  // erro especial que `redirect()` lança com uma falha de rede.
  let backToProfile = false;
  try {
    const overview = await getProfileOverviewServer(jwt, { userId: id });
    targetName = overview.user.name;

    if (overview.friends?.some((f) => f.id === viewerId)) {
      backToProfile = true;
    } else {
      const [received, sent] = await Promise.all([
        getReceivedFriendRequestsServer(jwt),
        getSentFriendRequestsServer(jwt),
      ]);
      backToProfile =
        received.some((r) => r.userId === id) ||
        sent.some((r) => r.userId === id);
    }
  } catch {
    // Falha ao buscar dados: segue com nome genérico, o form ainda funciona.
  }

  if (backToProfile) {
    redirect(`/Profile/${id}`);
  }

  return (
    <div className="orkut-col-full">
      <FriendAddForm targetUserId={id} targetName={targetName} />
    </div>
  );
}
