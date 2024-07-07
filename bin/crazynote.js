#!/usr/bin/env node

const { program } = require("commander");
const { generateMarkdown } = require("../lib/generateMarkdown");
const { parseConfig } = require("../lib/parseConfig");
const { generateDefaults } = require("../lib/generateDefaultConfig");
const { generateProjectJson } = require("../lib/generateProjectJson");
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
  .option("--json", "Generate a JSON file of the project structure", false)
  .parse(process.argv);

const options = program.opts();

(async () => {
  if (options.init) {
    const templateName = options.template || "minimalist";
    generateDefaults(templateName);
  } else {
    const configPath = path.resolve(process.cwd(), options.config);
    const config = parseConfig(configPath);

    if (options.json) {
      generateProjectJson(config);
    } else {
      await generateMarkdown(config);
    }
  }
})();
