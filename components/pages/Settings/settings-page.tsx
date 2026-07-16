"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";

const TABS = [
  { key: "geral", label: "geral" },
  { key: "privacidade", label: "privacidade" },
  { key: "notificacoes", label: "notificações" },
  { key: "chat", label: "chat" },
  { key: "celular", label: "celular" },
] as const;

export function SettingsPage() {
  const router = useRouter();

  const [idioma, setIdioma] = useState("Português (Brasil)");
  const [lembretesAniversario, setLembretesAniversario] = useState(true);
  const [filtroSeguranca, setFiltroSeguranca] = useState<"improprio" | "todo">("improprio");
  const [atualizacoesAmigos, setAtualizacoesAmigos] = useState<"todos" | "grupos" | "nenhuma">("todos");
  const [recursosPerfil, setRecursosPerfil] = useState<string[]>(["fotos", "vídeos"]);
  const [internetLenta, setInternetLenta] = useState<"normal" | "lenta">("normal");
  const [naoExibirAviso, setNaoExibirAviso] = useState(false);

  function toggleRecurso(recurso: string) {
    setRecursosPerfil((prev) =>
      prev.includes(recurso) ? prev.filter((r) => r !== recurso) : [...prev, recurso]
    );
  }

  function handleSave() {
    // TODO: endpoint de salvar configurações ainda não existe
  }

  function handleCancel() {
    router.push("/Home");
  }

  return (
    <div className="orkut-edit-page">
      <h2 className="orkut-title">Minhas configurações</h2>
      <p className="orkut-breadcrumb">
        <Link href="/Home">Início</Link>
        <span className="orkut-breadcrumb-sep">&gt;</span>
        Minhas configurações
      </p>

      <div className="border-b border-orkut-border">
        {TABS.map((tab) =>
          tab.key === "geral" ? (
            <button key={tab.key} type="button" className="orkut-edit-tab orkut-edit-tab-active">
              {tab.label}
            </button>
          ) : (
            <button
              key={tab.key}
              type="button"
              className="orkut-edit-tab pointer-events-none"
              disabled
            >
              {tab.label}
            </button>
          )
        )}
      </div>

      <div className="orkut-edit-body">
        <table className="orkut-edit-table" cellPadding={0} cellSpacing={0}>
          <colgroup>
            <col className="orkut-edit-col-label" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">
                idioma de exibição:
                <span className="orkut-edit-label-aux">use o orkut no idioma que quiser!</span>
              </td>
              <td className="orkut-edit-field">
                <select
                  className="orkut-select"
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                >
                  <option value="Português (Brasil)">Português (Brasil)</option>
                </select>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">lembretes de aniversário:</td>
              <td className="orkut-edit-field">
                <label className="orkut-checkbox-label">
                  <input
                    type="checkbox"
                    checked={lembretesAniversario}
                    onChange={(e) => setLembretesAniversario(e.target.checked)}
                  />{" "}
                  mostrar lembretes de aniversários na minha página inicial
                </label>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">filtro de segurança</td>
              <td className="orkut-edit-field">
                <span className="orkut-radio-group orkut-radio-group-column">
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="filtroSeguranca"
                      checked={filtroSeguranca === "improprio"}
                      onChange={() => setFiltroSeguranca("improprio")}
                    />{" "}
                    não mostrar conteúdo impróprio
                  </label>
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="filtroSeguranca"
                      checked={filtroSeguranca === "todo"}
                      onChange={() => setFiltroSeguranca("todo")}
                    />{" "}
                    mostrar todo o conteúdo
                  </label>
                </span>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">
                atualizações dos meus amigos
                <span className="orkut-edit-label-aux">
                  notifique-me em minha página inicial sobre as alterações nas informações de
                  meus amigos, como: fotos, vídeos e perfis.{" "}
                  <img
                    src="/icons/i_question.gif"
                    alt=""
                    title="Ajuda"
                    className="inline align-middle"
                  />
                </span>
              </td>
              <td className="orkut-edit-field">
                <span className="orkut-radio-group orkut-radio-group-column">
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="atualizacoesAmigos"
                      checked={atualizacoesAmigos === "todos"}
                      onChange={() => setAtualizacoesAmigos("todos")}
                    />{" "}
                    mostrar atualizações de todos os meus amigos em minha página inicial
                  </label>
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="atualizacoesAmigos"
                      checked={atualizacoesAmigos === "grupos"}
                      onChange={() => setAtualizacoesAmigos("grupos")}
                    />{" "}
                    mostrar atualizações de grupos de amigos
                  </label>
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="atualizacoesAmigos"
                      checked={atualizacoesAmigos === "nenhuma"}
                      onChange={() => setAtualizacoesAmigos("nenhuma")}
                    />{" "}
                    não mostrar atualizações dos meus amigos
                  </label>
                </span>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">
                recursos a serem mostrados no seu perfil:
                <span className="orkut-edit-label-aux">
                  Quais dos recursos a seguir você quer que apareçam na página de seu perfil?
                </span>
              </td>
              <td className="orkut-edit-field">
                <span className="orkut-checkbox-group orkut-checkbox-group-column">
                  <label className="orkut-checkbox-label">
                    <input
                      type="checkbox"
                      checked={recursosPerfil.includes("fotos")}
                      onChange={() => toggleRecurso("fotos")}
                    />{" "}
                    fotos
                  </label>
                  <label className="orkut-checkbox-label">
                    <input
                      type="checkbox"
                      checked={recursosPerfil.includes("vídeos")}
                      onChange={() => toggleRecurso("vídeos")}
                    />{" "}
                    vídeos
                  </label>
                </span>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">internet lenta</td>
              <td className="orkut-edit-field">
                <span className="orkut-radio-group orkut-radio-group-column">
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="internetLenta"
                      checked={internetLenta === "normal"}
                      onChange={() => setInternetLenta("normal")}
                    />{" "}
                    mostrar a versão normal do orkut
                  </label>
                  <label className="orkut-radio-label">
                    <input
                      type="radio"
                      name="internetLenta"
                      checked={internetLenta === "lenta"}
                      onChange={() => setInternetLenta("lenta")}
                    />{" "}
                    mostrar a versão do orkut para internet lenta
                  </label>
                </span>
                <label className="orkut-checkbox-label pl-4 mt-1">
                  <input
                    type="checkbox"
                    checked={naoExibirAviso}
                    onChange={(e) => setNaoExibirAviso(e.target.checked)}
                  />{" "}
                  não exibir aviso se a velocidade da Internet mudar
                </label>
              </td>
            </tr>

            <tr>
              <td className="orkut-edit-label orkut-edit-label-left">minha conta:</td>
              <td className="orkut-edit-field">
                para alterar sua senha, acesse as{" "}
                <Link href="/account/modifyPassword" className="text-orkut-link-dark underline">
                  Configurações de sua Conta do Google
                </Link>
                <br />
                <br />
                <Link href="/Home/Settings/DeleteAccount" className="text-orkut-link-dark underline">
                  excluir minha conta do orkut
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="orkut-edit-buttons">
          <OrkutActionButton onClick={handleSave}>salvar alterações</OrkutActionButton>{" "}
          <OrkutActionButton onClick={handleCancel}>cancelar</OrkutActionButton>
        </div>
      </div>
    </div>
  );
}
