import type { SearchResultItem, SearchResultType } from "@/lib/search-types";

const DEFAULT_AVATAR = "/avatar/default.png";

// Foto real quando existe; usuários sem foto usam o mesmo default.png da lateral.
// Comunidades/tópicos continuam com a miniatura gerada por seed.
function avatarSrc(item: SearchResultItem): string {
  if (item.avatarUrl) return item.avatarUrl;
  if (item.type === "user") return DEFAULT_AVATAR;
  return `https://picsum.photos/seed/${item.avatarSeed}/56/56`;
}

const TYPE_LABEL: Record<SearchResultType, string> = {
  user: "usuário",
  community: "comunidade",
  topic: "tópico",
};

const FOOTER_LABEL: Record<SearchResultType, string> = {
  user: "recados",
  community: "membros",
  topic: "respostas",
};

function locationLine(item: SearchResultItem): string {
  const parts: string[] = [];
  if (item.city) parts.push(item.state ? `${item.city}, ${item.state}` : item.city);
  parts.push(item.country);
  return parts.join(" · ");
}

export function SearchResultCard({ item }: { item: SearchResultItem }) {
  const typeTag = `${TYPE_LABEL[item.type]} · ${item.country}`;

  return (
    <li className="orkut-search-card">
      <a href={item.href} className="orkut-search-card-thumb">
        <img
          src={avatarSrc(item)}
          alt=""
          width={56}
          height={56}
        />
      </a>

      <div className="orkut-search-card-body">
        <div className="orkut-search-card-head">
          <span className="orkut-search-name-wrap">
            {item.online && (
              <span className="orkut-search-online" title="online agora" aria-label="online" />
            )}
            <a href={item.href} className="orkut-search-name">
              {item.name}
            </a>
          </span>
          <span className="orkut-search-tag">{typeTag}</span>
        </div>

        <div className="orkut-search-loc">{locationLine(item)}</div>

        <dl className="orkut-search-fields">
          {item.email && (
            <div className="orkut-search-field">
              <dt>e-mail:</dt>
              <dd>{item.email}</dd>
            </div>
          )}
          {item.homepage && (
            <div className="orkut-search-field">
              <dt>página web:</dt>
              <dd>
                <a href={item.homepage} target="_blank" rel="noreferrer">
                  {item.homepage}
                </a>
              </dd>
            </div>
          )}
          {item.bio && (
            <div className="orkut-search-field">
              <dt>quem sou eu:</dt>
              <dd className="orkut-search-bio">{item.bio}</dd>
            </div>
          )}
        </dl>

        <div className="orkut-search-card-foot">
          <a href={item.href} className="orkut-search-scraps">
            <span className="orkut-search-scraps-ico" aria-hidden="true" />
            {item.scrapsCount.toLocaleString("pt-BR")} {FOOTER_LABEL[item.type]}
          </a>
        </div>
      </div>
    </li>
  );
}
