"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  rateProfile,
  getAverageRatings,
  getRatedCategories,
} from "@/lib/profile-service";
import type { CreateProfileRatingRequest, RatingsAverage } from "@/lib/profile-types";
import { IconRating, type IconSet } from "./IconRating";

type ProfileRatingsProps = {
  targetUserId: string;
  /** No próprio perfil o usuário não avalia a si mesmo: só lê a média recebida. */
  isOwnProfile: boolean;
};

type CategoryKey = "trustworthy" | "legal" | "sexy";

type Category = {
  key: CategoryKey;
  label: string;
  icons: IconSet;
  avgField: keyof RatingsAverage;
};

// Ordem clássica do Orkut: confiável, legal, sexy.
const CATEGORIES: Category[] = [
  {
    key: "trustworthy",
    label: "confiável",
    avgField: "trustworthyPercentage",
    icons: {
      on: "/icons/icn_trusty_on.png",
      half: "/icons/icn_trusty_half.png",
      off: "/icons/icn_trusty_off.png",
    },
  },
  {
    key: "legal",
    label: "legal",
    avgField: "legalPercentage",
    icons: {
      on: "/icons/icn_cool_on.png",
      half: "/icons/icn_cool_half.png",
      off: "/icons/icn_cool_off.png",
    },
  },
  {
    key: "sexy",
    label: "sexy",
    avgField: "sexyPercentage",
    icons: {
      on: "/icons/icn_cute_on.png",
      half: "/icons/icn_cute_half.png",
      off: "/icons/icn_cute_off.png",
    },
  },
];

const EMPTY_AVERAGES: RatingsAverage = {
  legalPercentage: 0,
  trustworthyPercentage: 0,
  sexyPercentage: 0,
};


export function ProfileRatings({ targetUserId, isOwnProfile }: ProfileRatingsProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.userId ?? null;

  const [averages, setAverages] = useState<RatingsAverage | null>(null);
  // Categorias que o usuário já avaliou neste perfil (leitura da média).
  const [rated, setRated] = useState<Set<CategoryKey>>(new Set());
  // Categorias com envio em andamento (evita clique duplo).
  const [submitting, setSubmitting] = useState<Set<CategoryKey>>(new Set());
  const [error, setError] = useState<string | null>(null);
  // Só liberamos os cliques depois de saber o que já foi avaliado.
  const [hydrated, setHydrated] = useState(isOwnProfile);

  // Descobre no servidor quais categorias o usuário já avaliou neste perfil.
  useEffect(() => {
    if (isOwnProfile) {
      setHydrated(true);
      return;
    }
    if (!currentUserId) return; // aguarda a sessão hidratar no cliente
    let active = true;
    getRatedCategories(targetUserId)
      .then((flags) => {
        if (!active) return;
        const next = new Set<CategoryKey>();
        for (const category of CATEGORIES) {
          if (flags[category.key]) next.add(category.key);
        }
        setRated(next);
        setHydrated(true);
      })
      .catch(() => {
        // Falha na consulta: libera os cliques tratando tudo como não avaliado.
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, [isOwnProfile, currentUserId, targetUserId]);

  // Busca a média quando há alguma categoria em modo leitura (próprio perfil ou
  // já avaliada). Re-executa a cada avaliação para refletir a nota recém-enviada.
  useEffect(() => {
    if (!isOwnProfile && rated.size === 0) return;
    let active = true;
    getAverageRatings(targetUserId)
      .then((data) => {
        if (active) setAverages(data);
      })
      .catch(() => {
        if (active) setAverages(EMPTY_AVERAGES);
      });
    return () => {
      active = false;
    };
  }, [isOwnProfile, targetUserId, rated]);

  const handleRate = async (category: CategoryKey, step: number) => {
    if (!currentUserId || rated.has(category) || submitting.has(category)) return;
    setSubmitting((prev) => new Set(prev).add(category));
    setError(null);

    const request: CreateProfileRatingRequest = { [category]: step };

    try {
      await rateProfile({ targetUserId }, request);
      // A categoria avaliada passa a ler a média; o servidor persiste o estado,
      // então não precisamos mais marcar nada localmente.
      setRated((prev) => new Set(prev).add(category));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao avaliar perfil");
    } finally {
      setSubmitting((prev) => {
        const next = new Set(prev);
        next.delete(category);
        return next;
      });
    }
  };

  const avg = averages ?? EMPTY_AVERAGES;

  return (
    <>
      <div className="flex gap-4 py-1">
        {CATEGORIES.map((category) => {
          const isReadOnly = isOwnProfile || rated.has(category.key);
          return (
            <IconRating
              key={category.key}
              label={category.label}
              // Categoria avaliada mostra a média; a avaliar começa vazia.
              averageFraction={isReadOnly ? avg[category.avgField] : 0}
              icons={category.icons}
              disabled={
                isReadOnly
                  ? averages === null // aguardando a média carregar
                  : !hydrated || !currentUserId || submitting.has(category.key)
              }
              onRate={(step) => handleRate(category.key, step)}
            />
          );
        })}
      </div>
      {error && <div className="text-[11px] text-red-500">{error}</div>}
    </>
  );
}
