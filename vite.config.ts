import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ENTRY_PRELOAD = new Set(['vendor', 'rolldown-runtime', 'index'])

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let supabasePreconnect = ''

  try {
    if (env.VITE_SUPABASE_URL) {
      supabasePreconnect = new URL(env.VITE_SUPABASE_URL).origin
    }
  } catch {
    supabasePreconnect = ''
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-head-optimizations',
        transformIndexHtml(html) {
          const hints = supabasePreconnect
            ? `    <link rel="preconnect" href="${supabasePreconnect}" crossorigin />\n`
            : ''
          return html.replace('<link rel="preload" as="image"', `${hints}    <link rel="preload" as="image"`)
        },
      },
    ],
    build: {
      modulePreload: {
        resolveDependencies(_filename, deps) {
          return deps.filter((dep) =>
            [...ENTRY_PRELOAD].some((chunk) => dep.includes(`/${chunk}-`) || dep.includes(`/${chunk}.`)),
          )
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('@fontsource/')) return 'fonts'
            if (id.includes('@supabase/supabase-js')) return 'supabase'
            if (id.includes('@tanstack/react-query')) return 'query'
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor'
            }
            if (id.includes('lucide-react')) return 'icons'
          },
        },
      },
    },
  }
})
