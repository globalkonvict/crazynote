const fs = require("fs-extra");
const glob = require("glob");

function readFiles(dir, config) {
  const ignorePatterns = config.ignore || ["**/node_modules/**", ".git/**"];
  const files = glob.sync(`${dir}/**/*`, {
    nodir: true,
    ignore: ignorePatterns,
  });

  return files
    .map((file) => ({
      path: file,
      content: fs.readFileSync(file, "utf-8"),
    }));
}

module.exports = { readFiles };
