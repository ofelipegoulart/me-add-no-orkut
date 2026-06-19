import { terms } from "@/data/terms"

export default function Register() {
  return (
    <div className="font-[arial,sans-serif] m-0 p-[13px_15px_15px] bg-white text-black">
      <div className="mb-[9px] -ml-0.5 relative overflow-hidden">
        <img
          className="border-0 float-left"
          src="/logos/accounts_logo.gif"
          alt="Google"
        />
      </div>

      <div id="maincontent">
        <h3>Criar uma Conta</h3>

        <table width={700}>
          <tbody>
            <tr>
              <td>
                <span className="text-sm">
                  Sua Conta do Google dá acesso ao orkut e a{" "}
                  <a href="#" className="text-[#0000cc]">
                    outros serviços do Google
                  </a>
                  .
                </span>{" "}
                <span className="text-sm">
                  Se você já tem uma Conta do Google, pode{" "}
                  <a href="/account" className="text-[#0000cc]">
                    fazer login aqui
                  </a>
                  .
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <form id="createaccount" name="createaccount" action="#" method="post">
          <table cellPadding={2} cellSpacing={0} width="1%">
            <tbody>
              <tr>
                <td>
                  <table cellSpacing={0} cellPadding={0} width="1%">
                    <tbody>
                      <tr>
                        <td>
                          <table
                            cellSpacing={0}
                            cellPadding={0}
                            width="100%"
                            className="bg-[#eeeeee]"
                          >
                            <tbody>
                              <tr>
                                <td className="bg-white align-top text-center">
                                  <table
                                    id="signupform"
                                    cellSpacing={0}
                                    cellPadding={0}
                                    width="100%"
                                    className="relative -left-[5px] -top-[7px] [&_td]:py-[7px] [&_td]:px-[5px]"
                                  >
                                    <tbody>
                                      <tr>
                                        <td colSpan={2} className="align-top">
                                          <span className="text-[#3366cc] font-bold">
                                            Informações necessárias para a Conta
                                            do Google
                                          </span>
                                        </td>
                                      </tr>

                                      {/* Nome */}
                                      <tr>
                                        <td className="whitespace-nowrap align-top">
                                          <span className="text-sm font-bold">
                                            Nome:
                                          </span>
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            name="FirstName"
                                            id="FirstName"
                                            size={30}
                                            className="border border-[#999]"
                                          />
                                        </td>
                                      </tr>

                                      {/* Sobrenome */}
                                      <tr>
                                        <td className="whitespace-nowrap align-top">
                                          <span className="text-sm font-bold">
                                            Sobrenome:
                                          </span>
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            name="LastName"
                                            id="LastName"
                                            size={30}
                                            className="border border-[#999]"
                                          />
                                        </td>
                                      </tr>

                                      {/* E-mail */}
                                      <tr>
                                        <td className="align-top whitespace-nowrap">
                                          <span className="text-sm font-bold">
                                            Seu endereço de e-mail atual:
                                          </span>
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            name="Email"
                                            id="Email"
                                            size={30}
                                            className="border border-[#999]"
                                          />
                                          <span className="text-xs text-[#6f6f6f] block mt-0.5">
                                            ex: meunome@exemplo.com. Este será
                                            seu nome de usuário e login.
                                          </span>
                                        </td>
                                      </tr>

                                      {/* Senha */}
                                      <tr>
                                        <td className="align-top whitespace-nowrap">
                                          <span className="text-sm font-bold">
                                            Escolha uma senha:
                                          </span>
                                          &nbsp;&nbsp;
                                        </td>
                                        <td>
                                          <input
                                            type="password"
                                            name="Passwd"
                                            id="Passwd"
                                            size={30}
                                            className="border border-[#999]"
                                          />
                                          <span className="text-xs text-[#6f6f6f] block mt-0.5">
                                            Mínimo de 8 caracteres.
                                          </span>
                                        </td>
                                      </tr>

                                      {/* Confirmar Senha */}
                                      <tr>
                                        <td className="align-top">
                                          <span className="text-sm font-bold">
                                            Digite novamente a senha:
                                          </span>
                                        </td>
                                        <td>
                                          <input
                                            type="password"
                                            name="PasswdAgain"
                                            id="PasswdAgain"
                                            size={30}
                                            className="border border-[#999]"
                                          />
                                        </td>
                                      </tr>

                                      {/* Manter conectado */}
                                      <tr>
                                        <td className="whitespace-nowrap">
                                          &nbsp;
                                        </td>
                                        <td className="text-left">
                                          <span className="text-sm">
                                            <input
                                              type="checkbox"
                                              name="PersistentCookie"
                                              id="PersistentCookie"
                                              value="yes"
                                              defaultChecked
                                            />
                                            &nbsp;Manter-me conectado
                                          </span>
                                        </td>
                                      </tr>

                                      {/* Divisor */}
                                      <tr>
                                        <td colSpan={2}>
                                          <hr />
                                        </td>
                                      </tr>

                                      {/* Comece a usar o orkut */}
                                      <tr>
                                        <td colSpan={2}>
                                          <span className="text-[#3366cc] font-bold">
                                            Comece a usar o orkut
                                          </span>
                                        </td>
                                      </tr>

                                      {/* Verificação de palavras */}
                                      <tr>
                                        <td className="align-top">
                                          <span className="text-sm font-bold">
                                            Verificação de palavras:
                                          </span>
                                        </td>
                                        <td>
                                          <table>
                                            <tbody>
                                              <tr>
                                                <td className="align-top"></td>
                                                <td className="align-top">
                                                  <span className="text-sm block mb-1">
                                                    Digite os caracteres que
                                                    você vê na imagem abaixo.
                                                  </span>
                                                  <div className="w-[200px] h-[70px] bg-gray-200 border border-gray-300 flex items-center justify-center mb-1">
                                                    <span className="text-xs text-gray-400">
                                                      [imagem de verificação]
                                                    </span>
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td></td>
                                                <td>
                                                  <input
                                                    type="text"
                                                    size={22}
                                                    id="newaccountcaptcha"
                                                    name="newaccountcaptcha"
                                                    defaultValue=""
                                                    title="Digite os caracteres que você vê ou os números que você ouve"
                                                    className="border border-[#999]"
                                                  />
                                                  <span className="text-xs text-[#6f6f6f] block mt-0.5">
                                                    As letras não diferenciam
                                                    maiúsculas de minúsculas.
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      {/* Termos de Serviço */}
                                      <tr>
                                        <td className="align-top whitespace-nowrap">
                                          <span className="text-sm font-bold">
                                            Termos de Serviço:
                                          </span>
                                        </td>
                                        <td className="align-top">
                                          <span className="text-sm">
                                            Verifique as informações da Conta do
                                            Google que você inseriu acima (fique
                                            à vontade para alterar o que quiser)
                                            e revise os Termos de Serviço
                                            abaixo.
                                          </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                        <td className="align-top">
                                          <div>
                                            <div
                                              className="inline"
                                              id="tos_div"
                                            >
                                              <table
                                                cellPadding={0}
                                                cellSpacing={0}
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td className="text-right align-top">
                                                      <a
                                                        href="#"
                                                        target="_blank"
                                                        className="text-sm text-[#0000cc]"
                                                      >
                                                        Versão para impressão
                                                      </a>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <textarea
                                                        rows={5}
                                                        cols={80}
                                                        className="w-full"
                                                        readOnly
                                                        defaultValue={terms}
                                                      />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>&nbsp;</td>
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <span className="text-sm">
                                                        Ao clicar em
                                                        &apos;Aceito&apos;
                                                        abaixo, você concorda
                                                        com os{" "}
                                                        <a
                                                          href="#"
                                                          className="text-[#0000cc]"
                                                        >
                                                          Termos de Serviço
                                                        </a>{" "}
                                                        acima e com a{" "}
                                                        <a
                                                          href="#"
                                                          className="text-[#0000cc]"
                                                        >
                                                          Política de
                                                          Privacidade
                                                        </a>
                                                        .
                                                      </span>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>

                                      {/* Botão de envio */}
                                      <tr>
                                        <td colSpan={1}>&nbsp;</td>
                                        <td>
                                          <input
                                            className="w-[19em]"
                                            id="submitbutton"
                                            name="submitbutton"
                                            type="submit"
                                            value="Aceito. Criar minha conta."
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      <div className="text-[#666] text-sm mt-10 text-center">
        &copy;2009 Google &nbsp;-&nbsp;
        <a href="#" className="text-[#0000cc]">
          Página inicial do Google
        </a>
        &nbsp;-&nbsp;
        <a href="#" className="text-[#0000cc]">
          Termos de Serviço
        </a>
        &nbsp;-&nbsp;
        <a href="#" className="text-[#0000cc]">
          Política de Privacidade
        </a>
        &nbsp;-&nbsp;
        <a href="#" className="text-[#0000cc]">
          Ajuda
        </a>
      </div>
    </div>
  );
}
