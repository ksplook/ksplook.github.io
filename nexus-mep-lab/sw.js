// NEXUS MEP LAB 4.0.5 - shared offline runtime for desktop and mobile.
// Cache each navigation under its own URL, never replace the main workspace
// with the Room CFD page when switching between tools.
const CACHE_NAME='nexus-personal-lab-4.0.5-public1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-512.png'];
const OPTIONAL_WORKSPACES=['./room-cfd/index.html']; // Only present on the public unified site.
const isManagedUrl=url=>{
 const scope=new URL(self.registration.scope);
 return url.origin===scope.origin&&url.pathname.startsWith(scope.pathname);
};
const navigationKey=url=>url.origin+url.pathname; // Ignore query parameters, not the page path.
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(CORE);
  // Cache the CFD workbench when present. A missing optional route must never
  // prevent the single-file/private PWA from installing.
  await Promise.all(OPTIONAL_WORKSPACES.map(async relative=>{
   const url=new URL(relative,self.registration.scope).href;
   try{const response=await fetch(url);if(response.ok)await cache.put(url,response.clone());}catch{}
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nexus-personal-lab-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(!isManagedUrl(url))return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{
   const key=navigationKey(url);
   try{
    const response=await fetch(event.request,{cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const cache=await caches.open(CACHE_NAME);
    await cache.put(key,response.clone()); // Each route has its own offline snapshot.
    return response;
   }catch{
    const cache=await caches.open(CACHE_NAME);
    const exact=await cache.match(key);
    if(exact)return exact;
    // The root page may be cached under / or /index.html.
    const root=new URL('./',self.registration.scope);
    if(url.pathname===root.pathname||url.pathname===root.pathname+'index.html'){
     return (await cache.match(new URL('./index.html',root).href))||
            (await cache.match(root.href))||Response.error();
    }
    return Response.error(); // Never substitute another tool's UI for an uncached route.
   }
  })());
  return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(async response=>{
  if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(event.request,response.clone());}
  return response;
 })));
});
