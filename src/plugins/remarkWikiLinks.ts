import { visit } from 'unist-util-visit';
import type { Root, Parent, Text, Link } from 'mdast';
import type { Plugin } from 'unified';

// Regex to find wiki-style links, e.g., [[link|alias]]
const wikiLinkRegex = /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?]]/g;

/**
 * Defines the function signature for resolving a wiki-link string into a URL.
 * @param link - The text content of the link (e.g., "meme").
 * @returns The resolved URL string.
 */
type LinkResolver = (link: string) => string;

/**
 * Defines the options for the remark-wiki-link plugin.
 */
interface RemarkWikiLinkOptions {
    linkResolver: LinkResolver;
}

// A default resolver to use if none is provided by the user.
const defaultLinkResolver: LinkResolver = (link) => `/page/${link.toLowerCase()}/`;

/**
 * A Remark plugin to transform [[wiki-style]] links into standard Markdown links.
 *
 * @param options - Configuration for the plugin.
 */
const remarkWikiLink: Plugin<[RemarkWikiLinkOptions?], Root> = (options) => {
    const { linkResolver = defaultLinkResolver } = options || {};

    // This is the transformer function that modifies the AST.
    return (tree: Root) => {
        visit(tree, 'text', (node: Text, index?: number, parent?: Parent) => {
            // Ensure the node and its context are valid for replacement.
            if (!parent || typeof index !== 'number') {
                return;
            }

            const text = node.value;
            const newChildren: (Text | Link)[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;

            // Iterate over all wiki-link matches in the current text node.
            while ((match = wikiLinkRegex.exec(text)) !== null) {
                const [fullMatch, link, alias] = match;
                const precedingText = text.slice(lastIndex, match.index);

                // 1. Add any text that came before the wiki-link.
                if (precedingText) {
                    newChildren.push({ type: 'text', value: precedingText });
                }

                // 2. Add the new link node, using the linkResolver to generate the URL.
                const linkNode: Link = {
                    type: 'link',
                    url: linkResolver(link),
                    children: [{ type: 'text', value: alias || link }],
                };
                newChildren.push(linkNode);

                lastIndex = match.index + fullMatch.length;
            }

            // If no matches were found, we don't need to do anything.
            if (lastIndex === 0) {
                return;
            }

            // 3. Add any remaining text that came after the last wiki-link.
            const remainingText = text.slice(lastIndex);
            if (remainingText) {
                newChildren.push({ type: 'text', value: remainingText });
            }

            // 4. Replace the original text node with the new set of nodes.
            parent.children.splice(index, 1, ...newChildren);

            // Tell `visit` to skip over the newly inserted nodes to avoid infinite loops.
            return index + newChildren.length;
        });
    };
};

export default remarkWikiLink;