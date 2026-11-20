import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
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
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}

const nativeShell = `
<style id="loreverse-native-shell-shared">
#loreverseAppNav{display:none}
html.capacitor-app body{padding-bottom:calc(88px + env(safe-area-inset-bottom))!important}
html.capacitor-app #loreverseAppNav{position:fixed!important;z-index:1200!important;inset:auto 0 0 0!important;width:100%!important;max-width:none!important;height:auto!important;min-height:76px;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:stretch!important;justify-content:space-around!important;gap:2px!important;margin:0!important;padding:8px 7px calc(8px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important;overflow:visible!important;background:#fff!important;border:0!important;border-top:1px solid #dce3da!important;border-radius:0!important;box-shadow:0 -8px 24px #24302412!important;transform:none!important}
html.capacitor-app #loreverseAppNav a{position:relative!important;z-index:1!important;flex:1 1 0!important;min-width:0!important;width:auto!important;max-width:none!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:6px 2px!important;margin:0!important;border-radius:10px!important;color:#667166!important;font:750 10px/1.2 system-ui!important;text-align:center!important;text-decoration:none!important;box-sizing:border-box!important;touch-action:manipulation}
html.capacitor-app #loreverseAppNav a[aria-current="page"]{background:#edf3e9!important;color:#587a45!important}
html.capacitor-app #loreverseAppNav .app-nav-icon{font-size:19px!important;line-height:1.2!important}
html.capacitor-app #bugReportModal{z-index:1100!important;inset:0 0 calc(76px + env(safe-area-inset-bottom)) 0!important;padding:12px!important;align-items:center!important}
html.capacitor-app #bugReportModal .bug-card{max-height:calc(100% - 12px)!important;overscroll-behavior:contain}
@media(max-width:390px){html.capacitor-app #loreverseAppNav a{font-size:9px!important;gap:2px!important;padding-left:1px!important;padding-right:1px!important}html.capacitor-app #loreverseAppNav .app-nav-icon{font-size:17px!important}}
</style>
<nav id="loreverseAppNav" aria-label="Аппын үндсэн цэс">
<a href="/" data-app-route="home"><span class="app-nav-icon" aria-hidden="true">⌂</span><span>Нүүр</span></a>
<a href="/community/" data-app-route="community"><span class="app-nav-icon" aria-hidden="true">◎</span><span>Нийгэмлэг</span></a>
<a href="/store/" data-app-route="store"><span class="app-nav-icon" aria-hidden="true">▣</span><span>Дэлгүүр</span></a>
<a href="/profile/" data-app-route="profile"><span class="app-nav-icon" aria-hidden="true">♙</span><span>Профайл</span></a>
<a href="/?openBugReport=1" data-app-route="bug"><span class="app-nav-icon" aria-hidden="true">⚑</span><span>Алдаа</span></a>
</nav>
<script id="loreverse-native-navigation-controller">
(()=> {
  const cap=window.Capacitor;
  const native=!!(cap&&(cap.isNativePlatform?.()||["android","ios"].includes(cap.getPlatform?.())));
  if(!native)return;
  document.documentElement.classList.add("capacitor-app");
  const nav=document.getElementById("loreverseAppNav");
  if(!nav)return;
  const path=location.pathname.replace(/\\/g,"").replace(/\/+$/,"")||"/";
  const routes={home:"/",community:"/community",store:"/store",profile:"/profile"};
  const current=Object.keys(routes).find(key=>path===routes[key]||path.startsWith(routes[key]+"/"))||"home";
  nav.querySelectorAll("[data-app-route]").forEach(a=>{
    const key=a.getAttribute("data-app-route");
    if(key===current)a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
  nav.addEventListener("click",event=>{
    const link=event.target.closest("a[data-app-route]");
    if(!link)return;
    event.preventDefault();
    const key=link.getAttribute("data-app-route");
    const destination=key==="bug"?"/?openBugReport=1":(routes[key]||"/");
    const target=new URL(destination,location.origin);
    if(location.pathname+location.search!==target.pathname+target.search)location.assign(target.href);
    else if(key==="bug"&&typeof window.openBugReport==="function")window.openBugReport();
  },{passive:false});
})();
</script>
`;

async function addNativeNavigation(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await addNativeNavigation(file); continue; }
    if (!entry.isFile() || !entry.name.endsWith('.html') || file === path.join(out, 'index.html')) continue;
    let html = await readFile(file, 'utf8');
    if (!html.includes('id="loreverseAppNav"') && html.includes('</body>')) {
      html = html.replace('</body>', nativeShell + '\n</body>');
      await writeFile(file, html);
    }
  }
}
await addNativeNavigation(out);
console.log('LOREVERSE web app copied with functional shared native navigation');
