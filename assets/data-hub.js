/* LOREVERSE Central Data Hub — shared cache + request de-duplication */
(function(){
 "use strict";
 const PREFIX="loreverse:datahub:v1:", inflight=new Map(), keyRevisions=new Map(), DEFAULT_TTL=300000;
 let revision=0;
 function read(key){try{const raw=localStorage.getItem(PREFIX+key);if(!raw)return null;const item=JSON.parse(raw);if(!item||Date.now()>item.expires){localStorage.removeItem(PREFIX+key);return null;}return item.value;}catch(_){return null;}}
 function write(key,value,ttl){try{localStorage.setItem(PREFIX+key,JSON.stringify({expires:Date.now()+ttl,value}));}catch(_){}}
 async function remember(key,loader,ttl){
  const cached=read(key);if(cached!==null)return cached;
  if(inflight.has(key))return inflight.get(key);
  const startedAt=revision, keyRevision=keyRevisions.get(key)||0;
  const task=Promise.resolve().then(loader).then(value=>{
   if(startedAt===revision&&keyRevision===(keyRevisions.get(key)||0))write(key,value,ttl||DEFAULT_TTL);
   return value;
  }).finally(()=>{if(inflight.get(key)===task)inflight.delete(key);});
  inflight.set(key,task);return task;
 }
 async function fetchWithTimeout(url,options,timeoutMs=15000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const response=await fetch(url,{...(options||{}),signal:controller.signal});
   const payload=await response.json();
   return{ok:response.ok,status:response.status,json:async()=>payload};
  }catch(error){
   if(error&&error.name==="AbortError")throw new Error("Хүсэлт 15 секундэд хариу ирүүлсэнгүй. Сүлжээ эсвэл API-г шалгана уу.");
   throw error;
  }finally{clearTimeout(timer);}
 }
 async function fetchJSON(url,options,ttl){
  const opts=options||{},method=(opts.method||"GET").toUpperCase();
  if(method!=="GET"&&method!=="POST")return fetchWithTimeout(url,opts).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();});
  const body=typeof opts.body==="string"?opts.body:"";
  const cacheable=method==="GET"||(/graphql\.anilist\.co/i.test(url)&&method==="POST"&&/query\s*\w*\s*\{/i.test(body));
  if(!cacheable)return fetchWithTimeout(url,opts).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();});
  const key=method+":"+url+":"+body;
  const json=await remember(key,async()=>{const response=await fetchWithTimeout(url,opts);if(!response.ok)throw new Error("HTTP "+response.status);const value=await response.json();if(value.errors&&value.errors.length)throw new Error(value.errors[0].message||"API error");return value;},ttl||DEFAULT_TTL);
  return{ok:true,status:200,json:async()=>json};
 }
 function invalidate(key){
  key=String(key);keyRevisions.set(key,(keyRevisions.get(key)||0)+1);
  inflight.delete(key);
  try{localStorage.removeItem(PREFIX+key);}catch(_){}
 }
 function clear(){
  revision++;keyRevisions.clear();inflight.clear();
  try{Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).forEach(k=>localStorage.removeItem(k));}catch(_){}
 }
 window.LOREVERSE_DATA_HUB=Object.freeze({remember,fetchJSON,invalidate,clear});
})();