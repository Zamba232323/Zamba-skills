export interface LocalizedString {
  en: string;
  cs: string;
}

export interface SkillCatalogEntry {
  id: string;
  command: string;
  phase: string;
  source: "write" | "adopt" | "extend" | "superpowers";
  sourceBase?: string;
  sourceRepo?: string;
  tags: string[];
  name: LocalizedString;
  description: LocalizedString;
  whenToUse: { cs: string };
  detailedDescription: { cs: string };
}

export interface SkillCatalog {
  skills: SkillCatalogEntry[];
}

export interface PipelinePhase {
  id: string;
  name: string;
  description: string;
  skills: string[];
  skillSources: Record<string, string>;
  loop?: boolean;
  next: string | null;
}

export interface Pipeline {
  phases: PipelinePhase[];
}

export interface SkillContent {
  id: string;
  content: string;
  frontmatter: {
    name: string;
    description: string;
  };
}
