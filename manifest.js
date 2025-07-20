import fs from "node:fs";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */

const manifest = {
  manifest_version: 3,
  default_locale: "en",
  name: "__MSG_appName__",
  version: packageJson.version,
  description: "__MSG_appDescription__",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "lilochat-logo-sm.png",
  },
  icons: {
    128: "lilochat-logo-sm.png",
  },
  content_scripts: [
    {
      matches: [
        "https://www.netflix.com/*",
        "https://www.youtube.com/*",
        "https://www.coursera.org/*",
        "https://kinopub.net/*",
        "https://kino.pub/*",
        "https://kinopub.cc/*",
        "https://app.plex.tv/*",
        "https://plex.ukrapka.tech/*",
        "https://www.udemy.com/course/*/learn/lecture/*",
        "https://hd.kinopoisk.ru/*",
        "https://www.amazon.de/Amazon-Video/*",
        "https://www.primevideo.com/*",
        "https://www.amazon.de/*/video/*",
        "https://inoriginal.online/*",
      ],
      js: ["src/pages/contentInjected/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  permissions: ["scripting", "storage", "activeTab", "contextMenus"],
  optional_host_permissions: ["*://*/*"],
  optional_permissions: [],
  host_permissions: ["https://translate.google.com/*", "http://localhost:3000/*", "https://lilochat.com/*"],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "lilochat-logo-sm.png", "lilochat-logo-symbol-sm.png"],
      matches: ["*://*/*"],
    },
  ],
  browser_specific_settings: {
    gecko: {
      id: "{4077aa9d-b753-4913-8e52-27ef408d4c82}",
    },
  },
};

export default manifest;
