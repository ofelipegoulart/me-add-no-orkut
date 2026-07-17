import type { SearchResultItem, SearchResultType } from "@/lib/search-types";

const DEFAULT_AVATAR = "/avatar/i_nophoto128.gif";

// Foto real quando existe; sem foto, todos os tipos usam o mesmo placeholder.
function avatarSrc(item: SearchResultItem): string {
  return item.avatarUrl || DEFAULT_AVATAR;
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
  const typeTag = `${TYPE_LABEL[item.type]} - ${item.country}`;

  return (
    <li className="orkut-search-card">
      <div className="orkut-search-card-tag">
        <img src="/icons/i_reload.png" alt="" width={14} height={16} />
        {typeTag}
      </div>

      <div className="orkut-search-card-row">
        <a href={item.href} className="orkut-search-card-thumb">
          <img
            src={avatarSrc(item)}
            alt=""
            width={48}
            height={48}
          />
        </a>

        <div className="orkut-search-card-body">
          <div className="orkut-search-card-head">
            <span className="orkut-search-name-wrap">
              {item.online && (
                <span className="orkut-search-online" title="online agora" aria-label="online" />
              )}
              <SmallUserIcon />
              <a href={item.href} className="orkut-search-name">
                {item.name}
              </a>
            </span>
          </div>

          <div className="orkut-search-loc">{locationLine(item)}</div>

          <dl className="orkut-search-fields">
            {item.homepage && (
              <div className="orkut-search-field">
                <dt>página da Web:</dt>
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
      </div>
    </li>
  );
}

function SmallUserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="5" r="3" fill="#e8a33d" />
      <path d="M2 15c0-3.3 2.7-5 6-5s6 1.7 6 5z" fill="#4b7bd4" />
    </svg>
  );
}
