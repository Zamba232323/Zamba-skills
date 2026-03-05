import { NextResponse } from "next/server";
import fs from "fs/promises";
import { PIPELINE_JSON, CATALOG_JSON } from "@/lib/paths";

export async function GET() {
  try {
    const [pipelineRaw, catalogRaw] = await Promise.all([
      fs.readFile(PIPELINE_JSON, "utf-8"),
      fs.readFile(CATALOG_JSON, "utf-8"),
    ]);
    return NextResponse.json({
      pipeline: JSON.parse(pipelineRaw),
      catalog: JSON.parse(catalogRaw),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load pipeline data" },
      { status: 500 }
    );
  }
}
