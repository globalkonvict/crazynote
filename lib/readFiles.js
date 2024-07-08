const fs = require("fs-extra");
const fastGlob = require("fast-glob");

async function readFiles(dir, config) {
  const ignorePatterns = config.ignore || ["**/node_modules/**", ".git/**"];
  const files = await fastGlob([`${dir}/**/*`], {
    ignore: ignorePatterns,
    onlyFiles: true,
  });

  const fileContents = await Promise.all(
    files.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf-8");
      const stats = await fs.stat(filePath);
      return {
        path: filePath,
        content,
        size: stats.size,
        modified: stats.mtime.toISOString(),
      };
    })
  );

  return fileContents;
}

module.exports = { readFiles };
