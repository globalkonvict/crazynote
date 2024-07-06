const fs = require("fs-extra");
const { readFiles } = require("./readFiles");
const { generateFileTree } = require("./fileTree");
const { renderTemplate } = require("./utils");

async function generateMarkdown(config) {
  const ignorePatterns = config.ignore || [];
  const removeExclusionText = config.removeExclusionText || false;
  
  // Generate the directory tree
  const fileTree = generateFileTree(
    config.directory,
    ignorePatterns,
    "",
    removeExclusionText
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
  fs.writeFileSync(config.output, output, { flag: "w" });
}

module.exports = { generateMarkdown };
