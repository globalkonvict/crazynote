const fs = require("fs-extra");
const path = require("path");
const { readFiles } = require("./readFiles");
const { generateFileTree } = require("./fileTree");
const { renderTemplate } = require("./utils");

async function generateMarkdown(config) {
  const ignorePatterns = config.ignore || [];
  const exclusionText = config.exclusionText || "";

  // Generate the directory tree
  const fileTree = generateFileTree(
    config.directory,
    ignorePatterns,
    exclusionText,
    config.removeIgnoredFromTree,
    "",
  );

  // Read files based on the directory and ignore patterns from the config
  const files = readFiles(config.directory, config);

  // Prepare data for the template
  const data = {
    fileTree,
    files,
  };

  // Render the final output using the template
  const output = await renderTemplate(data, config.templatePath);

  // Write the output to the specified file, overwriting it if it exists
  const outputPath = path.join(config.outputDir, `${config.outputFileName}.md`);
  fs.writeFileSync(outputPath, output, { flag: "w" });
}

module.exports = { generateMarkdown };
