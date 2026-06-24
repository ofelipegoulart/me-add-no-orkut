export type PrivacyLevel = "todos" | "amigos de amigos" | "apenas meus amigos" | "só eu";

export type ProfileGeneral = {
  nome: string;
  sobrenome: string;
  genero: string;
  relacionamento: string;
  nascimentoMes: string;
  nascimentoDia: string;
  nascimentoDataPrivacidade: PrivacyLevel;
  nascimentoAno: string;
  nascimentoAnoPrivacidade: PrivacyLevel;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  idiomas: string[];
  escola: string;
  escolaPrivacidade: PrivacyLevel;
  faculdade: string;
  faculdadePrivacidade: PrivacyLevel;
  empresa: string;
  empresaPrivacidade: PrivacyLevel;
  interessadoEm: string[];
  interessadoEmNamoro: string;
};

export type ProfileSocial = {
  filhos: string;
  etnia: string;
  religiao: string;
  visaoPolitica: string;
  orientacaoSexual: string;
  orientacaoSexualPrivacidade: PrivacyLevel;
  humor: string[];
  estilo: string[];
  fumo: string;
  bebo: string;
  animais: string;
  moro: string;
  cidadeNatal: string;
  paginaWeb: string;
  quemSouEu: string;
  paixoes: string;
  esportes: string;
  atividades: string;
  livros: string;
  musica: string;
  programasTv: string;
  cinema: string;
  cozinhas: string;
};

export type ProfileContact = {
  emailPrincipal: string;
  emailPrincipalPrivacidade: PrivacyLevel;
  emailsSecundarios: { email: string; privacidade: PrivacyLevel }[];
  im1: string;
  im1Privacidade: PrivacyLevel;
  im2: string;
  im2Privacidade: PrivacyLevel;
  telefoneResidencial: string;
  telefoneResidencialPrivacidade: PrivacyLevel;
  telefoneCelular: string;
  telefoneCelularPrivacidade: PrivacyLevel;
  endereco1: string;
  endereco2: string;
  enderecoCidade: string;
  enderecoEstado: string;
  enderecoCep: string;
  enderecoPais: string;
};

export type ProfileProfessional = {
  escolaridade: string;
  escola: string;
  faculdade: string;
  curso: string;
  diploma: string;
  ano: string;
  profissao: string;
  setor: string;
  empresa: string;
  descricaoTrabalho: string;
  telefoneTrabalho: string;
  habilidadesProfissionais: string;
  interessesProfissionais: string;
};

export type ProfilePersonal = {
  corOlhos: string;
  corCabelo: string;
  altura: string;
  tipoFisico: string;
  aparencia: string;
  arteCorpo: string;
  parPerfeito: string;
  oQueMeAtrai: string[];
  oQueNaoSuporto: string;
  primeiroEncontroIdeal: string;
  relacionamentosAnteriores: string;
  cincoCoisas: string;
  noMeuQuarto: string;
  oQueMaisChamaAtencao: string;
  doQueMaisGosto: string;
};
