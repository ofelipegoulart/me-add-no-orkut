"use client";

import { AuthSubmitButton } from "@/components/ui/buttons/auth-submit-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { terms } from "@/data/terms";

function validateEmail(email: string): string {
  if (!email) return "";
  const atCount = (email.match(/@/g) || []).length;
  if (atCount === 0) return "Não se esqueça de incluir o '@'.";
  if (atCount > 1) return "Insira um endereço de e-mail com apenas um '@'.";
  const [username, domain] = email.split("@");
  if (!username) return "Insira um nome de usuário antes do '@'.";
  if (!domain) return "Insira um nome de domínio depois do '@'.";
  if (
    !domain.includes(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  )
    return `Seu endereço de e-mail contém o nome de domínio inválido '${domain}'.`;
  return "";
}

function getPasswordRating(password: string): string {
  if (!password) return "";
  if (password.length < 8) return "Muito curta";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const types = [hasUpper, hasLower, hasDigit, hasSpecial].filter(
    Boolean,
  ).length;
  if (types <= 1) return "Fraca";
  return "";
}

export default function Register() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwdRating, setPasswdRating] = useState("");

  function clearFieldError(fieldName: string) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  function getFieldResetHandlers(fieldName: string) {
    return {
      onClick: () => clearFieldError(fieldName),
      onFocus: () => clearFieldError(fieldName),
    };
  }

  function handlePasswdKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    setPasswdRating(getPasswordRating(e.currentTarget.value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("FirstName") as string).trim();
    const lastName = (formData.get("LastName") as string).trim();
    const email = (formData.get("Email") as string).trim();
    const password = formData.get("Passwd") as string;
    const passwordConfirm = formData.get("PasswdAgain") as string;

    const errors: Record<string, string> = {};

    if (!firstName) errors.FirstName = "Campo obrigatório.";
    if (!lastName) errors.LastName = "Campo obrigatório.";
    const emailValidation = validateEmail(email);

    if (!email) {
      errors.Email = "Campo obrigatório.";
    } else if (emailValidation) {
      errors.Email = emailValidation;
    }

    if (!password) {
      errors.Passwd = "Campo obrigatório.";
    } else if (password.length < 6) {
      errors.Passwd = "Mínimo de 6 caracteres.";
    }
    if (!passwordConfirm) {
      errors.PasswdAgain = "Campo obrigatório.";
    } else if (password && password !== passwordConfirm) {
      errors.PasswdAgain = "As senhas não coincidem.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const name = `${firstName} ${lastName}`;

    const registerRes = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!registerRes.ok) {
      setLoading(false);
      const data = await registerRes.json();
      if (registerRes.status === 400 || registerRes.status === 409) {
        setServerError(data.message || "Este e-mail já está em uso.");
      } else {
        setServerError("Erro ao criar conta. Tente novamente.");
      }
      return;
    }

    setLoading(false);
    router.push("/account");
  }

  return (
    <div className="font-[arial,sans-serif] m-0 p-[13px_15px_15px] bg-white text-black">
      <div className="mb-2.25 -ml-0.5 relative overflow-hidden">
        <img
          className="border-0 float-left"
          src="/logos/accounts_logo.gif"
          alt="Google"
        />
      </div>

      <div id="maincontent">
        <h3 className="text-base font-bold">Criar uma Conta</h3>

        <div className="max-w-175 space-y-2 text-sm">
          <p>
            Sua Conta do Google dá acesso ao orkut e a{' '}
            <a href="#" className="text-[#0000cc]">
              outros serviços do Google
            </a>
            .
          </p>
          <p>
            Se você já tem uma Conta do Google, pode{' '}
            <Link href="/account" className="text-[#0000cc]">
              fazer login aqui
            </Link>
            .
          </p>
        </div>

        <br />

        {serverError && (
          <div className="bg-[#fff3f3] border border-red-300 text-red-700 text-sm px-3 py-2 mb-3 max-w-175">
            {serverError}
          </div>
        )}

        <form
          id="createaccount"
          name="createaccount"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="block w-full max-w-175  p-1 text-left">
            <div className="bg-white p-2 text-left">
              <div
                id="signupform"
                className="relative -left-1.25 -top-1.75 space-y-4 text-left [&_label]:text-sm [&_label]:font-bold"
              >
                <div className="text-left">
                  <span className="text-[#3366cc] font-bold text-sm">
                    Informações necessárias para a Conta do Google
                  </span>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 auto-rows-max">
                  <label htmlFor="FirstName" className="text-right whitespace-nowrap">
                    Nome:
                  </label>
                  <div>
                    <input
                      type="text"
                      name="FirstName"
                      id="FirstName"
                      size={30}
                      className="border border-[#999]"
                      {...getFieldResetHandlers('FirstName')}
                    />
                      <span className="text-xs text-red-600 block mt-0.5">
                        {fieldErrors.FirstName || ''}
                      </span>
                  </div>

                  <label htmlFor="LastName" className="text-right whitespace-nowrap">
                    Sobrenome:
                  </label>
                  <div>
                    <input
                      type="text"
                      name="LastName"
                      id="LastName"
                      size={30}
                      className="border border-[#999]"
                      {...getFieldResetHandlers('LastName')}
                    />
                      <span className="text-xs text-red-600 block mt-0.5">
                        {fieldErrors.LastName || ''}
                      </span>
                  </div>

                  <label htmlFor="Email" className="text-right whitespace-nowrap">
                    Seu endereço de e-mail atual:
                  </label>
                  <div>
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      size={30}
                      className="border border-[#999]"
                      {...getFieldResetHandlers('Email')}
                    />
                      <span className="text-xs text-red-600 block mt-0.5">
                        {fieldErrors.Email || ''}
                      </span>
                      {!fieldErrors.Email && (
                        <div className="text-xs text-[#6f6f6f] mt-0.5">
                          ex: meunome@exemplo.com. Este será seu nome de usuário e login.
                        </div>
                      )}
                  </div>

                  <label htmlFor="Passwd" className="text-right whitespace-nowrap">
                    Escolha uma senha:
                  </label>
                  <div>
                    <input
                      type="password"
                      name="Passwd"
                      id="Passwd"
                      size={30}
                      className="border border-[#999]"
                      onKeyUp={handlePasswdKeyUp}
                      {...getFieldResetHandlers('Passwd')}
                    />
                      <span className="text-xs text-red-600 block mt-0.5">
                        {fieldErrors.Passwd || ''}
                      </span>
                      {!fieldErrors.Passwd && (
                        <div className="text-xs text-[#6f6f6f] mt-0.5">
                          Mínimo de 6 caracteres.
                        </div>
                      )}
                      <div id="passwdRating">
                        {!fieldErrors.Passwd && passwdRating && (
                          <span className="text-xs text-red-600 block mt-0.5">
                            {passwdRating}
                          </span>
                        )}
                      </div>
                  </div>

                  <label htmlFor="PasswdAgain" className="text-right whitespace-nowrap">
                    Digite novamente a senha:
                  </label>
                  <div>
                    <input
                      type="password"
                      name="PasswdAgain"
                      id="PasswdAgain"
                      size={30}
                      className="border border-[#999]"
                      {...getFieldResetHandlers('PasswdAgain')}
                    />
                      <span className="text-xs text-red-600 block mt-0.5">
                        {fieldErrors.PasswdAgain || ''}
                      </span>
                  </div>

                  <div />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="PersistentCookie"
                      id="PersistentCookie"
                      value="yes"
                      defaultChecked
                    />
                    <label htmlFor="PersistentCookie" className="text-xs! font-normal! ml-1.5 bg-white">
                      Manter-me conectado
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#ccc] my-2" />

                <div className="text-left">
                  <span className="text-[#3366cc] font-bold">
                    Comece a usar o orkut
                  </span>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 auto-rows-max">
                  <div className="text-sm font-bold text-right whitespace-nowrap">
                    Termos de Serviço:
                  </div>
                  <div className="text-sm">
                    Verifique as informações da Conta do Google que você inseriu acima (fique à vontade para alterar o que quiser) e revise os Termos de Serviço abaixo.
                  </div>

                  <div />
                  <div id="tos_div" className="space-y-2 text-sm">
                    <div className="text-right">
                      <a href="#" target="_blank" className="text-sm text-[#0000cc]">
                        Versão para impressão
                      </a>
                    </div>
                    <div className="w-2/5 h-20 border border-[#999]">
                      <textarea
                        rows={1}
                        cols={80}
                        className="w-full h-full resize-none border-0 p-1"
                        readOnly
                        defaultValue={terms}
                      />
                    </div>
                    <div className="text-sm">
                      Ao clicar em &apos;Aceito&apos; abaixo, você concorda com os{' '}
                      <a href="#" className="text-[#0000cc]">
                        Termos de Serviço
                      </a>{' '}
                      acima e com a{' '}
                      <a href="#" className="text-[#0000cc]">
                        Política de Privacidade
                      </a>
                      .
                    </div>
                  </div>

                  <div />
                  <div className="text-left">
                    <AuthSubmitButton
                      id="submitbutton"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Criando conta...' : 'Aceito. Criar minha conta.'}
                    </AuthSubmitButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
