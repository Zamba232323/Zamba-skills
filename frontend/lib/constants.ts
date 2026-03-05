// Hex colors for React Flow nodes
export const SOURCE_HEX_COLORS: Record<string, string> = {
  write: "#22c55e",
  adopt: "#3b82f6",
  extend: "#f59e0b",
  superpowers: "#a855f7",
};

// Tailwind class variants for badges
export const SOURCE_BADGE_STYLES: Record<string, string> = {
  write: "bg-green-500/20 text-green-400 border-green-500/30",
  adopt: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  extend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  superpowers: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Short labels
export const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastni",
  adopt: "Adoptovany",
  extend: "Rozsireny",
  superpowers: "Superpowers",
};

// Long labels for detail view
export const SOURCE_LABELS_LONG: Record<string, string> = {
  write: "Vlastni (napsany od nuly)",
  adopt: "Adoptovany z komunity",
  extend: "Rozsireny (komunita + vlastni logika)",
  superpowers: "Superpowers (obra/superpowers)",
};
