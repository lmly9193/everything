import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['contextMenus'],
    web_accessible_resources: [
      {
        resources: ['icon/*.png'],
        matches: ['<all_urls>'],
      },
    ],
  },
});
