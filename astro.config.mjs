import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from "astro-pagefind";
import svelte from "@astrojs/svelte";


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), pagefind(), svelte()]
});