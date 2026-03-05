import { describe, it, expect } from "vitest";
import path from "path";

// Replicate the resolveSkillPath logic from api/skills/[id]/content/route.ts
const SKILLS_DIR = path.resolve(__dirname, "../../skills");

function resolveSkillPath(id: string): string | null {
  const resolved = path.resolve(SKILLS_DIR, id, "SKILL.md");
  if (!resolved.startsWith(path.resolve(SKILLS_DIR) + path.sep)) {
    return null;
  }
  return resolved;
}

function isValidSkillId(id: string): boolean {
  return !id.includes("..") && !id.includes("/") && !id.includes("\\");
}

describe("resolveSkillPath", () => {
  it("resolves valid skill IDs", () => {
    const result = resolveSkillPath("start-session");
    expect(result).not.toBeNull();
    expect(result).toContain("skills");
    expect(result).toContain("start-session");
    expect(result).toMatch(/SKILL\.md$/);
  });

  it("rejects path traversal with ..", () => {
    expect(resolveSkillPath("../../etc")).toBeNull();
  });

  it("rejects path traversal with ../", () => {
    expect(resolveSkillPath("../../../etc/passwd")).toBeNull();
  });

  it("rejects path traversal with encoded dots", () => {
    expect(resolveSkillPath("..\\..\\windows\\system32")).toBeNull();
  });

  it("rejects path traversal going up one level", () => {
    expect(resolveSkillPath("..")).toBeNull();
  });
});

describe("isValidSkillId", () => {
  it("accepts simple IDs", () => {
    expect(isValidSkillId("start-session")).toBe(true);
    expect(isValidSkillId("scope-check")).toBe(true);
    expect(isValidSkillId("generate-tests")).toBe(true);
  });

  it("rejects IDs with ..", () => {
    expect(isValidSkillId("..")).toBe(false);
    expect(isValidSkillId("../../etc")).toBe(false);
  });

  it("rejects IDs with forward slash", () => {
    expect(isValidSkillId("foo/bar")).toBe(false);
  });

  it("rejects IDs with backslash", () => {
    expect(isValidSkillId("foo\\bar")).toBe(false);
  });
});
