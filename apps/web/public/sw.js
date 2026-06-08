// Self-destroying service worker.
// The previous SW cached HTML and caused infinite reload loops. This version
// removes itself, clears all caches, and reloads open tabs so they fetch
// fresh from the network. It is served whenever the browser checks for SW
// updates (which happens on every navigation), so affected browsers self-heal.

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete every cache this origin created.
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))

      // Unregister this service worker.
      await self.registration.unregister()

      // Reload all controlled tabs so they load without the SW.
      const clients = await self.clients.matchAll({ type: "window" })
      for (const client of clients) {
        client.navigate(client.url)
      }
    })()
  )
})
