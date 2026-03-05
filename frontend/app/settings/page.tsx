"use client";

import { useEffect, useState } from "react";

interface SymlinkStatus {
  name: string;
  status: "linked" | "missing" | "conflict";
}

interface SystemInfo {
  repoRoot: string;
  skillsDir: string;
  claudeSkillsDir: string;
  platform: string;
  nodeVersion: string;
  skillCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  linked: "bg-green-500/20 text-green-400",
  missing: "bg-red-500/20 text-red-400",
  conflict: "bg-amber-500/20 text-amber-400",
};

const STATUS_LABELS: Record<string, string> = {
  linked: "Propojeno",
  missing: "Chybí symlink",
  conflict: "Konflikt — jiný cíl",
};

export default function SettingsPage() {
  const [symlinks, setSymlinks] = useState<SymlinkStatus[]>([]);
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => {
        setSymlinks(data.symlinks);
        setInfo(data.info);
      })
      .catch(() => setError("Nepodařilo se načíst nastavení"))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div className="text-red-400 p-8">{error}</div>;
  if (loading) return <div className="text-zinc-400 p-8">Načítání...</div>;

  const linked = symlinks.filter((s) => s.status === "linked").length;
  const missing = symlinks.filter((s) => s.status === "missing").length;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Nastavení</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Stav instalace, symlinky, systemove informace.
        </p>
      </div>

      {/* System info */}
      {info && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold mb-4">System</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-zinc-500">Platforma</dt>
            <dd className="text-zinc-300 font-mono">{info.platform}</dd>
            <dt className="text-zinc-500">Node.js</dt>
            <dd className="text-zinc-300 font-mono">{info.nodeVersion}</dd>
            <dt className="text-zinc-500">Repo root</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.repoRoot}</dd>
            <dt className="text-zinc-500">Skills adresar</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.skillsDir}</dd>
            <dt className="text-zinc-500">Claude skills</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.claudeSkillsDir}</dd>
            <dt className="text-zinc-500">Pocet skillu</dt>
            <dd className="text-zinc-300">{info.skillCount}</dd>
          </dl>
        </section>
      )}

      {/* Symlink status */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Stav symlinků</h2>
          <div className="text-xs text-zinc-500">
            {linked}/{symlinks.length} propojeno
            {missing > 0 && (
              <span className="text-red-400 ml-2">({missing} chybi)</span>
            )}
          </div>
        </div>

        {missing > 0 && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Některé symlinky chybí. Spust instalacni skript:
            <code className="block mt-1 text-xs font-mono text-amber-400">
              {info?.platform === "win32"
                ? "powershell -ExecutionPolicy Bypass ./scripts/install.ps1"
                : "./scripts/install.sh"}
            </code>
          </div>
        )}

        <div className="space-y-2">
          {symlinks.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-2.5"
            >
              <span className="text-sm font-mono text-zinc-300">{s.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[s.status]}`}>
                {STATUS_LABELS[s.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold mb-4">Užitečné příkazy</h2>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-zinc-400 mb-1">Nainstalovat/aktualizovat symlinky:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              {info?.platform === "win32"
                ? "powershell -ExecutionPolicy Bypass .\\scripts\\install.ps1"
                : "./scripts/install.sh"}
            </code>
          </div>
          <div>
            <div className="text-zinc-400 mb-1">Spustit dashboard:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              cd frontend && npm run dev
            </code>
          </div>
          <div>
            <div className="text-zinc-400 mb-1">Synchronizovat s GitHub:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              git pull && git push
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
