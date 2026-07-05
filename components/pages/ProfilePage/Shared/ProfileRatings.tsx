"use client";

import { useState } from "react";
import { rateProfile } from "@/lib/profile-service";
import { CoolIndicator } from "@/utils/cool-indicator";
import { SexyIndicator } from "@/utils/sexy-indicator";
import { TrustableIndicator } from "@/utils/trustable-indicator";

type ProfileRatingsProps = {
  targetUserId: string;
  initialRatings?: {
    trust?: number;
    cool?: number;
    cute?: number;
  };
};

type RatingKey = "trust" | "cool" | "cute";

export function ProfileRatings({ targetUserId, initialRatings }: ProfileRatingsProps) {
  const [ratings, setRatings] = useState({
    trust: initialRatings?.trust || 0,
    cool: initialRatings?.cool || 0,
    cute: initialRatings?.cute || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (ratingKey: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [ratingKey]: value }));
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await rateProfile(
        { targetUserId },
        { trust: ratings.trust, cool: ratings.cool, cute: ratings.cute }
      );
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao avaliar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = ratings.trust + ratings.cool + ratings.cute;
  const maxTotal = 30; // 10 * 3
  const average = total / 3;

  return (
    <tr>
      <td className="pb-2">
        <div className="border-t border-orkut-border"></div>
        <table cellPadding={0} cellSpacing={0} className="border-collapse">
          <tbody>
            <tr className="align-top">
              {/* Trust Rating */}
              <td className="pr-3 align-top">
                <div className="text-[11px] leading-3.5 text-[#5a5a5a]">confiável</div>
                <div className="leading-4">
                  {submitted ? (
                    <TrustableIndicator trustablePercentage={ratings.trust / 10} />
                  ) : (
                    <RatingButtons
                      value={ratings.trust}
                      onChange={(v) => handleRating("trust", v)}
                    />
                  )}
                </div>
              </td>

              {/* Cool Rating */}
              <td className="pr-3 align-top">
                <div className="text-[11px] leading-3.5 text-[#5a5a5a]">legal</div>
                <div className="leading-4">
                  {submitted ? (
                    <CoolIndicator coolPercentage={ratings.cool / 10} />
                  ) : (
                    <RatingButtons
                      value={ratings.cool}
                      onChange={(v) => handleRating("cool", v)}
                    />
                  )}
                </div>
              </td>

              {/* Cute Rating */}
              <td className="align-top">
                <div className="text-[11px] leading-3.5 text-[#5a5a5a]">sexy</div>
                <div className="leading-4">
                  {submitted ? (
                    <SexyIndicator sexyPercentage={ratings.cute / 10} />
                  ) : (
                    <RatingButtons
                      value={ratings.cute}
                      onChange={(v) => handleRating("cute", v)}
                    />
                  )}
                </div>
              </td>
            </tr>

            {/* Submit Button Row */}
            {!submitted && (
              <tr>
                <td colSpan={3} className="pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || total === 0}
                    className="px-3 py-1 bg-orkut-bg border border-orkut-border text-[11px] text-[#5a5a5a] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orkut-border"
                  >
                    {isSubmitting ? "Enviando..." : "Avaliar"}
                  </button>
                  {error && (
                    <span className="ml-2 text-[11px] text-red-500">{error}</span>
                  )}
                </td>
              </tr>
            )}

            {/* Average Display */}
            {submitted && (
              <tr>
                <td colSpan={3} className="pt-2">
                  <div className="text-[11px] text-[#5a5a5a]">
                    Média: <strong>{average.toFixed(1)}</strong>/10 ({total}/30)
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="border-t border-orkut-border"></div>
      </td>
    </tr>
  );
}

function RatingButtons({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`w-4 h-4 text-[10px] leading-4 rounded-full border ${
            value >= num
              ? "bg-orkut-bg border-orkut-border"
              : "bg-white border-gray-200"
          }`}
          title={`${num}/10`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}