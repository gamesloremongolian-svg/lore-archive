import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'www');
const excluded = new Set([
  '.git', '.github', 'node_modules', 'android', 'ios', 'www', 'dist',
  'package.json', 'package-lock.json', 'capacitor.config.ts', 'tsconfig.json',
  'tests', 'scripts', 'supabase', 'README.md', 'ANDROID_RELEASE.md', 'index.backup.html'
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name.startsWith('.')) continue;
  const source = path.join(root, entry.name);
  const destination = path.join(out, entry.name);
  await cp(source, destination, { recursive: true });
}

const nativeShell = `
<style id="loreverse-native-shell-shared">
#loreverseAppNav{display:none}
html.capacitor-app body{padding-bottom:calc(82px + env(safe-area-inset-bottom))}
html.capacitor-app #loreverseAppNav{position:fixed!important;z-index:1200!important;inset:auto 0 0 0!important;width:100%!important;min-height:76px;display:flex!important;flex-direction:row!important;align-items:stretch!important;justify-content:space-around!important;gap:2px!important;margin:0!important;padding:8px 7px calc(8px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important;background:#fff!important;border:0!important;border-top:1px solid #dce3da!important;box-shadow:0 -8px 24px #24302412!important}
html.capacitor-app #loreverseAppNav a{flex:1 1 0!important;min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:5px 2px!important;border-radius:10px;color:#667166!important;font:750 10px/1.2 system-ui!important;text-align:center;text-decoration:none!important}
html.capacitor-app #loreverseAppNav a[aria-current="page"]{background:#edf3e9!important;color:#587a45!important}
html.capacitor-app #loreverseAppNav .app-nav-icon{font-size:19px;line-height:1.2}
@media(max-width:390px){html.capacitor-app #loreverseAppNav a{font-size:9px!important}html.capacitor-app #loreverseAppNav .app-nav-icon{font-size:17px}}
</style>
<nav id="loreverseAppNav" aria-label="Аппын үндсэн цэс">
<a href="/" data-app-route="home"><span class="app-nav-icon" aria-hidden="true">⌂</span><span>Нүүр</span></a>
<a href="/community/" data-app-route="community"><span class="app-nav-icon" aria-hidden="true">◎</span><span>Нийгэмлэг</span></a>
<a href="/store/" data-app-route="store"><span class="app-nav-icon" aria-hidden="true">▣</span><span>Дэлгүүр</span></a>
<a href="/profile/" data-app-route="profile"><span class="app-nav-icon" aria-hidden="true">♙</span><span>Профайл</span></a>
<a href="/?openBugReport=1" aria-label="Алдаа мэдээллэх"><span class="app-nav-icon" aria-hidden="true">⚑</span><span>Алдаа</span></a>
</nav>
<script>
(()=>{try{const c=window.Capacitor;const native=!!(c&&(c.isNativePlatform?.()||["android","ios"].includes(c.getPlatform?.())));if(!native)return;document.documentElement.classList.add("capacitor-app");const p=location.pathname.replace(/\\/+$/,"/");const routes={home:/\\/$/,community:/\\/community\\//,store:/\\/store\\//,profile:/\\/profile\\//};const key=Object.keys(routes).find(k=>routes[k].test(p))||"home";const a=document.querySelector('#loreverseAppNav [data-app-route="'+key+'"]');if(a)a.setAttribute("aria-current","page");}catch(e){}})();
</script>
`;

async function addNativeNavigation(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addNativeNavigation(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html') || file === path.join(out, 'index.html')) continue;
    let html = await (await import('node:fs/promises')).readFile(file, 'utf8');
    if (html.includes('id="loreverseAppNav"')) continue;
    if (!html.includes('</body>')) continue;
    html = html.replace('</body>', nativeShell + '\\n</body>');
    await (await import('node:fs/promises')).writeFile(file, html);
  }
}
await addNativeNavigation(out);

console.log('LOREVERSE web app copied to ./www with shared native navigation');
