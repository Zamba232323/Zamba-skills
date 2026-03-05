"use client";

import { useEffect, useState } from "react";
import PipelineFlow from "@/components/PipelineFlow";
import type { Pipeline, SkillCatalog, SkillCatalogEntry, PipelinePhase } from "@/lib/types";

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

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [catalog, setCatalog] = useState<SkillCatalog | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pipeline")
      .then((r) => r.json())
      .then((data) => {
        setPipeline(data.pipeline);
        setCatalog(data.catalog);
      })
      .catch(() => setError("Nepodarilo se nacist pipeline data"));
  }, []);

  if (error) return <div className="text-red-400 p-8">{error}</div>;
  if (!pipeline || !catalog) return <div className="text-zinc-400 p-8">Nacitani...</div>;

  const selectedPhaseData = pipeline.phases.find((p) => p.id === selectedPhase);
  const phaseSkills = selectedPhaseData
    ? catalog.skills.filter((s) => s.phase === selectedPhaseData.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Vizualizace workflow — od zacatku relace po merge. Klikni na fazi pro detaily.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {Object.entries(SOURCE_LABELS).map(([key, label]) => (
          <span key={key} className={`rounded-full border px-2 py-1 ${SOURCE_COLORS[key]}`}>
            {label}
          </span>
        ))}
      </div>

      <PipelineFlow
        phases={pipeline.phases}
        skills={catalog.skills}
        onSelectPhase={setSelectedPhase}
      />

      {/* Phase detail panel */}
      {selectedPhaseData && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-bold mb-1">{selectedPhaseData.name}</h2>
          <p className="text-zinc-400 text-sm mb-4">{selectedPhaseData.description}</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phaseSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-sm font-mono text-white">{skill.command}</code>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${SOURCE_COLORS[skill.source]}`}>
                    {SOURCE_LABELS[skill.source]}
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-200 mb-1">
                  {skill.name.cs}
                </div>
                <div className="text-xs text-zinc-400 mb-2">
                  {skill.description.cs}
                </div>
                <div className="flex flex-wrap gap-1">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
