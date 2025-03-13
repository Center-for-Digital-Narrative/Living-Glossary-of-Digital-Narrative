import { getCollection } from "astro:content";
import { BUILD_TIME } from "astro:env/server";

interface Term {
    title: string;
    url: string;
    description: string;
}

const allPosts = await getCollection("terms");

const terms: Term[] = allPosts.map((term) => ({
    title: term.data.title,
    url: 'https://glossary.cdn.uib.no/terms/' + term.id + '/',
    description: term.data.description,
    explication: typeof term.body !== "undefined"
}));

export async function GET() {
    return new Response(
        JSON.stringify({
            build_time: BUILD_TIME,
            terms: terms
        })
    );
}