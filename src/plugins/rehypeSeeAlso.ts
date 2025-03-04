import { visit } from 'unist-util-visit';

interface File {
    data: {
        astro: {
            frontmatter: {
                seeAlso: string[]
            }
        }
    }
}

export default function rehypeSeeAlso() {
    return (tree:any, file:File) => {
        visit(tree, 'text', (node, index, parent) => {

            if(!parent) return;
            if (!node.value.includes('::see-also')) return;

            parent.children[index??0] = {
                type: 'element',
                tagName: 'SeeAlso',
                properties: {
                    items: JSON.stringify(file.data.astro.frontmatter.seeAlso)
                }
            };
        });
    };
}
