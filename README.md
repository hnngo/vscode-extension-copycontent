# 📋 Copy File Content VS Code Extension

Copy file contents along with their relative file paths directly to your clipboard from the Explorer context menu.

## ✨ Features

- Right-click one or multiple files → **Copy Content**.
- Copies file contents along with their relative paths.
- Supports multi-file selection.

Example clipboard output:

```
// folder/test.txt
<--- content of test.txt --->

// folder/another.txt
<--- content of another.txt --->
```

## 🛠 Installation

1. Install the VSCE tool globally if you haven't already:

```bash
npm install -g @vscode/vsce
```

2. Navigate to the extension folder and run:

```bash
vsce package
```

This will generate a `.vsix` file.

3. Open Command Palette.
4. Select **Extensions: Install from VSIX...** and choose the generated file.

## 📂 How to Use

- Open your workspace folder.
- Right-click any file(s) in the Explorer.
- Click **Copy Content**.
- Paste it anywhere!

## 📄 License

This project is licensed under the [MIT License](LICENSE).
