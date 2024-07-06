const fs = require("fs-extra");
const glob = require("glob");
const micromatch = require("micromatch");

function readFiles(dir, config) {
  const files = glob.sync(`${dir}/**/*`, {
    nodir: true,
    ignore: ["**/node_modules/**"],
  });
  const ignorePatterns = config.ignore || [];

  return files
    .filter((file) => !micromatch.any(file, ignorePatterns))
    .map((file) => ({
      path: file,
      content: fs.readFileSync(file, "utf-8"),
    }));
}

module.exports = { readFiles };
