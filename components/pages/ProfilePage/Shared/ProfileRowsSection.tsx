import { ProfileInfoTabs, type ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";

export function ProfileRowsSection({ profileRowsByTab }: { profileRowsByTab: ProfileRowsByTab }) {
  return (
    <tr>
      <td className="pb-2">
        <ProfileInfoTabs rowsByTab={profileRowsByTab} />
      </td>
    </tr>
  );
}
