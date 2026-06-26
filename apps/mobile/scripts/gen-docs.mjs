// Reads the web app's Thai docs markdown, parses frontmatter, and emits a single
// content/docs.json the mobile bundle imports. Markdown body is kept raw and
// rendered on-device with react-native-markdown-display.
//   node scripts/gen-docs.mjs
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const here = dirname(fileURLToPath(import.meta.url));
const mobileRoot = join(here, '..');
const docsDir = join(mobileRoot, '..', 'web', 'content', 'docs');
const outFile = join(mobileRoot, 'content', 'docs.json');

function slugify(input) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'doc'
  );
}

function collect(base = '') {
  const out = [];
  const dir = base ? join(docsDir, base) : docsDir;
  for (const entry of readdirSync(dir)) {
    const rel = base ? `${base}/${entry}` : entry;
    const full = join(docsDir, rel);
    if (statSync(full).isDirectory()) out.push(...collect(rel));
    else if (entry.endsWith('.md') && !/\.[a-z]{2}\.md$/.test(entry)) out.push(rel);
  }
  return out;
}

const toolConfig = existsSync(join(docsDir, '_tools.json'))
  ? JSON.parse(readFileSync(join(docsDir, '_tools.json'), 'utf8'))
  : {};

const docs = [];
for (const file of collect()) {
  const raw = readFileSync(join(docsDir, file), 'utf8');
  const { data, content } = matter(raw);
  const tool = data.tool ?? 'AI';
  if (toolConfig[tool] === false) continue;
  docs.push({
    slug: file.replace(/\.md$/, ''),
    title: data.title ?? file,
    tool,
    toolSlug: slugify(tool),
    icon: data.icon ?? 'icon-docs',
    level: data.level ?? 'beginner',
    summary: data.summary ?? '',
    readTime: data.readTime ?? '5 นาที',
    locked: Boolean(data.locked),
    order: Number(data.order ?? 99),
    body: content,
  });
}

docs.sort((a, b) => a.order - b.order);
writeFileSync(outFile, JSON.stringify(docs));
const tools = new Set(docs.map((d) => d.toolSlug));
console.log(`Bundled ${docs.length} docs across ${tools.size} tools → content/docs.json`);
