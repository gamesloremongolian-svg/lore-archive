/* LOREVERSE ONE — shared site navigation */
(()=> {
 const script=document.currentScript,root=(script&&script.dataset.root)||'./';
 const path=location.pathname;
 const has=s=>path.includes('/'+s+'/');
 const isHome=path==='/'||path.endsWith('/index.html')&& !['games','community','profile','store','archive','knowledge','ai','marketplace','rank','chat','uid-lookup','bug-report','status','universe-hub'].some(has);
 const header=document.createElement('header');header.className='lv-shell-header';
 header.innerHTML='<div class="lv-shell-inner"><a class="lv-shell-brand" href="'+root+'" aria-label="LOREVERSE нүүр"><span class="lv-shell-mark">✦</span><span>LOREVERSE</span></a><button class="lv-shell-toggle" type="button" aria-expanded="false" aria-controls="lvShellNav" aria-label="Цэс нээх">☰</button><nav class="lv-shell-nav" id="lvShellNav" aria-label="Үндсэн навигац"></nav></div>';
 const nav=header.querySelector('nav');
 const routes=[['⌂','Нүүр',root,isHome],['◉','Нийгэмлэг',root+'community/',has('community')||has('chat')],['✧','Ертөнц',root+'games/',has('games')||has('universe-hub')],['✦','AI туслах',root+'ai/',has('ai')],['▣','Дэлгүүр',root+'store/',has('store')],['♙','Профайл',root+'profile/',has('profile')||has('rank')||has('uid-lookup')]];
 routes.forEach(([icon,label,url,on])=>{const a=document.createElement('a');a.href=url;a.innerHTML='<span class="lv-shell-nav-icon" aria-hidden="true">'+icon+'</span><span>'+label+'</span>';if(on)a.setAttribute('aria-current','page');nav.appendChild(a)});
 const more=document.createElement('details');more.className='lv-shell-more';more.innerHTML='<summary>Бусад⌄</summary><div class="lv-shell-submenu"></div>';
 const sub=more.querySelector('.lv-shell-submenu');
 [['Lore архив',root+'archive/',has('archive')||has('knowledge')],['Арилжаа',root+'marketplace/',has('marketplace')],['Чансаа ба Bonus',root+'rank/',has('rank')],['UID шалгах',root+'uid-lookup/',has('uid-lookup')],['Тусламж / Алдаа',root+'bug-report/',has('bug-report')],['Системийн төлөв',root+'status/',has('status')],['Хууль, нууцлал',root+'legal/',has('legal')]].forEach(([label,url,on])=>{const a=document.createElement('a');a.href=url;a.textContent=label;if(on)a.setAttribute('aria-current','page');sub.appendChild(a)});
 nav.appendChild(more);
 const login=document.createElement('a');login.className='lv-shell-login';login.href=root+'rank/';login.innerHTML='<span aria-hidden="true">➜</span><span>Нэвтрэх</span>';nav.appendChild(login);
 [...document.querySelectorAll('body nav')].forEach(n=>{if(n===nav)return;const hrefs=[...n.querySelectorAll('a')].map(a=>a.getAttribute('href')||'').join(' ');const count=['community','games','store','profile','marketplace','ai'].filter(k=>hrefs.includes(k)).length;if(count>=4){const host=n.closest('header');if(host&&host!==header)host.classList.add('lv-legacy-global-nav');else n.classList.add('lv-legacy-global-nav')}});
 document.body.insertBefore(header,document.body.firstChild);
 const toggle=header.querySelector('button');
 const close=()=>{nav.dataset.open='false';toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';more.open=false};
 toggle.addEventListener('click',()=>{const open=nav.dataset.open!=='true';nav.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});
 document.addEventListener('click',e=>{if(!header.contains(e.target))close()});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();