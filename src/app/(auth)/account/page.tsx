export default function LoginPage() {
  //TODO: login e senha incorretos: O nome de usuário e senha são incorretos,
  // colocar em vermelho e embaixo do input da senha
  
  return (
    <div
      className="min-h-screen bg-[#D4DDED] p-[10px] text-xs text-black"
      style={{ fontFamily: "Verdana, Arial, sans-serif" }}
    >
      <div className="flex gap-[10px] w-full">
        {/* Left panel */}
        <div className="bg-white flex-1 flex flex-col items-center justify-center h-80">
          <div className="text-center">
            <img
              src="logos/orkut_logo.gif"
              alt="Who do you know?"
              title="Who do you know?"
              className="border-0 mx-auto"
            />
          </div>
          <div className="px-5 py-[10px] leading-[1.5em] text-xs text-center">
            <b className="text-[#B11E89]">Conecte-se</b> com amigos e familiares
            usandoo recados e mensagens instantâneas <br />
            <b className="text-[#B11E89]">Conheça</b> novas pessoas através de
            amigos de seus amigos e comunidades <br />
            <b className="text-[#B11E89]">Compartilhe</b> seus vídeos, fotos e
            paixões em um só lugar
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-[3px] w-[264px] flex flex-col">
          <div id="gaia_loginbox" className="flex-1 bg-[#E8EEFA] text-center px-6">
            <form
              id="gaia_loginform"
              action=""
              method="post"
            >
              <div
                id="gaia_table"
                className="mx-auto inline-grid grid-cols-[auto_auto] gap-x-0 gap-y-1 py-2"
              >
                <div className="col-span-2">
                  <span className="text-xs">Acesse o seu orkut com sua</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <b className="text-sm">Conta do</b>
                    <img
                      src="logos/google_transparent.gif"
                      alt="Google"
                      className="mt-0.5"
                    />
                  </div>
                </div>

                <div className="text-right whitespace-nowrap pr-1">
                  <span className="font-sans text-xs">E-mail:</span>
                </div>
                <input
                  type="text"
                  name="Email"
                  id="Email"
                  size={15}
                  defaultValue=""
                  className="font-sans text-xs border border-[#767676] px-0.5 py-px"
                  style={{ backgroundColor: 'white' }}
                />
                <div className="text-right pr-1">
                  <span className="font-sans text-xs">Senha:</span>
                </div>
                <input
                  type="password"
                  name="Passwd"
                  id="Passwd"
                  size={15}
                  className="font-sans text-xs border border-[#767676] px-0.5 py-px"
                  style={{ backgroundColor: 'white' }}
                />

                <div className="text-right self-start pt-0.5 pr-1">
                  <input
                    type="checkbox"
                    name="PersistentCookie"
                    id="PersistentCookie"
                    value="yes"
                  />
                  <input type="hidden" name="rmShown" value="1" />
                </div>
                <div className="text-left">
                  <label
                    htmlFor="PersistentCookie"
                    className="font-sans text-xs"
                  >
                    Salvar as minhas informações neste computador
                  </label>
                  <br />
                  <span className="text-[#667788] mt-[3px] text-[10px] text-left">
                    Não use em computadores públicos. [
                    <a
                      className="text-[#0047BE] underline hover:text-[#C40098]"
                      href=""
                    >
                      ?
                    </a>
                    ]
                  </span>
                </div>

                <div></div>
                <div className="text-left">
                  <input
                    type="submit"
                    className="font-sans text-xs cursor-pointer border border-[#767676] bg-[#ECECEC] px-1.5 py-px"
                    name="login"
                    value="Login"
                  />
                </div>

                <div
                  id="ga-fprow"
                  className="col-span-2 h-[33px] font-sans text-[70%] text-center flex items-end justify-center pb-1"
                >
                  <a
                    className="text-[#0047BE] underline hover:text-[#C40098]"
                    href="account/forgotPasswd"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>
            </form>
          </div>

          <div className="h-[7px] bg-[#D4DDED] my-[3px] -mx-[3px]"></div>

          <div className="text-xs bg-[#E8EEFA] py-2 px-[3px] text-center leading-[1.7em]">
            Ainda não é membro?
            <br />
            <a
              className="text-[#0047BE] underline hover:text-[#C40098]"
              href="account/newAccount"
            >
              <b>ENTRE JÁ</b>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#BCCDE9] mt-[10px] text-xs p-[5px] text-center">
        &copy;2009{" "}Google{" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          style={{ textDecoration: "underline" }}
          href=""
        >
          Sobre O Orkut
        </a>
        {" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          href=""
          style={{ textDecoration: "underline" }}
        >
          Centro de Segurança
        </a>
        {" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          href=""
          style={{ textDecoration: "underline" }}
        >
          Privacidade
        </a>
        {" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          href=""
          style={{ textDecoration: "underline" }}
        >
          Termos
        </a>
      </div>
    </div>
  );
}
