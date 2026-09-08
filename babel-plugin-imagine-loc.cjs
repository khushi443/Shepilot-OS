const path = require("path");

module.exports = function imagineLocPlugin({ types: t }) {
  return {
    name: "imagine-loc",
    visitor: {
      JSXOpeningElement(nodePath, state) {
        const node = nodePath.node;
        if (!node.loc) return;

        const nameNode = node.name;
        if (nameNode.type !== "JSXIdentifier") return;
        if (!/^[a-z]/.test(nameNode.name)) return;

        const already = node.attributes.some(
          (a) =>
            a.type === "JSXAttribute" &&
            a.name &&
            a.name.name === "data-imagine-loc",
        );
        if (already) return;

        let rel = (state.file.opts.filename || "").split(path.sep).join("/");
        const srcIdx = rel.lastIndexOf("/src/");
        if (srcIdx !== -1) {
          rel = rel.slice(srcIdx + 1);
        } else {
          rel = path.basename(rel);
        }

        const { line, column } = node.loc.start;
        node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-imagine-loc"),
            t.stringLiteral(rel + ":" + line + ":" + (column + 1)),
          ),
        );
      },
    },
  };
};
