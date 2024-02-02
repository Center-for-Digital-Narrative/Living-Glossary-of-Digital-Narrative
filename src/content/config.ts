import { z, reference, defineCollection } from 'astro:content';

const terms = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: reference('authors').optional(),
        pubDate: z.date().optional(),
    }),
});

const authors = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        description: z.string(),
    }),
});

export const collections = {
    'terms': terms,
    'authors': authors,
};