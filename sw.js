const CACHE='everyday-oddities-v3';
const CORE=['./','./index.html','./explore.html','./experiments.html','./about.html','./physics.html','./food.html','./water.html','./light.html','./materials.html','./sound.html','./articles/why-sky-blue.html','./articles/microwave-works.html','./articles/water-weird.html','./styles.css','./app.js','./assets/favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('everyday-oddities-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
 const request=event.request;
 const isPage=request.mode==='navigate'||/\.(html|css|js)(\?|$)/i.test(new URL(request.url).pathname);
 if(isPage){
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(cached=>cached||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response;})));
 }
});