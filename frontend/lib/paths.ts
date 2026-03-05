import path from "path";

// Monorepo root is one level above frontend/
export const REPO_ROOT = path.resolve(process.cwd(), "..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const PIPELINE_DIR = path.join(REPO_ROOT, "pipeline");
export const PIPELINE_JSON = path.join(PIPELINE_DIR, "pipeline.json");
export const CATALOG_JSON = path.join(PIPELINE_DIR, "skills-catalog.json");
