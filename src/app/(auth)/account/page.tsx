"use client";

import { AuthSubmitButton } from "@/components/ui/buttons/auth-submit-button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("Email") as string | null) ?? "";
    const password = (formData.get("Passwd") as string | null) ?? "";

    if (!email.trim() || !password) {
      setError("O nome de usuário e senha são incorretos.");
      setLoading(false);
      return;
    }

    let result;
    try {
      result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `${window.location.origin}/profile`,
      });
    } catch {
      setError("O nome de usuário e senha são incorretos.");
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!result || result.error) {
      setError("O nome de usuário e senha são incorretos.");
      return;
    }

    router.push("/profile");
  }

  return (
    <div
      className="orkut-tahoma min-h-screen bg-orkut-bg p-2.5 text-xs text-black"
    >
      <div className="flex gap-2.5 w-full">
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
          <div className="px-5 py-2.5 leading-[1.5em] text-xs text-center">
            <b className="text-orkut-accent-pink">Conecte-se</b> com amigos e familiares
            usandoo recados e mensagens instantâneas <br />
            <b className="text-orkut-accent-pink">Conheça</b> novas pessoas através de
            amigos de seus amigos e comunidades <br />
            <b className="text-orkut-accent-pink">Compartilhe</b> seus vídeos, fotos e
            paixões em um só lugar
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-0.75 w-66 flex flex-col">
          <div id="gaia_loginbox" className="flex-1 bg-orkut-tab-inactive text-center px-6">
            <form
              id="gaia_loginform"
              onSubmit={handleSubmit}
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
                  style={{ backgroundColor: "white" }}
                />
                <div className="text-right pr-1">
                  <span className="font-sans text-xs">Senha:</span>
                </div>
                <input
                  type="password"
                  name="Passwd"
                  id="Passwd"
                  size={15}
                  className={`font-sans text-xs border px-0.5 py-px ${error ? "border-red-500" : "border-[#767676]"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  style={{ backgroundColor: "white" }}
                />

                {error && (
                  <>
                    <div></div>
                    <div className="text-left text-red-600 text-[10px]">
                      {error}
                    </div>
                  </>
                )}

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
                  <span className="text-[#667788] mt-0.75 text-[10px] text-left">
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
                  <AuthSubmitButton
                    as="input"
                    name="login"
                    value={loading ? "Entrando..." : "Login"}
                    disabled={loading}
                    id="submitbutton"
                  />
                </div>

                <div
                  id="ga-fprow"
                  className="col-span-2 h-8.25 font-sans text-[70%] text-center flex items-end justify-center pb-1"
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

          <div className="h-1.75 bg-orkut-bg my-0.75 -mx-0.75"></div>

          <div className="text-xs bg-orkut-tab-inactive py-2 px-0.75 text-center leading-[1.7em]">
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

      <div className="bg-orkut-border mt-2.5 text-xs p-1.25 text-center">
        &copy;2009{" "}Google{" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          style={{ textDecoration: "underline" }}
          href=""
        >
          Sobre O Orkut
        </a>
        {" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          href=""
          style={{ textDecoration: "underline" }}
        >
          Centro de Segurança
        </a>
        {" "}-{" "}
        <a
          className="text-[#0047BE] hover:text-[#C40098]"
          href=""
          style={{ textDecoration: "underline" }}
        >
          Privacidade
        </a>
        {" "}-{" "}
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
