export type TextFileEncoding = "utf-8" | "utf-16le" | "utf-16be" | "gb18030";

export interface DecodedTextFile {
  text: string;
  encoding: TextFileEncoding;
}

const UTF8_BOM = [0xef, 0xbb, 0xbf] as const;
const UTF16LE_BOM = [0xff, 0xfe] as const;
const UTF16BE_BOM = [0xfe, 0xff] as const;

export async function readTextFile(file: File): Promise<DecodedTextFile> {
  return decodeTextBytes(new Uint8Array(await file.arrayBuffer()));
}

export function decodeTextBytes(bytes: Uint8Array): DecodedTextFile {
  if (startsWith(bytes, UTF8_BOM)) {
    return decode(bytes.subarray(UTF8_BOM.length), "utf-8");
  }
  if (startsWith(bytes, UTF16LE_BOM)) {
    return decode(bytes.subarray(UTF16LE_BOM.length), "utf-16le");
  }
  if (startsWith(bytes, UTF16BE_BOM)) {
    return decode(bytes.subarray(UTF16BE_BOM.length), "utf-16be");
  }

  try {
    return decode(bytes, "utf-8");
  } catch {
    // GB18030 is a superset of GBK and is the safest browser-native fallback
    // for legacy Simplified Chinese TXT files.
    return decode(bytes, "gb18030");
  }
}

function decode(bytes: Uint8Array, encoding: TextFileEncoding): DecodedTextFile {
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
  return { text, encoding };
}

function startsWith(bytes: Uint8Array, prefix: readonly number[]): boolean {
  return prefix.every((value, index) => bytes[index] === value);
}
