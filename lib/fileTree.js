const fs = require("fs-extra");
const path = require("path");
const micromatch = require("micromatch");

function generateFileTree(
  dir,
  ignorePatterns,
  prefix = "",
  removeExclusionText = false
) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let tree = "";

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(process.cwd(), fullPath);
    const isIgnored = micromatch.isMatch(relativePath, ignorePatterns);

    if (isIgnored) {
      tree += `${prefix}├── ${item.name}${
        removeExclusionText ? "" : " (excluded)"
      }\n`;
    } else {
      tree += `${prefix}├── ${item.name}\n`;
      if (item.isDirectory() && item.name !== "node_modules") {
        tree += generateFileTree(
          fullPath,
          ignorePatterns,
          `${prefix}│   `,
          removeExclusionText
        );
      }
    }
  });

  return tree;
}

module.exports = { generateFileTree };
