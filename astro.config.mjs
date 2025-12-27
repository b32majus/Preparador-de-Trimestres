import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://b32majus.github.io',
  base: '/Preparador-de-Trimestres/',
  vite: {
    ssr: {
      external: ['@supabase/supabase-js']
    }
  }
});
