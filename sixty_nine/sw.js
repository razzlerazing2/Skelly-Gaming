importScripts("/assets/dyn/config.js?v=10-02-2024");
importScripts("/assets/dyn/worker.js?v=10-02-2024");
importScripts("/assets/ultra/bundle.js?v=10-02-2024");
importScripts("/assets/ultra/config.js?v=10-02-2024");
importScripts(__uv$config.sw || "/assets/ultra/sw.js?v=10-02-2024");
importScripts("/assets/scram/scramjet.shared.js", "/assets/scram/scramjet.worker.js");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();
const scramjet = new ScramjetServiceWorker();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

// Handle fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      // Check if dynamic handles the request
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
      }
      // Check if scramjet handles the request
      if (await scramjet.route(event)) {
        return await scramjet.fetch(event);
      }
      // UV fetch for /a/ path
      if (event.request.url.startsWith(`${location.origin}/a/`)) {
        return await uv.fetch(event);
      }
      // Default fetch fallback
      return await fetch(event.request);
    })(),
  );
});
