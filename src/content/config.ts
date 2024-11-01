import { z, defineCollection } from 'astro:content';

const terms = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().optional(),
        pubDate: z.date().optional(),
    })
});

export const collections = {
    'terms': terms
};