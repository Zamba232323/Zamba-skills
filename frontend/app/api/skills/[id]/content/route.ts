import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR } from "@/lib/paths";

function resolveSkillPath(id: string): string | null {
  const resolved = path.resolve(SKILLS_DIR, id, "SKILL.md");
  if (!resolved.startsWith(path.resolve(SKILLS_DIR) + path.sep)) {
    return null;
  }
  return resolved;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = resolveSkillPath(id);

  if (!skillPath) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

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
  const skillPath = resolveSkillPath(id);

  if (!skillPath) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof (body as any)?.content !== "string") {
    return NextResponse.json({ error: "content must be a string" }, { status: 400 });
  }

  try {
    await fs.mkdir(path.dirname(skillPath), { recursive: true });
    await fs.writeFile(skillPath, (body as any).content, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
