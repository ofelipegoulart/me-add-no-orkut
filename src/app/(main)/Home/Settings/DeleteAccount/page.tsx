import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { DeleteAccountNoticePage } from "@/components/pages/Settings/DeleteAccountNoticePage";

export default function HomeSettingsDeleteAccountRoute() {
  return (
    <div className="flex justify-center">
      <BigSoftShell>
        <DeleteAccountNoticePage />
      </BigSoftShell>
    </div>
  );
}
