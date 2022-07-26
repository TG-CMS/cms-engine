import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import progress from 'vite-plugin-progress';
import usePluginImport from 'vite-plugin-importer';
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    progress(),
    usePluginImport({
      libraryName: "ant-design-vue",
      libraryDirectory: "es",
      style: true,
    }),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => `@arco-design/web-vue/es/${name}/style/index.js`,
        }
      ]
    })
  ],
  resolve:{
    alias:{
      '@':path.resolve('./src'),
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
          "border-radius-base":"4px"
        },
        javascriptEnabled: true,
      },
    },

  }
})
