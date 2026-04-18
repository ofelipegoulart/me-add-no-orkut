import { ProfileContent } from "@/src/components/profile-content";

const DEFAULT_USERNAME = "felipe";

export default function Home() {
  return <ProfileContent username={DEFAULT_USERNAME} />;
}
