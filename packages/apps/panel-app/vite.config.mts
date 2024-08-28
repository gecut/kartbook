import {defineConfig} from 'vite';
import Unfonts from 'unplugin-fonts/vite';
import Unicons from 'unplugin-icons/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {ManifestOptions, VitePWA as vitePWA} from 'vite-plugin-pwa';

const DIST_PATH = './dist/';
const manifestJson: Partial<ManifestOptions> = {
  /* url */
  scope: '/',
  start_url: '/?pwa',
  id: 'kartbook-panel-app',
  lang: 'fa-IR',

  /* info */
  name: 'Kartbook',
  short_name: 'Kartbook',

  /* screen */
  display: 'standalone',
  orientation: 'portrait',
  dir: 'rtl',

  /* theming */
  theme_color: '#fff',
  background_color: '#fff',

  /* icons */
  icons: [
    {
      src: '/icon-192-maskable.png',
      type: 'image/png',
      sizes: '192x192',
      purpose: 'maskable',
    },
    {
      src: '/icon-512-maskable.png',
      type: 'image/png',
      sizes: '512x512',
      purpose: 'maskable',
    },
    {src: '/favicon.ico', type: 'image/x-icon', sizes: '32x32'},
    {
      src: '/icon-192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: '/icon-512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
};

export default defineConfig(() => {
  return {
    css: {
      postcss: 'postcss.config.js',
    },

    build: {
      target: ['esnext', 'edge100', 'firefox100', 'chrome100', 'safari18'],
      outDir: DIST_PATH,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    plugins: [
      tsconfigPaths(),
      Unicons({
        compiler: 'raw',
        autoInstall: true,
      }),
      Unfonts({
        google: {
          families: [
            {
              name: 'Roboto',
              styles: 'wght@300',
              defer: true,
            },
          ],
          display: 'swap',
          injectTo: 'head-prepend',
          preconnect: false,
        },
        fontsource: {
          families: ['Vazirmatn'],
        },
      }),
      vitePWA({
        workbox: {
          swDest: `${DIST_PATH}/sw.js`,
          skipWaiting: true,
          globDirectory: DIST_PATH,
          globPatterns: ['**/*.{html,js,css,woff,png,ico,svg,webp}'],
        },
        manifest: manifestJson,
        mode: 'production',
        outDir: DIST_PATH,
      }),
    ],
  };
});
