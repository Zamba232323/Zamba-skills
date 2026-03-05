"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface SkillEditorProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
}

function getTemplate(skillId: string): string {
  return `---
name: ${skillId}
description: "Use when [condition] — [what it does]"
---

# ${skillId.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}

## Overview

[What this skill does and when to use it]

## Process

### Step 1: [First step]

[Details]

### Step 2: [Second step]

[Details]
`;
}

export default function SkillEditor({ skillId, skillName, onClose }: SkillEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/${skillId}/content`)
      .then((r) => (r.ok ? r.json() : { content: getTemplate(skillId) }))
      .then((data) => {
        setContent(data.content);
        setOriginalContent(data.content);
      })
      .catch(() => {
        const tpl = getTemplate(skillId);
        setContent(tpl);
        setOriginalContent(tpl);
      })
      .finally(() => setLoading(false));
  }, [skillId]);

  const hasChanges = content !== originalContent;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${skillId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setOriginalContent(content);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Zpet
          </button>
          <span className="text-sm font-medium text-white">
            {skillName} — <code className="text-zinc-400">skills/{skillId}/SKILL.md</code>
          </span>
          {hasChanges && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
              Neulozene zmeny
            </span>
          )}
          {saved && (
            <span className="rounded bg-green-500/20 px-2 py-0.5 text-[10px] text-green-400">
              Ulozeno
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Ukladam..." : "Ulozit"}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            Nacitani editoru...
          </div>
        ) : (
          <Editor
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              wordWrap: "on",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </div>
    </div>
  );
}
