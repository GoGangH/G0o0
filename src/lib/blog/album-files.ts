import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAlbum } from "./album-schema";
export function getAlbumDefinitions() {
  const directory = join(process.cwd(), "content/albums");
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((file) => file.endsWith(".md")).sort().map((file) => {
    try { return parseAlbum(file.slice(0, -3), readFileSync(join(directory, file), "utf8")); }
    catch (error) { throw new Error(`content/albums/${file}: ${(error as Error).message}`); }
  });
}
