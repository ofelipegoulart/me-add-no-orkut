"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const COUNTRIES = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra",
  "Angola", "Antigua e Barbuda", "Arábia Saudita", "Argélia", "Argentina",
  "Armênia", "Austrália", "Áustria", "Azerbaijão", "Bahamas", "Bangladesh",
  "Barbados", "Bahrein", "Bélgica", "Belize", "Benin", "Bielorrússia",
  "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei",
  "Bulgária", "Burkina Faso", "Burundi", "Butão", "Cabo Verde", "Camarões",
  "Camboja", "Canadá", "Catar", "Cazaquistão", "Chade", "Chile", "China",
  "Chipre", "Colômbia", "Comores", "Coreia do Norte", "Coreia do Sul",
  "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca",
  "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador",
  "Eritreia", "Eslováquia", "Eslovênia", "Espanha", "Estados Unidos",
  "Estônia", "Etiópia", "Fiji", "Filipinas", "Finlândia", "França",
  "Gabão", "Gâmbia", "Gana", "Geórgia", "Grécia", "Guatemala", "Guiana",
  "Guiné", "Haiti", "Holanda", "Honduras", "Hungria", "Iêmen", "Índia",
  "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália",
  "Jamaica", "Japão", "Jordânia", "Kuwait", "Letônia", "Líbano", "Líbia",
  "Lituânia", "Luxemburgo", "Macedônia do Norte", "Madagascar", "Malásia",
  "Malawi", "Maldivas", "Mali", "Malta", "Marrocos", "Maurício",
  "Mauritânia", "México", "Moçambique", "Moldávia", "Mônaco", "Mongólia",
  "Montenegro", "Myanmar", "Namíbia", "Nepal", "Nicarágua", "Níger",
  "Nigéria", "Noruega", "Nova Zelândia", "Omã", "Panamá",
  "Papua Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia",
  "Portugal", "Quênia", "Reino Unido", "República Dominicana",
  "República Tcheca", "Romênia", "Ruanda", "Rússia", "Senegal",
  "Serra Leoa", "Sérvia", "Singapura", "Síria", "Somália", "Sri Lanka",
  "Suazilândia", "Sudão", "Suécia", "Suíça", "Suriname", "Tailândia",
  "Taiwan", "Tanzânia", "Togo", "Trinidad e Tobago", "Tunísia",
  "Turcomenistão", "Turquia", "Ucrânia", "Uganda", "Uruguai",
  "Uzbequistão", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue",
];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account");
      return;
    }
    if (session?.user?.name) {
      const parts = session.user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Preencha o campo nome.");
      return;
    }
    if (!year || isNaN(Number(year))) {
      setError("Informe o ano de nascimento.");
      return;
    }
    if (!gender) {
      setError("Selecione o gênero.");
      return;
    }
    if (!accepted) {
      setError("Você precisa aceitar os termos para continuar.");
      return;
    }

    setLoading(true);

    const birthDate = `${year}-${String(Number(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const name = lastName.trim()
      ? `${firstName.trim()} ${lastName.trim()}`
      : firstName.trim();

    const res = await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthDate }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Erro ao salvar informações. Tente novamente.");
      return;
    }

    await update();
    router.push("/");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-orkut-bg flex items-center justify-center">
        <span className="text-sm text-[#333]">Carregando...</span>
      </div>
    );
  }

  return (
    <div
      className="orkut-tahoma min-h-screen bg-orkut-bg text-xs text-black"
    >
      <header id="header">
        <div id="headerin">
          <ul className="header-nav">
            <li className="header-brand">
              <span className="header-logo-link">
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
              </span>
            </li>
          </ul>
          <ul className="header-user">
            <li>
              <span className="text-white font-bold">
                {session?.user?.email}
              </span>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/account" });
                }}
              >
                Sair
              </a>
            </li>
          </ul>
        </div>
      </header>

      <div className="min-w-[920px] max-w-[1003px] mx-auto mt-4 px-2">
        <div className="bg-white border border-orkut-border rounded-xl overflow-hidden">
          <div className="px-5 pt-4">
            <h1 className="!text-[30px] font-normal !text-[#333] m-0 !leading-[1.2]">
              bem-vindo(a) ao orkut!
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-5 pt-3 pb-4">
              <p className="!text-[13px] font-bold !text-[#333] m-0">
                Só precisamos confirmar algumas coisas antes de você começar a usar o orkut:
              </p>
            </div>

            {error && (
              <div className="bg-[#fff3f3] border border-red-300 !text-red-700 text-sm px-5 py-2 mx-5 mb-2">
                {error}
              </div>
            )}

            {/* Birth date */}
            <div className="bg-[#e8eefa] border-t border-white px-5 py-4 mx-4">
              <div className="flex">
                <div className="w-[260px] shrink-0 text-right pr-8 pt-0.5">
                  <span className="text-[#666] text-xs leading-[24px]">
                    Desculpe se estamos sendo indiscretos, mas quando você nasceu?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="border border-[#999] bg-white w-10 px-1 py-0.5 text-sm"
                  />
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border border-[#999] bg-white px-1 py-0.5 text-sm"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1900}
                    max={2025}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="ano"
                    className="border border-[#999] bg-white w-15 px-1 py-0.5 text-sm"
                  />
                  <span className="text-[11px] text-black">
                    (ano do seu nascimento, por exemplo, 85 ou 1985)
                  </span>
                </div>
              </div>
            </div>

            {/* Name confirmation */}
            <div className="bg-[#e8eefa] border-t-4 border-white px-5 py-4 mx-4">
              <div className="flex">
                <div className="w-[260px] shrink-0 text-right pr-8 pt-0.5">
                  <span className="text-[#666] text-xs leading-[24px]">
                    Entendemos seu nome direito?
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#333]">nome:</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-[#999] bg-white px-1 py-0.5 text-sm w-35"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#333]">sobrenome:</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-[#999] bg-white px-1 py-0.5 text-sm w-45"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sex */}
            <div className="bg-[#e8eefa] border-t-4 border-white px-5 py-4 mx-4">
              <div className="flex">
                <div className="w-[260px] shrink-0 text-right pr-8 pt-0.5">
                  <span className="text-xs font-bold text-[#333]">sexo:</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-xs text-[#333] cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      value="feminino"
                      checked={gender === "feminino"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    feminino
                  </label>
                  <label className="flex items-center gap-1 text-xs text-[#333] cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      value="masculino"
                      checked={gender === "masculino"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    masculino
                  </label>
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="bg-[#e8eefa] border-t-4 border-white px-5 py-4 mx-4">
              <div className="flex">
                <div className="w-[260px] shrink-0 text-right pr-8 pt-0.5">
                  <span className="text-xs font-bold text-[#333]">país:</span>
                </div>
                <div>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border border-[#999] bg-white px-1 py-0.5 text-sm w-60"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-[#e8eefa] border-t-4 border-white px-5 py-4 mx-4">
              <div className="flex">
                <div className="w-[260px] shrink-0 text-right pr-8">
                  <span className="text-[11px] text-[#666] leading-[16px]">
                    Se levante, coloque a mão direita no peito e faça o
                    seguinte juramento marcando a caixa de seleção:
                  </span>
                </div>
                <div>
                  <label className="flex items-start gap-2 text-[11px] text-[#333] leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Sei que devo ter 18 anos ou mais para usar o orkut.com.
                      Tenho 18 anos ou mais e aceito cumprir o{" "}
                      <a href="#" className="text-[#0047BE] underline">
                        Estatuto da Comunidade
                      </a>{" "}
                      ao usar o orkut. Também concordo em cumprir com{" "}
                      <a href="#" className="text-[#0047BE] underline">
                        estes termos adicionais
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="px-5 py-3">
              <button
                type="submit"
                disabled={loading}
                className="orkut-btn-white orkut-tahoma text-[11px] px-3 py-1 disabled:opacity-50"
              >
                {loading
                  ? "salvando..."
                  : "tudo certo, pode criar minha conta!"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="mt-3 mb-4 rounded-xl border border-[#bbb] px-4 py-2 flex items-center justify-center gap-2 text-[11px] text-[#666] font-light"
          style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%)" }}
        >
          <img src="/logos/orkut_logo.gif" alt="orkut" className="h-[18px]" />
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Sobre o orkut</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Acesse orkut.com</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Blog</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Desenvolvedores</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Centro de segurança</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Privacidade</a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="text-[#666] hover:underline">Termos</a>
        </div>
      </div>
    </div>
  );
}
