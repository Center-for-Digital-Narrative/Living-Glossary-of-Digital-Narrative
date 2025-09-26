import { visit } from 'unist-util-visit';

const wikiLinkRegex = /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?]]/g;

interface RemarkWikiLinkOptions {
    linkResolver: (link: string) => string;
}

// Default resolver if the user doesn't provide one.
const defaultLinkResolver = (link:string) => `/terms/${link.toLowerCase()}/`;

export default function remarkWikiLink(options: RemarkWikiLinkOptions) {
    const { linkResolver = defaultLinkResolver } = options || {};

    // @ts-ignore Root type from mdast
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            // Ensure the node and its context are valid for replacement
            if (!parent || typeof index !== 'number') {
                return;
            }

            const text = node.value;
            const newChildren = [];
            let lastIndex = 0;
            let match;

            // Use a while loop to find all matches in the text node
            while ((match = wikiLinkRegex.exec(text)) !== null) {
                const [fullMatch, link, alias] = match;
                const precedingText = text.slice(lastIndex, match.index);

                // 1. Add any text that came before the wiki-link
                if (precedingText) {
                    newChildren.push({ type: 'text', value: precedingText });
                }

                // 2. Add the new link node, using the linkResolver for the URL
                newChildren.push({
                    type: 'link',
                    url: linkResolver(link), // Dynamically generate the URL
                    children: [{ type: 'text', value: alias || link }],
                });

                lastIndex = match.index + fullMatch.length;
            }

            // If no matches were found, do nothing.
            if (lastIndex === 0) {
                return;
            }

            // 3. Add any remaining text that came after the last wiki-link
            const remainingText = text.slice(lastIndex);
            if (remainingText) {
                newChildren.push({ type: 'text', value: remainingText });
            }

            // 4. Replace the original text node with the new set of nodes
            parent.children.splice(index, 1, ...newChildren);

            // Tell visit to skip over the newly inserted nodes
            return index + newChildren.length;
        });
    };
}