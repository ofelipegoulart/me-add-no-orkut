import { ProfileInfoTabs, type ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";

export function ProfileRowsSection({ profileRowsByTab }: { profileRowsByTab: ProfileRowsByTab }) {
  return (
    <tr>
      <td className="pb-2">
        <div className="border-t border-orkut-border"></div>
        <ProfileInfoTabs rowsByTab={profileRowsByTab} />
      </td>
    </tr>
  );
}
