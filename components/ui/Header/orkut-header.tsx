import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { UniversalSearch } from "@/components/ui/Search/UniversalSearch";

type OrkutHeaderProps = {
  email: string;
  userId?: string;
};

export function OrkutHeader({ email, userId }: OrkutHeaderProps) {
  return (
    <header id="header">
      <div id="headerin">
        <ul className="header-nav">
          <li className="header-brand">
            <Link href="/" className="header-logo-link">
              <span className="header-logo-box">
                <Image
                  src="/icons/orkut_logo_sml.png"
                  alt="orkut"
                  width={43}
                  height={16}
                  className="header-logo-img"
                  priority
                />
              </span>
            </Link>
          </li>
          <li>
            <Link href="/">Início</Link>
          </li>
          <li>
            <Link href={userId ? `/Profile/${userId}` : "#"}>Perfil</Link>
          </li>
          <li>
            <Link href={`/Profile/${userId}/Scraps`}>Página de recados</Link>
          </li>
          <li>
            <Link href={`/Profile/${userId}/Friends`}>Amigos</Link>
          </li>
          <li>
            <Link href="/Communities">Comunidades</Link>
          </li>
        </ul>
        <ul className="header-user">
          <li><span className="orkut-tahoma tracking-wide text-[12px] text-white font-bold">{email}</span></li>
          <li>
            <LogoutButton />
          </li>
          <li className="header-search-li flex align-middle">
            <UniversalSearch variant="header" />
          </li>
        </ul>
      </div>
    </header>
  );
}
