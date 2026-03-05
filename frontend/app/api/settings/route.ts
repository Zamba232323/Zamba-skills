import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { SKILLS_DIR, REPO_ROOT } from "@/lib/paths";

export async function GET() {
  try {
    const claudeSkillsDir = path.join(os.homedir(), ".claude", "skills");

    // Check symlink status for each skill
    const skillDirs = await fs.readdir(SKILLS_DIR).catch(() => []);
    const symlinks = await Promise.all(
      skillDirs.map(async (name) => {
        const target = path.join(claudeSkillsDir, name);
        let status: "linked" | "missing" | "conflict" = "missing";
        try {
          const stat = await fs.lstat(target);
          if (stat.isSymbolicLink()) {
            const linkTarget = await fs.readlink(target);
            const expected = path.join(SKILLS_DIR, name);
            status = linkTarget === expected || linkTarget === expected.replace(/\\/g, "/")
              ? "linked"
              : "conflict";
          } else {
            status = "conflict";
          }
        } catch {
          status = "missing";
        }
        return { name, status };
      })
    );

    // System info
    const info = {
      repoRoot: REPO_ROOT,
      skillsDir: SKILLS_DIR,
      claudeSkillsDir,
      platform: process.platform,
      nodeVersion: process.version,
      skillCount: skillDirs.length,
    };

    return NextResponse.json({ symlinks, info });
  } catch (error) {
    console.error("Failed to load settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
