const fs = require("fs-extra");
const path = require("path");
const micromatch = require("micromatch");

function generateFileTree(dir, ignorePatterns, exclusionText, removeIgnoredFromTree, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let tree = "";

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(process.cwd(), fullPath);
    const isIgnored = micromatch.isMatch(relativePath, ignorePatterns);

    if (isIgnored) {
      if (removeIgnoredFromTree) {
        return;
      }
      tree += `${prefix}├── ${item.name}${exclusionText}\n`;
    } else {
      tree += `${prefix}├── ${item.name}\n`;
      if (item.isDirectory()) {
        tree += generateFileTree(
          fullPath,
          ignorePatterns,
          exclusionText,
          removeIgnoredFromTree,
          `${prefix}│   `,
        );
      }
    }
  });

  return tree;
}

module.exports = { generateFileTree };
