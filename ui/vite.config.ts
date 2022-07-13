import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      //这里是通过请求/api 来转发到 https://api.pingping6.com/
      //假如你要请求https://api.*.com/a/a
      //那么axios的url，可以配置为 /api/a/a
      '/api': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/oauth2': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/oauth': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },

    }
  },
})
