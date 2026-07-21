import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { SettingsPage } from "@/components/pages/Settings/settings-page";

export default async function HomeSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  return (
    <BigSoftShell>
      <SettingsPage />
    </BigSoftShell>
  );
}
