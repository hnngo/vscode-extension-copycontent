const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  const copyContentCommand = vscode.commands.registerCommand('extension.copyContent', async (fileUri, selectedUris) => {
    const uris = selectedUris || [fileUri];

    if (!uris || uris.length === 0) {
      vscode.window.showErrorMessage('No files selected.');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open.');
      return;
    }

    try {
      const allFiles = await gatherAllSelectedFiles(uris);
      const combinedContent = buildCombinedFileContent(workspaceFolder, allFiles);

      await vscode.env.clipboard.writeText(combinedContent.trim());
      vscode.window.showInformationMessage('Copied content to clipboard!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to copy content: ${error.message}`);
    }
  });

  context.subscriptions.push(copyContentCommand);

  const copyPathTreeCommand = vscode.commands.registerCommand('extension.copyPathTree', async (fileUri, selectedUris) => {
    const uris = selectedUris || [fileUri];

    if (!uris || uris.length === 0) {
      vscode.window.showErrorMessage('No files selected.');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open.');
      return;
    }

    try {
      const treeString = await generatePathTree(uris, workspaceFolder);
      await vscode.env.clipboard.writeText(treeString);
      vscode.window.showInformationMessage('Copied file path tree to clipboard!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to copy path tree: ${error.message}`);
    }
  });

  context.subscriptions.push(copyPathTreeCommand);
}

function deactivate() { }

/**
 * Recursively gathers all files from selected URIs
 * @param {vscode.Uri[]} uris 
 * @returns {Promise<string[]>} Absolute file paths
 */
async function gatherAllSelectedFiles(uris) {
  let allFiles = [];

  for (const uri of uris) {
    const absolutePath = uri.fsPath;
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      const files = getAllFilesRecursively(absolutePath);
      allFiles = allFiles.concat(files);
    } else if (stat.isFile()) {
      allFiles.push(absolutePath);
    }
  }

  return allFiles;
}

/**
 * Recursively find all files inside a folder
 * @param {string} dirPath 
 * @returns {string[]} List of absolute file paths
 */
function getAllFilesRecursively(dirPath) {
  let files = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAllFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build the combined clipboard string with relative paths
 * @param {string} workspaceFolder 
 * @param {string[]} filePaths 
 * @returns {string}
 */
function buildCombinedFileContent(workspaceFolder, filePaths) {
  let result = '';

  for (const filePath of filePaths) {
    const relativePath = path.relative(workspaceFolder, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    result += `// ${relativePath}\n${content}\n\n`;
  }

  return result;
}

async function generatePathTree(uris, basePath) {
  let result = '';

  for (const uri of uris) {
    const absolutePath = uri.fsPath;
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      result += await buildTree(absolutePath, basePath);
    } else {
      const relativePath = path.relative(basePath, absolutePath);
      result += `${relativePath}\n`;
    }
  }

  return result.trim();
}

function buildTree(dirPath, basePath, prefix = '') {
  let tree = '';
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const total = entries.length;

  entries.forEach((entry, index) => {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);
    const isLast = index === total - 1;
    const branch = isLast ? '└── ' : '├── ';
    const subPrefix = isLast ? '    ' : '│   ';

    tree += `${prefix}${branch}${entry.name}\n`;

    if (entry.isDirectory()) {
      tree += buildTree(fullPath, basePath, prefix + subPrefix);
    }
  });

  return tree;
}


module.exports = {
  activate,
  deactivate
};
