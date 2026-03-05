import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR } from "@/lib/paths";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = path.join(SKILLS_DIR, id, "SKILL.md");

  try {
    const content = await fs.readFile(skillPath, "utf-8");

    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter: Record<string, string> = {};
    if (fmMatch) {
      fmMatch[1].split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
          frontmatter[key.trim()] = rest.join(":").trim().replace(/^["']|["']$/g, "");
        }
      });
    }

    return NextResponse.json({ id, content, frontmatter });
  } catch {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = path.join(SKILLS_DIR, id, "SKILL.md");
  const { content } = await request.json();

  try {
    await fs.mkdir(path.dirname(skillPath), { recursive: true });
    await fs.writeFile(skillPath, content, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
