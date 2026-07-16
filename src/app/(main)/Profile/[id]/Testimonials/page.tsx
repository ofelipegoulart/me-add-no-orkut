import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { TestimonialsBoard } from "@/components/pages/ProfilePage/Testimonials/TestimonialsBoard";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import { receivedTestimonialsLabel } from "@/lib/testimonial-labels";

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;
  const jwt = session?.user?.jwt;

  const { name, gender } = await loadSidebarProfile(jwt, id, isOwner);
  const profileName = isOwner
    ? session?.user?.name ?? name ?? ""
    : name ?? "";
  const heading = receivedTestimonialsLabel(isOwner, gender);

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-main">
        <div className="border border-orkut-border bg-white shadow-sm">
          <div className="px-2 pt-2">
            <h1 className="orkut-title text-black py-1.75 pb-1.25">
              {heading}
            </h1>
          </div>
          <div className="flex flex-row gap-1 px-2 pb-3 text-[12px]">
            <Link href="/Home">Início</Link>
            {profileName && (
              <>
                {" > "}
                <Link
                  href={`/Profile/${id}`}
                  className="text-orkut-link underline"
                >
                  {profileName}
                </Link>
              </>
            )}
            {" > "}
            <span className="text-[#5a5a5a]">depoimentos</span>
          </div>
          <div className="px-2 pb-3">
            <TestimonialsBoard userId={id} isOwner={isOwner} gender={gender} />
          </div>
        </div>
      </div>
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
