// apps/web/public/sw.js

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "",
      icon: data.icon || "/logo.svg",
      badge: "/logo.svg",
      data: data.url || "/",
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error processing push event:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Open application window on notification click
  event.waitUntil(
    clients.openWindow(event.notification.data || "/")
  );
});