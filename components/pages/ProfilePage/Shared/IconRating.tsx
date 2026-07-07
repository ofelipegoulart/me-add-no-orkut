"use client";

import { useState } from "react";

export type IconSet = { on: string; half: string; off: string };

// Estado de um ícone (0..2) para um dado "passo" 0..6.
// Cada ícone vale 2 passos: metade (ímpar) e cheio (par).
//   ícone 0 -> meio em 1, cheio em 2
//   ícone 1 -> meio em 3, cheio em 4
//   ícone 2 -> meio em 5, cheio em 6
function iconStateForStep(iconIndex: number, step: number): keyof IconSet {
  const fullAt = (iconIndex + 1) * 2; // 2, 4, 6
  if (step >= fullAt) return "on";
  if (step >= fullAt - 1) return "half"; // 1, 3, 5
  return "off";
}

type IconRatingProps = {
  label: string;
  icons: IconSet;
  /** Fração 0..1 exibida por padrão (média recebida). */
  averageFraction: number;
  disabled?: boolean;
  /** Chamado ao clicar em um meio-ícone. `step` vai de 1 a 6. */
  onRate: (step: number) => void;
};

export function IconRating({
  label,
  icons,
  averageFraction,
  disabled,
  onRate,
}: IconRatingProps) {
  const [hoverStep, setHoverStep] = useState<number | null>(null);

  const committedStep = Math.max(0, Math.min(6, Math.round(averageFraction * 6)));
  const shownStep = hoverStep ?? committedStep;

  return (
    <div>
      <div className="text-[11px] leading-3.5 text-[#5a5a5a]">{label}</div>
      <div
        className="relative inline-flex leading-4"
        onMouseLeave={() => setHoverStep(null)}
      >
        {[0, 1, 2].map((iconIndex) => {
          const state = iconStateForStep(iconIndex, shownStep);
          const leftStep = iconIndex * 2 + 1; // metade
          const rightStep = iconIndex * 2 + 2; // cheio
          return (
            <span
              key={iconIndex}
              className="relative inline-block"
              style={{ width: 16, height: 16 }}
            >
              <img
                src={icons[state]}
                alt=""
                width={16}
                height={16}
                className="block"
              />
              {!disabled && (
                <>
                  <button
                    type="button"
                    title={`${label}: ${leftStep}/6`}
                    aria-label={`${label}: ${leftStep} de 6`}
                    className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
                    onMouseEnter={() => setHoverStep(leftStep)}
                    onClick={() => onRate(leftStep)}
                  />
                  <button
                    type="button"
                    title={`${label}: ${rightStep}/6`}
                    aria-label={`${label}: ${rightStep} de 6`}
                    className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
                    onMouseEnter={() => setHoverStep(rightStep)}
                    onClick={() => onRate(rightStep)}
                  />
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
