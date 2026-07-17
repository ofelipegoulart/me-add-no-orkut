"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogoutButton } from "@/components/ui/Header/logout-button";

export function DeleteAccountGooglePage({ email }: { email: string }) {
  const router = useRouter();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setError("");

    if (!confirmChecked) {
      setError("Confirme que deseja remover o orkut da sua conta.");
      return;
    }
    if (!password) {
      setError("Informe sua senha atual.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirm: confirmChecked }),
      });

      if (!res.ok) {
        setError(
          res.status === 401
            ? "A senha atual está incorreta."
            : "Erro ao excluir a conta. Tente novamente.",
        );
        return;
      }

      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Erro ao excluir a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-white font-[Arial,Helvetica,sans-serif] text-black">
      <div className="w-full px-6 py-4">
        <div className="flex justify-end items-center gap-1.5 text-[11px] text-[#666] pb-2">
          <span>{email}</span>
          <span>|</span>
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Minha conta
          </a>
          <span>|</span>
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Ajuda
          </a>
          <span>|</span>
          <LogoutButton />
        </div>

        <img
          src="/logos/accounts_logo.gif"
          alt="Google contas"
          className="block mt-3 mb-3"
          style={{ maxWidth: "none" }}
        />

        <div className="flex items-center gap-3 mb-3">
          <h1 className="orkut-title orkut-title-sm">Excluir orkut</h1>
          <div className="flex-1 border-t border-[#ccc]" />
        </div>

        <div className="inline-block bg-[#F8F68F] px-1.5 py-0.5 text-[12px] font-bold mb-3">
          Leia isso com atenção
        </div>

        <p className="text-[13px] leading-[19px] mb-3">
          Você está tentando remover <b>orkut</b> da sua conta do Google.
        </p>
        <p className="text-[13px] leading-[19px] mb-4">
          Você não poderá acessar o orkut.com. O seu perfil será excluído. Se resolver se
          tornar um membro do orkut.com novamente no futuro, você precisará criar um novo
          perfil.
        </p>

        <p className="text-[13px] font-bold mb-2">Tem certeza de que deseja excluir orkut ?</p>

        <label className="flex items-start gap-1.5 text-[13px] mb-4 pl-4">
          <input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
            className="mt-0.5"
          />
          Sim, quero remover permanentemente orkut de minha conta do Google.
        </label>

        <label className="block text-[13px] font-bold mb-1" htmlFor="currentPassword">
          Senha atual
        </label>
        <input
          id="currentPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="border border-[#7e7e7e] px-1 py-0.5 text-[13px] w-56 mb-2"
        />

        {error && <p className="text-[12px] text-red-600 mb-2">{error}</p>}

        <div className="flex gap-2 mb-6 mt-2">
          <button
            type="button"
            className="xp-btn xp-btn-gray font-bold"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? "Removendo..." : "Remover orkut"}
          </button>
          <button
            type="button"
            className="xp-btn xp-btn-gray"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>

        <div className="text-center text-[11px] text-[#666] pt-4">
          &copy;2010 Google -{" "}
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Página inicial do Google
          </a>{" "}
          -{" "}
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Termos de serviço
          </a>{" "}
          -{" "}
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Política de Privacidade
          </a>{" "}
          -{" "}
          <a href="#" className="text-[#0047BE] hover:text-[#C40098] underline">
            Ajuda
          </a>
        </div>
      </div>
    </div>
  );
}
