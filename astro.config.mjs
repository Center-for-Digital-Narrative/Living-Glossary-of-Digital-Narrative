import {defineConfig, envField} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pagefind from "astro-pagefind";
import mdx from "@astrojs/mdx";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.js";
import rehypeSeeAlso from "./src/plugins/rehypeSeeAlso";


export default defineConfig({
    integrations: [pagefind(), mdx()],

    markdown: {
        remarkPlugins: [
            [remarkWikiLinks, {
                linkResolver: (link) => `/terms/${link.toLowerCase()}/`
            }]
        ],
        rehypePlugins: [rehypeSeeAlso]
    },

    prefetch: true,

    vite: {
        plugins: [tailwindcss()]
    },

    env: {
        schema: {
            BUILD_TIME: envField.string({ context: "server", access: "public", default: new Date().toISOString() })
        }
    }
});