/** Classes grille éditoriale (12 colonnes) pour la galerie « Tous » */
const BENTO_PATTERN = [
  'sm:col-span-2 lg:col-span-7 lg:row-span-2 min-h-[220px] sm:min-h-[280px] lg:min-h-[420px]',
  'sm:col-span-1 lg:col-span-5 min-h-[180px] lg:min-h-[200px]',
  'sm:col-span-1 lg:col-span-5 min-h-[180px] lg:min-h-[200px]',
  'sm:col-span-2 lg:col-span-4 min-h-[200px] lg:min-h-[240px]',
  'sm:col-span-1 lg:col-span-4 min-h-[200px] lg:min-h-[240px]',
  'sm:col-span-1 lg:col-span-4 min-h-[200px] lg:min-h-[240px]',
] as const;

export function getGalleryBentoClass(index: number) {
  return BENTO_PATTERN[index % BENTO_PATTERN.length];
}

export function countByCategory<T extends { category: string }>(
  items: T[],
  categories: readonly string[],
) {
  const counts: Record<string, number> = { Tous: items.length };
  for (const cat of categories) {
    counts[cat] = items.filter((item) => item.category === cat).length;
  }
  return counts;
}
