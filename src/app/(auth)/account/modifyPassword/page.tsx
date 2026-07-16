"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthSubmitButton } from "@/components/ui/buttons/auth-submit-button";

type Strength = "" | "fraca" | "media" | "forte";

function getPasswordStrength(password: string): Strength {
  if (!password) return "";
  if (password.length < 6) return "fraca";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const types = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  if (password.length >= 8 && types >= 3) return "forte";
  if (password.length >= 6 && types >= 2) return "media";
  return "fraca";
}

const STRENGTH_STYLES: Record<Strength, { width: string; color: string }> = {
  "": { width: "0%", color: "transparent" },
  fraca: { width: "33%", color: "#cc3333" },
  media: { width: "66%", color: "#e8a33d" },
  forte: { width: "100%", color: "#3a993a" },
};

export default function ModifyPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  function clearFieldError(fieldName: string) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Campo obrigatório.";
    if (!newPassword) {
      errors.newPassword = "Campo obrigatório.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Mínimo de 6 caracteres.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Campo obrigatório.";
    } else if (newPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setFieldErrors({ currentPassword: "A senha atual está incorreta." });
        } else {
          setServerError("Erro ao alterar a senha. Tente novamente.");
        }
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Erro ao alterar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-[arial,sans-serif] m-0 p-[13px_15px_15px] bg-white text-black">
      <div className="mb-2.25 -ml-0.5 relative overflow-hidden">
        <img className="border-0 float-left" src="/logos/accounts_logo.gif" alt="Google" />
      </div>

      <div id="maincontent">
        <h3 className="text-base font-bold">Alterar senha</h3>

        {success ? (
          <div className="max-w-175 space-y-2 text-sm mt-3">
            <p>Sua senha foi alterada com sucesso.</p>
            <p>
              <Link href="/Settings" className="text-[#0000cc]">
                Clique aqui
              </Link>{" "}
              para voltar às suas configurações.
            </p>
          </div>
        ) : (
          <>
            {serverError && (
              <div className="bg-[#fff3f3] border border-red-300 text-red-700 text-sm px-3 py-2 mt-3 mb-1 max-w-175">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-3">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 auto-rows-max max-w-175 [&_label]:text-sm [&_label]:font-bold">
                <label htmlFor="currentPassword" className="text-right whitespace-nowrap">
                  Senha atual:
                </label>
                <div>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    size={30}
                    className="border border-[#999]"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onFocus={() => clearFieldError("currentPassword")}
                  />
                  <span className="text-xs text-red-600 block mt-0.5">
                    {fieldErrors.currentPassword || ""}
                  </span>
                </div>

                <label htmlFor="newPassword" className="text-right whitespace-nowrap">
                  Nova senha:
                </label>
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      size={30}
                      className="border border-[#999]"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => clearFieldError("newPassword")}
                    />
                    <span className="text-xs text-[#0000cc]">Força da senha:</span>
                  </div>
                  <div className="w-40 h-2 mt-1 bg-[#e5e5e5] border border-[#ccc] rounded-sm overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: STRENGTH_STYLES[strength].width,
                        backgroundColor: STRENGTH_STYLES[strength].color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-red-600 block mt-0.5">
                    {fieldErrors.newPassword || ""}
                  </span>
                  {!fieldErrors.newPassword && (
                    <div className="text-xs text-[#6f6f6f] mt-0.5">Mínimo de 6 caracteres.</div>
                  )}
                </div>

                <label htmlFor="confirmPassword" className="text-right whitespace-nowrap">
                  Confirmar nova senha:
                </label>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    size={30}
                    className="border border-[#999]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => clearFieldError("confirmPassword")}
                  />
                  <span className="text-xs text-red-600 block mt-0.5">
                    {fieldErrors.confirmPassword || ""}
                  </span>
                </div>

                <div />
                <div className="text-left mt-1">
                  <AuthSubmitButton disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </AuthSubmitButton>{" "}
                  <Link
                    href="/Settings"
                    className="border border-[#767676] bg-[#ececec] px-1.5 py-px font-sans text-xs text-black inline-block align-middle hover:bg-[#e5e5e5] hover:border-[#4f4f4f]"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
