"use client";

import { useEffect, useState } from "react";
import type { SkillCatalogEntry, SkillContent } from "@/lib/types";

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastni (napsany od nuly)",
  adopt: "Adoptovany z komunity",
  extend: "Rozsireny (komunita + vlastni logika)",
  superpowers: "Superpowers (obra/superpowers)",
};

interface SkillDetailProps {
  skill: SkillCatalogEntry;
  onClose: () => void;
  onEdit: () => void;
}

export default function SkillDetail({ skill, onClose, onEdit }: SkillDetailProps) {
  const [content, setContent] = useState<SkillContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/skills/${skill.id}/content`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [skill.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{skill.name.cs}</h2>
              <code className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-300">
                {skill.command}
              </code>
            </div>
            <p className="text-sm text-zinc-500">
              {SOURCE_LABELS[skill.source]}
              {skill.sourceRepo && ` — ${skill.sourceRepo}`}
              {skill.sourceBase && ` — zaklad: ${skill.sourceBase}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            X
          </button>
        </div>

        {/* Metadata sections */}
        <div className="space-y-4 mb-6">
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Popis</h3>
            <p className="text-sm text-zinc-400">{skill.description.cs}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Kdy pouzit</h3>
            <p className="text-sm text-zinc-400">{skill.whenToUse.cs}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Detailni popis</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {skill.detailedDescription.cs}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Faze pipeline</h3>
            <span className="inline-block rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
              {skill.phase}
            </span>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Stitky</h3>
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* SKILL.md content preview */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-300">SKILL.md obsah</h3>
            <button
              onClick={onEdit}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              Upravit v editoru
            </button>
          </div>
          {loading ? (
            <div className="text-sm text-zinc-500">Nacitani...</div>
          ) : content ? (
            <pre className="max-h-[400px] overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-400 border border-zinc-800">
              {content.content}
            </pre>
          ) : (
            <div className="text-sm text-zinc-500">
              Soubor SKILL.md zatim neexistuje.
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Zavrit
          </button>
        </div>
      </div>
    </div>
  );
}
