import type { ProfileOverviewResponse } from "./profile-types";

// O overview atual não expõe contagens de fotos/vídeos (não há endpoints de
// mídia no backend ainda). Lemos de forma defensiva para que, quando o backend
// passar a enviar `photosCount`/`videosCount`, as seções já reflitam os números
// sem outra alteração no frontend.
type MediaCounts = { photos: number; videos: number };

export function mediaCountsFromOverview(
  overview: ProfileOverviewResponse | null | undefined,
): MediaCounts {
  const counts = overview?.counts as
    | { photosCount?: number; videosCount?: number }
    | undefined;
  return {
    photos: counts?.photosCount ?? 0,
    videos: counts?.videosCount ?? 0,
  };
}
