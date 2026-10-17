// NEXUS MEP LAB 2.0.0: shared offline runtime for desktop and mobile.
// The same index.html drives all screens. No cloud project storage.
const CACHE_NAME='nexus-personal-lab-2.0.0-unified1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nexus-personal-lab-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(event.request);
    if(!response.ok)throw Error('HTTP '+response.status);
    const cache=await caches.open(CACHE_NAME);
    await cache.put('./index.html',response.clone()); // Refresh offline copy after online use.
    return response;
   }catch{
    return (await caches.match('./index.html'))||Response.error();
   }
  })());
  return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(async response=>{
  if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(event.request,response.clone());}
  return response;
 })));
});
