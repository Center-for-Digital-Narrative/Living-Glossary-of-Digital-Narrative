import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text } from "mdast";

export const remarkSeeAlso: Plugin<[], Root> = () => {
    return (tree) => {
        visit(tree, "text", (node: Text, index, parent) => {
            if (!parent || typeof index !== "number") return; // Ensure valid index

            const match = node.value.match(/\{see-also:([^}]+)\}/);
            if (!match) return;

            const items = match[1]
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            // Replace the text node in its parent's `children` array
            parent.children[index] = {
                type: "html",
                value: `<SeeAlso items='${JSON.stringify(items)}' />`,
            };
        });
    };
};
