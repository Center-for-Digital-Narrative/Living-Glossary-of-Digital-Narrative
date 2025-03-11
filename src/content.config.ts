import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const terms = defineCollection({
    loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/terms" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().optional(),
        pubDate: z.date().optional(),
    })
});

export const collections = { terms };