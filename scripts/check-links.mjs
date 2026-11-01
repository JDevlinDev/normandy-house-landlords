// Fails the build if any local link points nowhere: an in-page #anchor with no matching id,
// or a relative href/src whose file doesn't exist. External URLs aren't checked.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const SRC = "src";
const pages = readdirSync(SRC).filter((f) => f.endsWith(".html"));
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const problems = [];

for (const page of pages) {
  const file = join(SRC, page);
  const html = readFileSync(file, "utf8");
  const ids = idsIn(html);

  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(value) || value === "#") continue;
    const line = html.slice(0, html.indexOf(`${attr}="${value}"`)).split("\n").length;
    const [path, anchor] = value.split("#");

    if (!path) {
      if (!ids.has(anchor)) problems.push(`${file}:${line}  #${anchor} has no matching id`);
      continue;
    }

    const target = resolve(dirname(file), path.split("?")[0]);
    if (!existsSync(target)) {
      problems.push(`${file}:${line}  ${path} does not exist`);
    } else if (anchor && target.endsWith(".html") && !idsIn(readFileSync(target, "utf8")).has(anchor)) {
      problems.push(`${file}:${line}  ${value}: no id "${anchor}" in ${path}`);
    }
  }
}

if (problems.length) {
  console.error(`Broken links:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Links OK (${pages.length} page${pages.length === 1 ? "" : "s"})`);
