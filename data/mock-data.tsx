import type { ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
};

export const CURRENT_USER: User = {
  id: "x7Kp2mNq",
  name: "Felipe",
  email: "ofelipegoulart@gmail.com",
  avatarSeed: "profile-main",
};

export const PROFILE_ROWS: { label: string; value: ReactNode }[] = [
  { label: "relacionamento:", value: "solteiro(a)" },
  { label: "aniversário:", value: "15 de julho" },
  { label: "idade:", value: "20" },
  { label: "cidade natal:", value: <a className="text-[#003399] underline">tangara da serra</a> },
  {
    label: "quem sou eu:",
    value:
      "Sou estudante, curto música, cinema e passar tempo com os amigos. No orkut pra trocar ideia, conhecer gente nova e participar das comunidades que curto.",
  },
  { label: "fumo:", value: "não" },
  { label: "bebo:", value: "socialmente" },
  { label: "moro:", value: "com os pais" },
  { label: "página web:", value: <a className="text-[#003399] underline">http://</a> },
];

export const FRIENDS: { id: string; name: string; count: number; seed: string }[] = [
  { id: "aB3cD4eF", name: "Priscilaaa", count: 485, seed: "a" },
  { id: "gH5iJ6kL", name: "Júlia", count: 120, seed: "b" },
  { id: "mN7oP8qR", name: "Rafa", count: 88, seed: "c" },
  { id: "sT9uV0wX", name: "Lucas", count: 64, seed: "d" },
  { id: "yZ1aB2cD", name: "Marina", count: 52, seed: "e" },
  { id: "eF3gH4iJ", name: "Pedro", count: 41, seed: "f" },
  { id: "kL5mN6oP", name: "Ana", count: 33, seed: "g" },
  { id: "qR7sT8uV", name: "Bruno", count: 29, seed: "h" },
  { id: "wX9yZ0aB", name: "Camila", count: 22, seed: "i" },
];

export const COMMUNITIES: { name: string; seed: string; count: number }[] = [
  { name: "As Ninas de...", seed: "1", count: 4210 },
  { name: "Só faço...", seed: "2", count: 3187 },
  { name: "Anime-Sai", seed: "3", count: 2054 },
  { name: "Rock BR", seed: "4", count: 1893 },
  { name: "Cinema", seed: "5", count: 1502 },
  { name: "Dev Web", seed: "6", count: 987 },
  { name: "Futebol", seed: "7", count: 745 },
  { name: "Música MPB", seed: "8", count: 611 },
  { name: "Games", seed: "9", count: 402 },
];

export const ORKUT_MENU_ICONS = {
  perfil: "/icons/p_profile.gif",
  recados: "/icons/p_scrap.gif",
  fotos: "/icons/p_camera.gif",
  videos: "/icons/p_video.gif",
  depoimentos: "/icons/p_pen.png",
  fans: "/icons/p_fan.png",
} as const;

export type Scrap = {
  id: string;
  content: string;
  isPrivate: boolean;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  ownerId: string;
  ownerName: string;
  parentId: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const MOCK_RECADOS: Scrap[] = [
  {
    id: "1",
    content: "Yo, let's grab dinner later tonight at the pizza place near my house. Sound good?",
    isPrivate: false,
    authorId: "cD1eF2gH",
    authorName: "Miles Alexander",
    authorAvatar: "miles",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: null,
    createdAt: "2026-06-24T11:43:00Z",
    updatedAt: "2026-06-24T11:43:00Z",
  },
  {
    id: "2",
    content: "Bora! Tô livre depois das 7. Te encontro lá 🍕",
    isPrivate: false,
    authorId: "x7Kp2mNq",
    authorName: "Felipe",
    authorAvatar: "profile-main",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: "1",
    readAt: null,
    createdAt: "2026-06-24T12:10:00Z",
    updatedAt: "2026-06-24T12:10:00Z",
  },
  {
    id: "3",
    content: "Perfect, 7 it is! I'll save us a table.",
    isPrivate: false,
    authorId: "cD1eF2gH",
    authorName: "Miles Alexander",
    authorAvatar: "miles",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: "1",
    readAt: null,
    createdAt: "2026-06-24T12:25:00Z",
    updatedAt: "2026-06-24T12:25:00Z",
  },
  {
    id: "4",
    content: "Adorei aquele vídeo que você mandou! Hilário demais 😂",
    isPrivate: false,
    authorId: "iJ3kL4mN",
    authorName: "Sofia Santos",
    authorAvatar: "sofia",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: null,
    createdAt: "2026-06-24T15:20:00Z",
    updatedAt: "2026-06-24T15:20:00Z",
  },
  {
    id: "5",
    content: "Vamos de cinema no fim de semana? Tem um filme novo legal saindo!",
    isPrivate: false,
    authorId: "aB3cD4eF",
    authorName: "Priscila Silva",
    authorAvatar: "priscila",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: "2026-06-23T20:00:00Z",
    createdAt: "2026-06-23T17:45:00Z",
    updatedAt: "2026-06-23T17:45:00Z",
  },
  {
    id: "6",
    content: "Qual filme? Tô querendo ver aquele de terror novo!",
    isPrivate: false,
    authorId: "x7Kp2mNq",
    authorName: "Felipe",
    authorAvatar: "profile-main",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: "5",
    readAt: "2026-06-23T20:00:00Z",
    createdAt: "2026-06-23T18:30:00Z",
    updatedAt: "2026-06-23T18:30:00Z",
  },
  {
    id: "7",
    content: "Esse mesmo! Sábado à noite, pode ser?",
    isPrivate: false,
    authorId: "aB3cD4eF",
    authorName: "Priscila Silva",
    authorAvatar: "priscila",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: "5",
    readAt: "2026-06-23T20:00:00Z",
    createdAt: "2026-06-23T19:00:00Z",
    updatedAt: "2026-06-23T19:00:00Z",
  },
  {
    id: "8",
    content: "Que roupa legal! Aonde você arrumou?",
    isPrivate: false,
    authorId: "sT9uV0wX",
    authorName: "Lucas Oliveira",
    authorAvatar: "lucas",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: "2026-06-23T10:00:00Z",
    createdAt: "2026-06-23T08:15:00Z",
    updatedAt: "2026-06-23T08:15:00Z",
  },
  {
    id: "9",
    content: "Encontrei essas fotos nossas de quando fomos na praia. Quer que eu mande?",
    isPrivate: false,
    authorId: "yZ1aB2cD",
    authorName: "Marina Costa",
    authorAvatar: "marina",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: "2026-06-22T16:00:00Z",
    createdAt: "2026-06-22T14:30:00Z",
    updatedAt: "2026-06-22T14:30:00Z",
  },
  {
    id: "10",
    content: "Oi! Só passando pra dizer que sinto sua falta 💕",
    isPrivate: true,
    authorId: "gH5iJ6kL",
    authorName: "Júlia",
    authorAvatar: "b",
    ownerId: "x7Kp2mNq",
    ownerName: "Felipe",
    parentId: null,
    readAt: "2026-06-22T12:00:00Z",
    createdAt: "2026-06-22T10:00:00Z",
    updatedAt: "2026-06-22T10:00:00Z",
  },
];