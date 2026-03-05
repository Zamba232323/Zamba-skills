"use client";

import { useEffect, useState, useMemo } from "react";
import SkillCard from "@/components/SkillCard";
import SkillDetail from "@/components/SkillDetail";
import SkillEditor from "@/components/SkillEditor";
import type { SkillCatalogEntry } from "@/lib/types";

const PHASE_LABELS: Record<string, string> = {
  "session-start": "Začátek relace",
  plan: "Plánování",
  build: "Build",
  quality: "Kvalita",
  integration: "Integrace",
  merge: "Merge",
};

const SOURCE_OPTIONS = [
  { value: "all", label: "Všechny zdroje" },
  { value: "write", label: "Vlastní" },
  { value: "adopt", label: "Adoptované" },
  { value: "extend", label: "Rozšířené" },
  { value: "superpowers", label: "Superpowers" },
];

export default function CatalogPage() {
  const [skills, setSkills] = useState<SkillCatalogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillCatalogEntry | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillCatalogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => setSkills(data.skills))
      .catch(() => setError("Nepodařilo se načíst skills"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.cs.toLowerCase().includes(search.toLowerCase()) ||
        s.command.toLowerCase().includes(search.toLowerCase()) ||
        s.description.cs.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesPhase = phaseFilter === "all" || s.phase === phaseFilter;
      const matchesSource = sourceFilter === "all" || s.source === sourceFilter;
      return matchesSearch && matchesPhase && matchesSource;
    });
  }, [skills, search, phaseFilter, sourceFilter]);

  if (error) return <div className="text-red-400 p-8">{error}</div>;
  if (loading) return <div className="text-zinc-400 p-8">Načítání...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Katalog skillů</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {skills.length} skillů v pipeline — klikni pro detaily a upravu.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Hledat skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
        />
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
        >
          <option value="all">Všechny fáze</option>
          {Object.entries(PHASE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-zinc-500">
        <span>Zobrazeno: {filtered.length}/{skills.length}</span>
        <span>Vlastní: {skills.filter((s) => s.source === "write").length}</span>
        <span>Adoptované: {skills.filter((s) => s.source === "adopt").length}</span>
        <span>Rozšířené: {skills.filter((s) => s.source === "extend").length}</span>
        <span>Superpowers: {skills.filter((s) => s.source === "superpowers").length}</span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-zinc-500 py-12">
          Žádné shody pro zadané filtry.
        </div>
      )}

      {/* Detail modal */}
      {selectedSkill && !editingSkill && (
        <SkillDetail
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onEdit={() => {
            setEditingSkill(selectedSkill);
            setSelectedSkill(null);
          }}
        />
      )}

      {/* Editor modal */}
      {editingSkill && (
        <SkillEditor
          skillId={editingSkill.id}
          skillName={editingSkill.name.cs}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
}
