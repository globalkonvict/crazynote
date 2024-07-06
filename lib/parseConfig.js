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
