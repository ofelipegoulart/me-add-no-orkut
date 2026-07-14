// Papel de quem visita a comunidade. Hoje só distinguimos o não-membro
// ("guest") do dono ("owner"), derivado de ownerId === viewerId; a sidebar e a
// coluna direita mudam conforme esse papel.
export type CommunityRole = "guest" | "owner";
