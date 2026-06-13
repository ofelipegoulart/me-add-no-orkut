import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/Social/orkut-communities";
import OrkutFriends from "@/components/Social/orkut-friends";
import { OrkutMainColumn } from "@/components/ProfilePage/main-column";

function displayNameFromUsername(username: string) {
  try {
    return decodeURIComponent(username)
      .replace(/\+/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  } catch {
    return username;
  }
}

export default async function ProfilePage({ params }: any) {
  const { username } = await params;
  const displayName = displayNameFromUsername(username);

  return (
    <div className="min-h-screen w-full bg-[#d4e0ef]">
      <div className="orkut-col-main border border-[#bcd2e8] bg-white shadow-sm">
        <OrkutMainColumn displayName={displayName} />
      </div>
      <div className="orkut-col-right">
        <div className="border border-[#bcd2e8] bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutFriends friends={FRIENDS} />
        </div>
        <div className="border border-[#bcd2e8] bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutCommunities communities={COMMUNITIES} />
        </div>
      </div>
    </div>
  );
}
