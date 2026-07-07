import Image from "next/image";
import { LogoutButton } from "./logout-button";
import { UniversalSearch } from "@/components/Search/UniversalSearch";

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
            <a href="/" className="header-logo-link">
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
            </a>
          </li>
          <li>
            <a href="/">Início</a>
          </li>
          <li>
            <a href={userId ? `/profile/${userId}` : "#"}>Perfil</a>
          </li>
          <li>
            <a href={`/profile/${userId}/recados`}>Página de recados</a>
          </li>
          <li>
            <a href="#">Amigos</a>
          </li>
          <li>
            <a href="#">Comunidades</a>
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
