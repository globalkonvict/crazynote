const fs = require("fs-extra");
const path = require("path");

function parseConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }
  const config = fs.readJsonSync(path.resolve(configPath));

  // Ensure output directory and filename are set
  config.outputDir = config.outputDir || "./";
  config.outputFileName = config.outputFileName
    ? config.outputFileName.replace(/\.[^/.]+$/, "")
    : "output";
  config.includeAST =
    config.includeAST !== undefined ? config.includeAST : true;

  return config;
}

module.exports = { parseConfig };
