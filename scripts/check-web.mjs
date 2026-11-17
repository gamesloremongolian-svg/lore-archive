import { readdir, readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ignored = new Set(['.git', 'node_modules', 'www', 'android', 'ios', 'dist']);
const temp = await mkdtemp(join(tmpdir(), 'loreverse-js-check-'));
let checked = 0;
let failed = 0;

async function check(sourcePath, source, module) {
  const target = join(temp, 'inline-' + checked + (module ? '.mjs' : '.js'));
  await writeFile(target, source);
  const result = spawnSync(process.execPath, ['--check', target], { encoding: 'utf8' });
  checked++;
  if (result.status !== 0) {
    failed++;
    console.error('\nJavaScript syntax error: ' + sourcePath + '\n' + (result.stderr || result.stdout));
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
      let match;
      while ((match = pattern.exec(html))) {
        const attrs = match[1];
        const code = match[2].trim();
        if (!code || /\bsrc\s*=/.test(attrs)) continue;
        if (/\btype\s*=\s*["'](?:application\/ld\+json|importmap)["']/i.test(attrs)) continue;
        await check(path, code, /\btype\s*=\s*["']module["']/i.test(attrs));
      }
    }
  }
}

try {
  await walk(process.cwd());
  console.log('LOREVERSE inline JavaScript: ' + checked + ' блок шалгалаа, ' + failed + ' алдаа.');
  if (failed) process.exitCode = 1;
} finally {
  await rm(temp, { recursive: true, force: true });
}
