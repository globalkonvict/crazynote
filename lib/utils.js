const fs = require("fs-extra");
const path = require("path");
const Handlebars = require("handlebars");
const extensionToLanguageMap = require("./config/languageMappings.json");

// Register custom helper to handle triple curly braces
Handlebars.registerHelper("tripleCurly", function (options) {
  return new Handlebars.SafeString(options.fn(this));
});

function removeLanguageIdentifiers(content) {
  return content.replace(/```[\s\S]*?```/g, (match) => {
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
  let template = `{{{fileTree}}}\n\n{{#each files}}\n## {{{this.path}}}\n\`\`\`{{this.language}}\n{{#tripleCurly}}{{{this.content}}}{{/tripleCurly}}\n\`\`\`\n{{/each}}`;
  if (templatePath && fs.existsSync(templatePath)) {
    template = fs.readFileSync(path.resolve(templatePath), "utf-8");
  }

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
