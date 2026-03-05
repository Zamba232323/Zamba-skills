import { describe, it, expect } from "vitest";
import fs from "fs";
import { REPO_ROOT, SKILLS_DIR, PIPELINE_DIR, PIPELINE_JSON, CATALOG_JSON } from "../lib/paths";

describe("paths", () => {
  it("REPO_ROOT points to a directory with skills/ and pipeline/", () => {
    expect(fs.existsSync(REPO_ROOT)).toBe(true);
    expect(fs.existsSync(SKILLS_DIR)).toBe(true);
    expect(fs.existsSync(PIPELINE_DIR)).toBe(true);
  });

  it("PIPELINE_JSON exists", () => {
    expect(fs.existsSync(PIPELINE_JSON)).toBe(true);
  });

  it("CATALOG_JSON exists", () => {
    expect(fs.existsSync(CATALOG_JSON)).toBe(true);
  });

  it("SKILLS_DIR contains skill directories", () => {
    const skills = fs.readdirSync(SKILLS_DIR);
    expect(skills.length).toBeGreaterThan(0);
    expect(skills).toContain("start-session");
  });
});
