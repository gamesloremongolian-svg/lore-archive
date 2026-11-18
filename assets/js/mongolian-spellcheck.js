/* LOREVERSE Mongolian proofreading support.
   Uses the browser's installed Mongolian dictionary; it does not silently rewrite user text. */
(()=>{
 "use strict";
 const LANG="mn-MN";
 function enable(root=document){
  root.querySelectorAll('textarea,input[type="text"],input[type="search"],[contenteditable="true"],[contenteditable=""],[role="textbox"]').forEach(el=>{
   if(!el.hasAttribute("spellcheck"))el.setAttribute("spellcheck","true");
   if(!el.hasAttribute("lang"))el.setAttribute("lang",LANG);
  });
 }
 function start(){
  document.documentElement.setAttribute("lang",document.documentElement.lang||LANG);
  enable();
  if(!window.__loreverseMnSpellObserver){
   const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType===1){if(n.matches?.('textarea,input,[contenteditable="true"],[role="textbox"]'))enable(n.parentNode||document);else enable(n);}
   })));
   observer.observe(document.documentElement,{subtree:true,childList:true});
   window.__loreverseMnSpellObserver=observer;
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
