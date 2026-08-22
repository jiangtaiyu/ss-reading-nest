import { describe, expect, it } from "vitest";
import { decodeTextBytes } from "./read-text-file.js";

describe("decodeTextBytes", () => {
  it("keeps valid UTF-8 text as UTF-8", () => {
    const result = decodeTextBytes(new TextEncoder().encode("连城诀\n第一章"));

    expect(result).toEqual({ text: "连城诀\n第一章", encoding: "utf-8" });
  });

  it("recognizes and removes a UTF-8 BOM", () => {
    const body = new TextEncoder().encode("正文");
    const bytes = Uint8Array.from([0xef, 0xbb, 0xbf, ...body]);

    expect(decodeTextBytes(bytes)).toEqual({ text: "正文", encoding: "utf-8" });
  });

  it("falls back to GB18030 for a legacy GBK novel", () => {
    const bytes = Uint8Array.from([
      0xc1, 0xac, 0xb3, 0xc7, 0xbe, 0xf7, 0x0a, 0xb5, 0xda, 0xd2, 0xbb, 0xd5, 0xc2
    ]);

    expect(decodeTextBytes(bytes)).toEqual({ text: "连城诀\n第一章", encoding: "gb18030" });
  });

  it.each([
    ["utf-16le", [0xff, 0xfe, 0x41, 0x00, 0x2d, 0x4e]],
    ["utf-16be", [0xfe, 0xff, 0x00, 0x41, 0x4e, 0x2d]]
  ] as const)("recognizes a %s BOM", (encoding, input) => {
    expect(decodeTextBytes(Uint8Array.from(input))).toEqual({ text: "A中", encoding });
  });
});
