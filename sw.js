const CACHE='everyday-oddities-v12';
const CORE=['./story.html','./stories-extra.js','./','./index.html','./explore.html','./experiments.html','./about.html','./feedback.html','./offline.html','./physics.html','./food.html','./water.html','./light.html','./materials.html','./sound.html','./articles/why-sky-blue.html','./articles/microwave-works.html','./articles/water-weird.html','./articles/banana-browns.html','./articles/bread-rises.html','./articles/fingers-wrinkle.html','./articles/leaves-change-colour.html','./articles/lightning-thunder.html','./articles/metal-feels-cold.html','./articles/mirror-left-right.html','./articles/moon-phases.html','./articles/plants-follow-light.html','./articles/popcorn-pops.html','./articles/rainbow-bubbles.html','./articles/smell-of-rain.html','./articles/stars-twinkle.html','./articles/static-electricity.html','./articles/voice-recording.html','./articles/why-ice-cracks.html','./articles/why-magnets-attract.html','./articles/why-onions-make-you-cry.html','./articles/why-sound-echoes.html','./articles/why-yawning-spreads.html','./styles.css','./app.js','./manifest.webmanifest','./assets/favicon.svg','./assets/hero-world.svg','./assets/sky.svg','./assets/microwave.svg','./assets/water.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('everyday-oddities-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
 const request=event.request;
 const isPage=request.mode==='navigate'||/\.(html|css|js)(\?|$)/i.test(new URL(request.url).pathname);
 if(isPage){
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request,{ignoreSearch:true}).then(cached=>cached||caches.match('./offline.html')||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(request,{ignoreSearch:true}).then(cached=>cached||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response;})));
 }
});