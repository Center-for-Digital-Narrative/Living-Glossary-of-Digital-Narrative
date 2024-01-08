import { z, defineCollection } from 'astro:content';

const terms = defineCollection({
    type: 'content', // v2.5.0 and later
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().default('Anonymous'),
        pubDate: z.date(),
    }),
});

export const collections = {
    'terms': terms,
};