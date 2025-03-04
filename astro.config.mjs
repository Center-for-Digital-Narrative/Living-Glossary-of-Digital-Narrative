import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from "astro-pagefind";
import mdx from "@astrojs/mdx";
import rehypeSeeAlso from "./src/plugins/rehypeSeeAlso";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), pagefind(), mdx()],
    markdown: {
        rehypePlugins: [rehypeSeeAlso]
    },
  prefetch: true
});