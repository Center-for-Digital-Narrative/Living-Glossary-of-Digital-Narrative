import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from "astro-pagefind";
import {remarkSeeAlso} from "./src/plugins/remarkSeeAlso.js";


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), pagefind()],
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkGfm, remarkSeeAlso], // Add the custom plugin
  },
});