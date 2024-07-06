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
