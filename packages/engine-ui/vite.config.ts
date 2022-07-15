import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import progress from 'vite-plugin-progress';
import usePluginImport from 'vite-plugin-importer';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      enableObjectSlots:true,
      mergeProps:true,
      optimize:true,
    }),
    progress(),
    usePluginImport({
      libraryName: "ant-design-vue",
      libraryDirectory: "es",
      style: true,
    }),
  ],
  resolve:{
    alias:{
      '@/views':path.resolve('./src/views'),
      '@/assets':path.resolve('./src/assets'),
    }
  },
  css:{
    modules:{
      localsConvention:'camelCase',
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#0089ff',
          "border-radius-base":"8px"
        },
        javascriptEnabled: true,
      },
    },

  }
})
