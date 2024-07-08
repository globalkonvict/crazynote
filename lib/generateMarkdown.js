const fs = require("fs-extra");
const path = require("path");
const { readFiles } = require("./readFiles");
const { generateFileTree } = require("./fileTree");
const { renderTemplate } = require("./utils");

async function generateMarkdown(config) {
  const ignorePatterns = config.ignore || [];
  const exclusionText = config.exclusionText || "";

  const [fileTree, files] = await Promise.all([
    generateFileTree(
      config.directory,
      ignorePatterns,
      exclusionText,
      config.removeIgnoredFromTree,
      ""
    ),
    readFiles(config.directory, config),
  ]);

  const data = { fileTree, files };

  // Render the final output using the template
  const output = await renderTemplate(data, config.templatePath);

  // Write the output to the specified file
  const outputPath = path.join(config.outputDir, `${config.outputFileName}.md`);
  await fs.outputFile(outputPath, output); // Use outputFile to ensure the directory exists
}

module.exports = { generateMarkdown };
