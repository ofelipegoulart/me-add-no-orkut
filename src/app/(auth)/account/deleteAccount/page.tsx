import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DeleteAccountGooglePage } from "@/components/pages/Account/DeleteAccountGooglePage";

export default async function DeleteAccountGoogleRoute() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  return <DeleteAccountGooglePage email={session.user.email ?? ""} />;
}
