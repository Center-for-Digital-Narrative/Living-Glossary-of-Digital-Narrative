import {defineConfig, envField} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pagefind from "astro-pagefind";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.js";
import markdownIntegration from '@astropub/md'

export default defineConfig({
    integrations: [pagefind(), markdownIntegration()],

    markdown: {
        remarkPlugins: [
            [remarkWikiLinks, {
                linkResolver: (link) => `/terms/${link.toLowerCase()}/`
            }]
        ]
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