"use client";

import { useEffect, useState } from "react";
import { rateProfile, getAverageRatings } from "@/lib/profile-service";
import type { RatingsAverage } from "@/lib/profile-types";
import { IconRating, type IconSet } from "./IconRating";

type ProfileRatingsProps = {
  targetUserId: string;
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

export function ProfileRatings({ targetUserId }: ProfileRatingsProps) {
  const [averages, setAverages] = useState<RatingsAverage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [targetUserId]);

  const handleRate = async (category: Category, step: number) => {
    setIsSubmitting(true);
    setError(null);
    // Feedback otimista: reflete o voto na hora; depois recarrega a média real.
    setAverages((prev) =>
      prev ? { ...prev, [category.avgField]: step / 6 } : prev,
    );

    try {
      await rateProfile({ targetUserId }, { [category.key]: step });
      const fresh = await getAverageRatings(targetUserId);
      setAverages(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao avaliar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayed = averages ?? EMPTY_AVERAGES;

  return (
    <>
      <div className="flex gap-4 py-1">
        {CATEGORIES.map((category) => (
          <IconRating
            key={category.key}
            label={category.label}
            icons={category.icons}
            averageFraction={displayed[category.avgField]}
            disabled={averages === null || isSubmitting}
            onRate={(step) => handleRate(category, step)}
          />
        ))}
      </div>
      {error && <div className="text-[11px] text-red-500">{error}</div>}
    </>
  );
}
