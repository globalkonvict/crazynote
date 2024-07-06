# Project Overview

## Directory Structure

```plaintext
├── .git (excluded)
├── .gitignore
├── bin
│   ├── crazynote.js
├── crazyconfig.json (excluded)
├── lib
│   ├── config
│   │   ├── config.json (excluded)
│   │   ├── languageMappings.json (excluded)
│   ├── fileTree.js
│   ├── generateDefaultConfig.js
│   ├── generateMarkdown.js
│   ├── parseConfig.js
│   ├── readFiles.js
│   ├── templates
│   │   ├── colorful_insights.hbs (excluded)
│   │   ├── detailed_explorer.hbs (excluded)
│   │   ├── minimalist.hbs (excluded)
│   ├── utils.js
├── node_modules (excluded)
├── output.md (excluded)
├── package-lock.json (excluded)
├── package.json (excluded)
├── README.md (excluded)
├── template.hbs (excluded)

```

## File Contents

### lib\utils.js
```javascript
const fs = require("fs-extra");
const path = require("path");
const Handlebars = require("handlebars");
const extensionToLanguageMap = require("./config/languageMappings.json");

// Register custom helper to handle triple curly braces
Handlebars.registerHelper("tripleCurly", function (options) {
  return new Handlebars.SafeString(options.fn(this));
});

function removeLanguageIdentifiers(content) {
  return content.replace(//g, (match) => {
    // Split the match by newline to get the lines
    const lines = match.split("\n");

    // Remove the first and last lines (the backticks)
    return lines.slice(1, -1).join("\n");
  });
}

function getLanguageIdentifier(filePath) {
  const ext = path.extname(filePath).substring(1);
  return extensionToLanguageMap[ext] || "";
}

async function renderTemplate(data, templatePath) {
  const template = fs.readFileSync(path.resolve(templatePath), "utf-8");
  const ora = await import("ora");
  const spinner = ora.default("Processing files").start();

  data.files = data.files.map((file, index) => {
    spinner.text = `Processing file ${index + 1} of ${data.files.length}: ${
      file.path
    }`;
    const stats = fs.statSync(file.path);
    return {
      path: file.path,
      content: removeLanguageIdentifiers(file.content),
      language: getLanguageIdentifier(file.path),
      size: stats.size,
      modified: stats.mtime.toISOString(),
    };
  });

  spinner.succeed("Files processed successfully.");

  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
}

module.exports = { renderTemplate };

```

### lib\readFiles.js
```javascript
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

```

### lib\parseConfig.js
```javascript
const fs = require("fs-extra");
const path = require("path");

function parseConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }
  const config = fs.readJsonSync(path.resolve(configPath));
  return config;
}

module.exports = { parseConfig };

```

### lib\generateMarkdown.js
```javascript
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

```

### lib\generateDefaultConfig.js
```javascript
const fs = require("fs-extra");
const path = require("path");

function generateDefaults(templateName) {
  const rootDir = process.cwd(); // The directory where the command is run
  const templatesDir = path.resolve(__dirname, "./templates");
  const sourcePath = path.join(templatesDir, `${templateName}.hbs`);
  console.log(sourcePath);
  const destPath = path.join(rootDir, "template.hbs");

  if (!fs.existsSync(sourcePath)) {
    console.error(`Template ${templateName} not found.`);
    return;
  }

  const content = fs.readFileSync(sourcePath, "utf-8");
  fs.writeFileSync(destPath, content, "utf-8");

  console.log(
    `Default template ${templateName} created as template.hbs successfully!`
  );

  // Copy config.json to crazyconfig.json in the root directory
  const configSourcePath = path.resolve(__dirname, "../lib/config/config.json");
  const configDestPath = path.join(rootDir, "crazyconfig.json");
  const configContent = fs.readJsonSync(configSourcePath);
  fs.writeJsonSync(configDestPath, configContent, { spaces: 2 });

  console.log(
    "Default configuration file created as crazyconfig.json successfully!"
  );
}

module.exports = { generateDefaults };

```

### lib\fileTree.js
```javascript
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

```

### bin\crazynote.js
```javascript
#!/usr/bin/env node

const { program } = require("commander");
const { generateMarkdown } = require("../lib/generateMarkdown");
const { parseConfig } = require("../lib/parseConfig");
const { generateDefaults } = require("../lib/generateDefaultConfig");
const path = require("path");

program
  .version("1.0.0")
  .description("CLI tool to generate Markdown documentation from project files")
  .option(
    "-c, --config <path>",
    "Path to configuration file",
    "crazyconfig.json"
  )
  .option("--init", "Initialize a configuration file with defaults")
  .option(
    "--template <name>",
    "Specify a template to use (minimalist, detailed_explorer, colorful_insights)"
  )
  .parse(process.argv);

const options = program.opts();

(async () => {
  if (options.init) {
    const templateName = options.template || "minimalist";
    generateDefaults(templateName);
  } else {
    const configPath = path.resolve(process.cwd(), options.config);
    const config = parseConfig(configPath);
    await generateMarkdown(config);
  }
})();

```
