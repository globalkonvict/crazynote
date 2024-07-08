const fs = require("fs-extra");
const path = require("path");
const Handlebars = require("handlebars");
const micromatch = require("micromatch");
const extensionToLanguageMap = require("./config/languageMappings.json");

Handlebars.registerHelper("tripleCurly", function (options) {
  return new Handlebars.SafeString(options.fn(this));
});

function removeLanguageIdentifiers(content) {
  return content.replace(/```[\s\S]*?```/g, (match) => {
    const lines = match.split("\n");
    return lines.slice(1, -1).join("\n");
  });
}

function getLanguageIdentifier(filePath) {
  const ext = path.extname(filePath).substring(1);
  return extensionToLanguageMap[ext] || "";
}

async function renderTemplate(data, templatePath) {
  const template = await fs.readFile(path.resolve(templatePath), "utf-8");
  const ora = (await import("ora")).default;
  const spinner = ora("Processing files").start();

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

function isPathIgnored() {
  const matchCache = new Map();
  return (path, ignorePatterns) => {
    if (matchCache.has(path)) {
      return matchCache.get(path);
    }
    const result = micromatch.isMatch(path, ignorePatterns);
    matchCache.set(path, result);
    return result;
  };
}

module.exports = { renderTemplate, isPathIgnored };
