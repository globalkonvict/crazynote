const fs = require("fs-extra");
const path = require("path");
const { isPathIgnored } = require("./utils");

async function generateFileTree(
  dir,
  ignorePatterns,
  exclusionText,
  removeIgnoredFromTree,
  prefix = ""
) {
  const isIgnored = isPathIgnored();
  const items = await fs.readdir(dir, { withFileTypes: true });
  let tree = "";

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (isIgnored(relativePath, ignorePatterns)) {
      if (removeIgnoredFromTree) {
        continue;
      }
      tree += `${prefix}├── ${item.name}${exclusionText}\n`;
    } else {
      tree += `${prefix}├── ${item.name}\n`;
      if (item.isDirectory()) {
        tree += await generateFileTree(
          fullPath,
          ignorePatterns,
          exclusionText,
          removeIgnoredFromTree,
          `${prefix}│   `
        );
      }
    }
  }

  return tree;
}

module.exports = { generateFileTree };
