import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrkutHeader } from "@/components/Header/orkut-header";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email ?? "";

  return (
    <>
      <OrkutHeader email={email} userId={session?.user?.userId} />
      <div className="min-h-screen w-full bg-orkut-bg">
        <div className="orkut-shell">
          <div className="flow-root">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
