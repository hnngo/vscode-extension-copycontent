# 📋 Copy File Content VS Code Extension

Copy file contents along with their relative file paths directly to your clipboard from the Explorer context menu.

## ✨ Features

- Right-click one or multiple files or folders → **Copy Content**.
- Recursively reads and copies all file contents inside folders.
- Prepends each file's relative path.
- Supports multi-file and multi-folder selection.

Example clipboard output:

```
// folder/test.txt
<--- content of test.txt --->

// folder/another.txt
<--- content of another.txt --->
```

## 🛠 Installation

1. Install dependencies:

```bash
npm install
```

2. Package the extension:

```bash
npm run pack
```

This will generate a `.vsix` file (e.g., `copy-file-content-0.0.2.vsix`).

3. In VS Code, open the Command Palette (`Cmd + Shift + P`).
4. Select **Extensions: Install from VSIX...** and choose the generated file.

## 📂 How to Use

- Open your workspace folder.
- Right-click any file(s) or folder(s) in the Explorer.
- Click **Copy Content**.
- Paste it anywhere (clipboard contains formatted content).

## 📄 License

This project is licensed under the [MIT License](LICENSE).