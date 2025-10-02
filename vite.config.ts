import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default ( ({mode} ) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@blocks': fileURLToPath(new URL('./src/blocks', import.meta.url)),
        '@components' : fileURLToPath(new URL('./src/components', import.meta.url)),
        '@images' : fileURLToPath(new URL('./src/assets/images', import.meta.url)),
        '@scss' : fileURLToPath(new URL('./src/assets/scss', import.meta.url)),
      }
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_DAIP_API_URL,
          changeOrigin: true,
          secure: false,
          ws: false
        },
        '/proxy': {
          target: process.env.VITE_DAIP_API_URL + '/api',
          changeOrigin: true,
          secure: false,
          ws: false
        },
      },
    },
    css: {
      devSourcemap: true,  // CSS 소스맵 활성화
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
          additionalData: `@use "@/assets/scss/_mixin" as *;`,
        },
      },
    },
    // ssr: {
    //   // SSR 설정
    //   noExternal: ['vue-router']
    // }
  })
});