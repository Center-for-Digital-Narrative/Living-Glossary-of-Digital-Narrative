import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pagefind from "astro-pagefind";
import mdx from "@astrojs/mdx";
import rehypeSeeAlso from "./src/plugins/rehypeSeeAlso";

// https://astro.build/config
export default defineConfig({
  integrations: [pagefind(), mdx()],

  markdown: {
      rehypePlugins: [rehypeSeeAlso]
  },

  prefetch: true,

  vite: {
    plugins: [tailwindcss()]
  }
});