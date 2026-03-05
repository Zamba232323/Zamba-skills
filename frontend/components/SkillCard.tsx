"use client";

import type { SkillCatalogEntry } from "@/lib/types";

const SOURCE_COLORS: Record<string, string> = {
  write: "bg-green-500/20 text-green-400 border-green-500/30",
  adopt: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  extend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  superpowers: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastni",
  adopt: "Adoptovany",
  extend: "Rozsireny",
  superpowers: "Superpowers",
};

interface SkillCardProps {
  skill: SkillCatalogEntry;
  onClick: () => void;
}

export default function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-600 hover:bg-zinc-800/80"
    >
      <div className="flex items-start justify-between mb-3">
        <code className="text-sm font-mono text-white">{skill.command}</code>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[skill.source]}`}>
          {SOURCE_LABELS[skill.source]}
        </span>
      </div>

      <h3 className="text-base font-semibold text-zinc-100 mb-1">{skill.name.cs}</h3>
      <p className="text-sm text-zinc-400 mb-3">{skill.description.cs}</p>

      <div className="text-xs text-zinc-500 mb-3">
        <span className="font-medium text-zinc-400">Kdy pouzit: </span>
        {skill.whenToUse.cs}
      </div>

      <div className="flex flex-wrap gap-1">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
