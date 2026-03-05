import { describe, it, expect } from "vitest";
import {
  SOURCE_HEX_COLORS,
  SOURCE_BADGE_STYLES,
  SOURCE_LABELS,
  SOURCE_LABELS_LONG,
} from "../lib/constants";

const EXPECTED_SOURCES = ["write", "adopt", "extend", "superpowers"];

describe("SOURCE_HEX_COLORS", () => {
  it("has all source types", () => {
    for (const source of EXPECTED_SOURCES) {
      expect(SOURCE_HEX_COLORS[source]).toBeDefined();
    }
  });

  it("values are hex colors", () => {
    for (const color of Object.values(SOURCE_HEX_COLORS)) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("SOURCE_BADGE_STYLES", () => {
  it("has all source types", () => {
    for (const source of EXPECTED_SOURCES) {
      expect(SOURCE_BADGE_STYLES[source]).toBeDefined();
    }
  });

  it("values contain Tailwind classes", () => {
    for (const style of Object.values(SOURCE_BADGE_STYLES)) {
      expect(style).toContain("bg-");
      expect(style).toContain("text-");
      expect(style).toContain("border-");
    }
  });
});

describe("SOURCE_LABELS", () => {
  it("has all source types", () => {
    for (const source of EXPECTED_SOURCES) {
      expect(SOURCE_LABELS[source]).toBeDefined();
    }
  });

  it("uses proper Czech diacritics", () => {
    expect(SOURCE_LABELS.write).toBe("Vlastní");
    expect(SOURCE_LABELS.adopt).toBe("Adoptovaný");
    expect(SOURCE_LABELS.extend).toBe("Rozšířený");
    expect(SOURCE_LABELS.superpowers).toBe("Superpowers");
  });
});

describe("SOURCE_LABELS_LONG", () => {
  it("has all source types", () => {
    for (const source of EXPECTED_SOURCES) {
      expect(SOURCE_LABELS_LONG[source]).toBeDefined();
    }
  });

  it("long labels are longer than short labels", () => {
    for (const source of EXPECTED_SOURCES) {
      expect(SOURCE_LABELS_LONG[source].length).toBeGreaterThanOrEqual(
        SOURCE_LABELS[source].length
      );
    }
  });
});
