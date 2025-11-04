import {type CollectionEntry, defineCollection, reference, z} from 'astro:content';
import { glob } from 'astro/loaders';

const terms = defineCollection({
    loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/terms" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().optional(),
        pubDate: z.date().optional(),
        seeAlso: z.array(reference('terms')).optional(),
        worksReferenced: z.string().optional(),
        furtherReading: z.string().optional(),
    })
});

export const collections = { terms };

export type Term = CollectionEntry<'terms'>;