import type { SearchResultItem, SearchResultType } from "@/lib/search-types";

// Formata "DD/MM/AA HH:mm" para a data/hora da última mensagem do tópico.
function formatTopicDateTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date} ${time}`;
}

// Destaca (em negrito) as ocorrências do termo pesquisado dentro do trecho citado.
function highlightTerm(text: string, term: string): React.ReactNode {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

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

const TYPE_ICON: Record<SearchResultType, string> = {
  user: "/icons/i_friendgroup.png",
  community: "/icons/p_globe.gif",
  topic: "/icons/i_forum.gif",
};

function locationLines(item: SearchResultItem): string[] {
  const cityLine = item.city
    ? item.state
      ? `${item.city}, ${item.state}`
      : item.city
    : null;
  return cityLine ? [cityLine, item.country] : [item.country];
}

export function SearchResultCard({ item, term = "" }: { item: SearchResultItem; term?: string }) {
  if (item.type === "topic") {
    return <TopicResultCard item={item} term={term} />;
  }
  if (item.type === "community") {
    return <CommunityResultCard item={item} />;
  }

  const typeTag = `${TYPE_LABEL[item.type]} - ${item.country}`;

  return (
    <li className="orkut-search-card">
      <div className="orkut-search-card-tag">
        <img src={TYPE_ICON[item.type]} alt="" width={14} height={14} />
        {typeTag}
      </div>

      <div className="orkut-search-card-row">
        <a href={item.href} className="orkut-search-card-thumb">
          <img
            src={avatarSrc(item)}
            alt=""
            width={64}
            height={64}
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
          </div>

          {locationLines(item).map((line) => (
            <div key={line} className="orkut-search-loc">{line}</div>
          ))}

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
              <img src="/icons/p_scrap.gif" alt="" width={14} height={14} />
              {item.scrapsCount.toLocaleString("pt-BR")} recados
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

// Card de comunidade: nome (+ nº de membros em cinza), categoria, local e
// descrição, nessa ordem.
function CommunityResultCard({ item }: { item: SearchResultItem }) {
  const typeTag = `${TYPE_LABEL.community} - ${item.country}`;

  return (
    <li className="orkut-search-card">
      <div className="orkut-search-card-tag">
        <img src={TYPE_ICON.community} alt="" width={14} height={14} />
        {typeTag}
      </div>

      <div className="orkut-search-card-row">
        <a href={item.href} className="orkut-search-card-thumb">
          <img src={avatarSrc(item)} alt="" width={64} height={64} />
        </a>

        <div className="orkut-search-card-body">
          <div className="orkut-search-card-head">
            <a href={item.href} className="orkut-search-name">
              {item.name}
            </a>
            <span className="orkut-search-community-count">
              ({item.scrapsCount.toLocaleString("pt-BR")} membros)
            </span>
          </div>

          {item.category && (
            <div className="orkut-search-loc">{item.category}</div>
          )}

          {locationLines(item).map((line) => (
            <div key={line} className="orkut-search-loc">{line}</div>
          ))}

          {item.bio && <p className="orkut-search-community-desc">{item.bio}</p>}
        </div>
      </div>
    </li>
  );
}

// Card de tópico de fórum: título + trecho citado (com o termo em negrito),
// contagem de mensagens, data/hora da última mensagem e a comunidade do tópico.
function TopicResultCard({ item, term }: { item: SearchResultItem; term: string }) {
  const lastMessage = formatTopicDateTime(item.lastMessageAt);
  const messageCount = item.messageCount ?? 0;

  return (
    <li className="orkut-search-card">
      <div className="orkut-search-card-tag">
        <img src={TYPE_ICON.topic} alt="" width={14} height={14} />
        {typeLabelFor(item)}
      </div>

      <div className="orkut-search-topic-head">
        <a href={item.href} className="orkut-search-name">
          {item.name}
        </a>
        <a href={item.href} className="orkut-search-topic-view">
          view
        </a>
      </div>

      {item.excerpt && (
        <p className="orkut-search-topic-excerpt">
          {highlightTerm(item.excerpt, term)}
        </p>
      )}

      <div className="orkut-search-topic-meta">
        {messageCount.toLocaleString("pt-BR")}{" "}
        {messageCount === 1 ? "mensagem" : "mensagens"}
        {lastMessage && ` · Última mensagem ${lastMessage}`}
      </div>

      {item.communityName && (
        <div className="orkut-search-topic-community">
          <img src="/icons/p_globe.gif" alt="" width={14} height={14} />
          <a href={item.communityHref || "#"}>{item.communityName}</a>
        </div>
      )}
    </li>
  );
}

function typeLabelFor(item: SearchResultItem): string {
  return `${TYPE_LABEL[item.type]} - ${item.country}`;
}
