import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR, CATALOG_JSON } from "@/lib/paths";

export async function GET() {
  try {
    const catalogRaw = await fs.readFile(CATALOG_JSON, "utf-8");
    const catalog = JSON.parse(catalogRaw);

    // Enrich with actual file existence
    const skills = await Promise.all(
      catalog.skills.map(async (skill: any) => {
        const skillPath = path.join(SKILLS_DIR, skill.id, "SKILL.md");
        let exists = false;
        try {
          await fs.access(skillPath);
          exists = true;
        } catch {}
        return { ...skill, fileExists: exists };
      })
    );

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Failed to load skills:", error);
    return NextResponse.json(
      { error: "Failed to load skills" },
      { status: 500 }
    );
  }
}
