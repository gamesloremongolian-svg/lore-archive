import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'www');
const excluded = new Set([
  '.git', '.github', 'node_modules', 'android', 'ios', 'www', 'dist',
  'package.json', 'package-lock.json', 'capacitor.config.ts', 'tsconfig.json'
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name.startsWith('.')) continue;
  const source = path.join(root, entry.name);
  const destination = path.join(out, entry.name);
  await cp(source, destination, { recursive: true });
}
console.log('LOREVERSE web app copied to ./www');
