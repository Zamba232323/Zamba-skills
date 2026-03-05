import path from "path";

// Use __dirname to resolve repo root regardless of cwd
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const PIPELINE_DIR = path.join(REPO_ROOT, "pipeline");
export const PIPELINE_JSON = path.join(PIPELINE_DIR, "pipeline.json");
export const CATALOG_JSON = path.join(PIPELINE_DIR, "skills-catalog.json");
