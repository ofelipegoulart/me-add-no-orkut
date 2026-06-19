'use client';

import { useState } from 'react';

export default function ForgotPasswdPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "arial, sans-serif", fontSize: "13px" }}>

      {/* Top right nav */}
      <div className="text-right pt-1 pr-1.5" style={{ fontSize: "smaller" }}>
        <a href="https://www.google.com.br">Página inicial do Google</a>
        {" | "}
        <a href="/account">Login</a>
      </div>

      {/* Header: logo + blue bar + "Contas do Google" */}
      <table width="100%" border={0} cellPadding={2} cellSpacing={0} className="mt-0.5">
        <tbody>
          <tr>
            <td valign="top" className="whitespace-nowrap pr-1">
              {/* maxWidth: none overrides Tailwind preflight `img { max-width: 100% }` */}
              <img
                src="logos/accounts_logo.gif"
                alt="Google"
                className="block"
                style={{ maxWidth: "none" }}
              />
            </td>
            <td valign="top" className="w-full">
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="h-7" />
                  </tr>
                  <tr>
                    <td className="bg-[#3366cc] h-[2px] leading-[2px]" style={{ fontSize: "1px" }}>&nbsp;</td>
                  </tr>
                  <tr className="bg-[#e5ecf9]">
                    <td className="pl-1.5 pb-1 pt-[3px]" style={{ fontFamily: "arial,sans-serif", fontSize: "13px" }}>
                      <b>Contas do Google</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="h-[5px]" />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main body */}
      <div className="ml-[3em] mr-[5em] my-4">
        {!submitted ? (
          <>
            <div className="font-bold mb-2" style={{ fontSize: "13px" }}>Assistência da senha</div>
            <div className="text-xs mb-3">
              Digite o endereço de e-mail que você normalmente usa para fazer login.
              Se você é um usuário de Gmail, digite o seu nome de usuário Gmail.
            </div>
            <form onSubmit={handleSubmit}>
              <div className="inline-block border-2 border-[#cbdced] py-1.5 px-2">
                <span className="font-bold pr-1.5 align-middle" style={{ fontSize: "smaller" }}>
                  E-mail:
                </span>
                <input
                  type="text"
                  name="Email"
                  id="Email"
                  size={25}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    border: "1px solid #999",
                    borderTopColor: "#555",
                    borderLeftColor: "#555",
                    backgroundColor: "white",
                    padding: "1px 2px",
                    fontSize: "13px",
                    fontFamily: "arial, sans-serif",
                    verticalAlign: "middle",
                  }}
                />
                {" "}
                <input
                  type="submit"
                  value="Enviar"
                  style={{
                    border: "1px solid #999",
                    borderTopColor: "#555",
                    borderLeftColor: "#555",
                    backgroundColor: "#e8e8e8",
                    padding: "1px 6px",
                    fontSize: "13px",
                    fontFamily: "arial, sans-serif",
                    cursor: "pointer",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="font-bold mb-3" style={{ fontSize: "13px" }}>Redefinir senha</div>
            <div className="text-xs mb-2">
              Para iniciar o processo de redefinição de senha, siga as instruções enviadas ao seu endereço de e-mail <b>{email}</b>.
            </div>
            <div className="text-xs mb-2">
              Certifique-se de que <b>{email}</b> é o nome que você usa para fazer login. Se não for, você não receberá o e-mail para redefinir a sua senha.
            </div>
            <div className="text-xs mb-3">
              Caso não consiga encontrar a mensagem que enviamos, consulte{" "}
              <a href="#">este artigo de ajuda</a>.
            </div>
            <div className="text-xs">
              <a href="/account">Clique aqui</a> para continuar.
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-[5px] bg-[#e5ecf9] text-center mt-2" style={{ fontSize: "83%" }}>
        <span className="text-[#666666]">&copy;2009 Google</span>
        {" - "}
        <a href="https://www.google.com.br">Página inicial do Google</a>
        {" - "}
        <a href="#">Termos de Serviço</a>
        {" - "}
        <a href="#">Política de Privacidade</a>
        {" - "}
        <a href="https://www.google.com.br/ajuda">Ajuda</a>
      </div>
    </div>
  );
}
