const fs = require("fs");
const path = require("path");
const { readFiles } = require("./readFiles");
const { generateAST } = require("./generateAST");

const generateProjectJson = (config) => {
  const fileTree = readFiles(config.directory, config);
  const projectJson = buildJsonStructure(fileTree, config.directory, config);

  const outputPath = path.join(
    config.outputDir,
    `${config.outputFileName}.json`
  );
  fs.writeFileSync(outputPath, JSON.stringify(projectJson, null, 2));
  console.log(`Project JSON structure generated at ${outputPath}`);
};

const buildJsonStructure = (fileTree, rootDir, config) => {
  const root = {
    name: path.basename(rootDir),
    path: rootDir,
    type: "directory",
    children: [],
    metadata: getMetadata(rootDir),
  };

  const addNode = (node, segments, file) => {
    if (segments.length === 0) {
      const fileNode = {
        name: path.basename(file.path),
        path: file.path,
        type: "file",
        content: file.content,
        metadata: getMetadata(file.path),
      };
      if (config.includeAST && path.extname(file.path) === ".js") {
        fileNode.ast = generateAST(file.content, file.path);
      }
      node.children.push(fileNode);
    } else {
      let child = node.children.find((child) => child.name === segments[0]);
      if (!child) {
        child = {
          name: segments[0],
          path: path.join(node.path, segments[0]),
          type: "directory",
          children: [],
          metadata: getMetadata(path.join(node.path, segments[0])),
        };
        node.children.push(child);
      }
      addNode(child, segments.slice(1), file);
    }
  };

  fileTree.forEach((file) => {
    const relativePath = path.relative(rootDir, file.path);
    const segments = relativePath.split(path.sep);
    addNode(root, segments, file);
  });

  return root;
};

const getMetadata = (filePath) => {
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    createdAt: stats.birthtime,
    updatedAt: stats.mtime,
  };
};

module.exports = {
  generateProjectJson,
};
