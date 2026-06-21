import type { PrivacyLevel } from "./types";

export const PRIVACY_OPTIONS: PrivacyLevel[] = [
  "só eu",
  "apenas meus amigos",
  "amigos de amigos",
  "todos",
];

export const MESES = [
  "", "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export const DIAS = ["", ...Array.from({ length: 31 }, (_, i) => String(i + 1))];

export const RELACIONAMENTO_OPTIONS = [
  "não há resposta",
  "solteiro",
  "casado",
  "namorando",
  "casamento aberto",
  "relacionamento aberto",
];

export const PAISES = [
  "Brasil",
  "Portugal",
  "Estados Unidos",
  "Argentina",
  "Japão",
  "Índia",
];

export const INTERESSADO_EM_OPTIONS = [
  "amigos",
  "companheiros para atividades",
  "contatos profissionais",
  "namoro",
];

export const INTERESSADO_EM_NAMORO_OPTIONS = [
  "homens",
  "mulheres",
  "homens e mulheres",
];

export const FILHOS_OPTIONS = [
  "não há resposta",
  "não",
  "sim, moram comigo",
  "sim - visitam de vez em quando",
  "sim - não moram comigo",
];

export const ETNIA_OPTIONS = [
  "não há resposta",
  "afro-brasileiro (negro)",
  "asiático",
  "caucasiano (branco)",
  "índias orientais",
  "hispânico/latino",
  "Oriente Médio",
  "indígena americano",
  "ilhas do Oceano Pacífico",
  "multiétnico",
  "outra",
];

export const RELIGIAO_OPTIONS = [
  "sem resposta",
  "Agnóstico",
  "Ateu",
  "Budista",
  "Cao Dai",
  "Cientologia",
  "Cristão/Anglicano",
  "Cristão/Católico",
  "Cristão/Ortodoxo",
  "Cristão/outro",
  "Cristão/Protestante",
  "Cristão/SUD",
  "Cristão/Espírita",
  "Fé Bahá'í",
  "Hindu",
  "Humanismo religioso",
  "Jaina",
  "Judeu",
  "Muçulmano",
  "Neo-Paganismo",
  "Rastafari",
  "Sikh",
  "Taoísta",
  "Tenho um lado espiritual independente de religiões",
  "Tenrikio",
  "Universalista Unitário",
  "Xinto",
  "Zoroastra",
  "outro",
];

export const VISAO_POLITICA_OPTIONS = [
  "sem resposta",
  "conservador de direita",
  "conservador de extrema direita",
  "centrista",
  "esquerda-liberal",
  "extrema esquerda-liberal",
  "libertário",
  "libertário ao extremo",
  "autoritário",
  "autoritário ao extremo",
  "depende",
  "apolítico",
];

export const ORIENTACAO_SEXUAL_OPTIONS = [
  "sem resposta",
  "heterossexual",
  "gay",
  "bissexual",
  "curioso",
];

export const HUMOR_OPTIONS = [
  "extrovertido/extravagante",
  "seco/sarcástico",
  "inteligente/sagaz",
  "simpático",
  "pateta/palhaço",
  "misterioso",
  "grosseiro",
];

export const ESTILO_OPTIONS = [
  "alternativo",
  "casual",
  "clássico",
  "contemporâneo",
  "uso roupas de estilistas famosos",
  "minimalista",
  "natural",
  "esportista/amante da natureza",
  "elegante",
  "na moda",
  "urbano",
];

export const FUMO_OPTIONS = [
  "não",
  "sim",
  "socialmente",
];

export const BEBO_OPTIONS = [
  "não",
  "sim",
  "socialmente",
];

export const ANIMAIS_OPTIONS = [
  "não gosto de animais de estimação",
  "tenho gatos",
  "tenho cachorros",
  "tenho pássaros",
  "tenho peixes",
  "tenho répteis",
  "tenho animais exóticos",
];

export const MORO_OPTIONS = [
  "não há resposta",
  "sozinho(a)",
  "com meus pais",
  "com meu(s) filho(s)",
  "com meu parceiro(a)",
  "com meu parceiro(a) e filho(s)",
  "com amigos",
  "com animais de estimação",
  "com outra(s) pessoa(s)",
];

export const COR_OLHOS_OPTIONS = [
  "sem resposta",
  "pretos",
  "azuis",
  "castanhos",
  "cinzas",
  "verdes",
  "mel",
];

export const COR_CABELO_OPTIONS = [
  "sem resposta",
  "castanhos avermelhado",
  "preto",
  "loiro",
  "castanho claro",
  "castanho escuro",
  "ruivo",
  "grisalho",
  "pouco grisalho",
  "careca",
  "muda com frequência",
  "outro",
];

export const TIPO_FISICO_OPTIONS = [
  "não há resposta",
  "magro(a)",
  "atlético(a)",
  "médio",
  "um pouco acima do peso",
  "gordo(a)",
];

export const APARENCIA_OPTIONS = [
  "não há resposta",
  "tipo miss/mister universo",
  "muito atraente",
  "atraente",
  "médio",
  "muito feio(a)",
];

export const ARTE_CORPO_OPTIONS = [
  "não há resposta",
  "tatuagem em lugar estratégico",
  "piercing na orelha",
  "piercing em outras partes",
  "tatuagem visível",
  "piercing na língua",
  "piercing no umbigo",
];

export const O_QUE_ME_ATRAI_OPTIONS = [
  "convicção",
  "luz de velas",
  "inteligência",
  "demonstrações públicas de afeto",
  "sarcasmo",
  "tatuagens",
  "tempestades",
  "piercing(s)",
  "dançar",
  "flertar",
  "cabelos compridos",
  "poder",
  "nadar nu",
  "aventura",
  "riqueza material",
];

export const DO_QUE_MAIS_GOSTO_OPTIONS = [
  "não há resposta",
  "olhos",
  "cabelos",
  "boca",
  "pescoço",
  "braços",
  "mãos",
  "busto/tórax",
  "umbigo",
  "bumbum",
  "pernas",
  "panturrilhas",
  "pés",
  "não consta na lista",
];

export const ESCOLARIDADE_OPTIONS = [
  "sem resposta",
  "ensino fundamental",
  "ensino médio",
  "ensino técnico",
  "graduação",
  "pós-graduação",
  "mestrado",
  "doutorado",
];
