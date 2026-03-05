import path from "path";

// Monorepo root: use REPO_ROOT env var if set, otherwise assume cwd is frontend/
export const REPO_ROOT = process.env.REPO_ROOT || path.resolve(process.cwd(), "..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const PIPELINE_DIR = path.join(REPO_ROOT, "pipeline");
export const PIPELINE_JSON = path.join(PIPELINE_DIR, "pipeline.json");
export const CATALOG_JSON = path.join(PIPELINE_DIR, "skills-catalog.json");
