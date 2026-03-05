"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { PipelinePhase, SkillCatalogEntry } from "@/lib/types";

const SOURCE_COLORS: Record<string, string> = {
  write: "#22c55e",
  adopt: "#3b82f6",
  extend: "#f59e0b",
  superpowers: "#a855f7",
};

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastni",
  adopt: "Adoptovany",
  extend: "Rozsireny",
  superpowers: "Superpowers",
};

function PhaseNode({ data }: NodeProps) {
  const phase = data.phase as PipelinePhase;
  const skills = data.skills as SkillCatalogEntry[];
  const onSelectPhase = data.onSelectPhase as (id: string) => void;

  return (
    <div
      className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-lg cursor-pointer hover:border-zinc-500 transition-colors min-w-[220px]"
      onClick={() => onSelectPhase(phase.id)}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />
      <div className="mb-2 text-sm font-bold text-white">{phase.name}</div>
      <div className="mb-3 text-xs text-zinc-400">{phase.description}</div>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: SOURCE_COLORS[skill.source] + "cc" }}
            title={`${skill.name.cs} (${SOURCE_LABELS[skill.source]})`}
          >
            {skill.command}
          </span>
        ))}
      </div>
      {phase.loop && (
        <div className="mt-2 text-[10px] text-amber-400">Iterativni smycka</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
    </div>
  );
}

interface PipelineFlowProps {
  phases: PipelinePhase[];
  skills: SkillCatalogEntry[];
  onSelectPhase: (phaseId: string) => void;
}

export default function PipelineFlow({
  phases,
  skills,
  onSelectPhase,
}: PipelineFlowProps) {
  const nodeTypes = useMemo(() => ({ phase: PhaseNode }), []);

  const nodes: Node[] = phases.map((phase, i) => ({
    id: phase.id,
    type: "phase",
    position: { x: 250, y: i * 200 },
    data: {
      phase,
      skills: skills.filter((s) => s.phase === phase.id),
      onSelectPhase,
    },
  }));

  const edges: Edge[] = phases
    .filter((p) => p.next)
    .map((phase) => ({
      id: `${phase.id}-${phase.next}`,
      source: phase.id,
      target: phase.next!,
      animated: true,
      style: { stroke: "#52525b" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#52525b" },
    }));

  // Add loop edge for build phase
  const loopPhase = phases.find((p) => p.loop);
  if (loopPhase) {
    edges.push({
      id: `${loopPhase.id}-loop`,
      source: loopPhase.id,
      target: loopPhase.id,
      animated: true,
      style: { stroke: "#f59e0b" },
      type: "smoothstep",
    });
  }

  return (
    <div className="h-[700px] rounded-xl border border-zinc-800 bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!bg-zinc-800 !border-zinc-700 !text-white" />
      </ReactFlow>
    </div>
  );
}
