import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfileIndex() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  redirect(`/Profile/${session.user.userId}`);
}
