import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { CATALOG_JSON } from "@/lib/paths";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id.includes("..") || id.includes("/") || id.includes("\\")) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

  try {
    const catalogRaw = await fs.readFile(CATALOG_JSON, "utf-8");
    const catalog = JSON.parse(catalogRaw);
    const skill = catalog.skills.find((s: any) => s.id === id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Failed to load skill" }, { status: 500 });
  }
}
