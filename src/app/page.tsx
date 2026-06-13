import ProfilePage from "./profile/[username]/page";

const DEFAULT_USERNAME = "felipe";

export default function Home() {
  return <ProfilePage params={{ username: DEFAULT_USERNAME }} />;
}
