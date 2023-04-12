const staticCache = 'students-app-v2';
const dynamicCache = 'd-students-app-v2';
// list of all static files, which we need in cache
const assetUrls = [
    'lab01css.css',
    'lab01js.js',
    'lab01.html',
    'offline.html'
];
  
  self.addEventListener('install', event => {
    console.log('V1 installing…');
    //add all files to cache
    event.waitUntil(
      caches.open(staticCache).then(cache => cache.addAll(assetUrls))
    );
  });

  // update cache files
  self.addEventListener('activate', async event =>
  {
    console.log("Activating...");
    // get all keys in current cache
    const cacheNames = await caches.keys();
    // delete all unmatched
    await Promise.all(
      cacheNames.filter(name => name !== staticCache).filter(name => name !== dynamicCache)
      // delete other cache
      .map(name => caches.delete(name))
    )
  });
  
// requesting
self.addEventListener('fetch', event => {
  console.log("Fetch", event.request.url);
  const {request} = event;
  const url = new URL(request.url)
  // get data located on server
  if(url.origin === location.origin)
  {
    event.respondWith(cacheFirst(request));
  }
  else
  {
    event.respondWith(netWorkFirst(request));
  }
 
});

async function cacheFirst(request)
{
  // found smth in cache
  const cached = await caches.match(request);
  // get it from cache or if not, then from server
  return cached ?? await fetch(request);
}
async function netWorkFirst(request)
{
  // for caching POST queries
  const cache = await caches.open(dynamicCache);
  try {

      const response = await fetch(request);
      // put response in cache
      cache.put(request, response.clone());
      return response;
  }
  // otherwise get data from cache
  catch(e)
  {
    const cached = await cache.match(request);
    // if no data, then go offline
    return cached ?? cache.match('/offline.html');
  }
  
}
