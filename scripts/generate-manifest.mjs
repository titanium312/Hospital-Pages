import { promises as fs } from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'public', 'pages');
const OUT_FILE = path.join(process.cwd(), 'pages-list.json');

function extractTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/is);
  return m ? m[1].trim() : null;
}

function toDisplayName(filename) {
  return filename
    .replace(/\.html?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function main() {
  try {
    const entries = await fs.readdir(PAGES_DIR, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile() && /\.html?$/i.test(e.name))
      .map(e => e.name)
      .sort((a, b) => a.localeCompare(b));

    const items = [];
    for (const file of files) {
      const full = path.join(PAGES_DIR, file);
      const html = await fs.readFile(full, 'utf8');
      const title = extractTitle(html) || toDisplayName(file);
      items.push({ href: `/pages/${file}`, file, title });
    }

    const json = JSON.stringify({ items }, null, 2);
    await fs.writeFile(OUT_FILE, json, 'utf8');
    console.log(`Generated ${OUT_FILE} with ${items.length} items.`);
  } catch (err) {
    console.error('Error generating pages-list.json:', err);
    // Still write an empty list so the UI can load gracefully
    await fs.writeFile(OUT_FILE, JSON.stringify({ items: [] }, null, 2), 'utf8');
  }
}

main();
