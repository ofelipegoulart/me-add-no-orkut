import { EditProfilePage } from "@/components/pages/EditProfile/edit-profile-page";

export default function EditProfileRoute() {
  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-main border border-orkut-border bg-white" style={{ width: "100%", float: "none" }}>
        <EditProfilePage />
      </div>
    </div>
  );
}
