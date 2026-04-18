import Image from "next/image";

type OrkutHeaderProps = {
  email: string;
};

export function OrkutHeader({ email }: OrkutHeaderProps) {
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
            <a href="#">Início</a>
          </li>
          <li>
            <a href="#">Perfil</a>
          </li>
          <li>
            <a href="#">Página de recados</a>
          </li>
          <li>
            <a href="#">Amigos</a>
          </li>
          <li>
            <a href="#">Comunidades</a>
          </li>
        </ul>
        <ul className="header-user">
          <li>{email}</li>
          <li>
            <a href="#">Sair</a>
          </li>
          <li className="header-search-li">
            <label htmlFor="orkut-header-search" className="sr-only">
              Pesquisa do orkut
            </label>
            <input
              id="orkut-header-search"
              type="text"
              name="q"
              placeholder="pesquisa do orkut"
              className="header-search-input"
              autoComplete="off"
            />
          </li>
        </ul>
      </div>
    </header>
  );
}
