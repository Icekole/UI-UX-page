# Agent 与 Skill 整理说明

本仓库整理自 `/Users/xiaolin/Works/TThd/AI` 当前使用的 agent、skill 与原型文件，用于集中保存 UI/UX 页面相关能力与示例原型。

## 目录结构

```text
agents/
  mcp.json
  mcp.windows.json
  skills/
    brainstorming/
    impeccable/
    implement-with-design-tokens/
    write-a-prd/

skills/
  SKILL.md
  data
  scripts
  ui-ux-pro-max/
  write-a-prd/

prototypes/
  personal-portal-demo.html
  个人门户网站.md
  交互文档.md
  功能实现文档.md
```

## 内容说明

- `agents/`：项目级 agent 配置与 `.agents/skills` 下当前使用的协作、设计审查、设计 token 实现、PRD 写作相关 skill。
- `skills/`：项目根目录 `skills` 下的通用 skill，包括 UI/UX 能力集与 PRD 写作 skill。
- `prototypes/`：`PRD/prototypes` 下的个人门户原型、交互文档与功能实现文档。

## 整理规则

- 已排除 macOS 生成的 `.DS_Store` 文件。
- `agents/mcp.json` 中的 Stitch API Key 已替换为 `<YOUR_STITCH_API_KEY>`，使用前请在本地填入自己的密钥或改为环境变量注入。
- `agents/mcp.json` 保留 macOS 路径配置；`agents/mcp.windows.json` 是 Windows 参考配置。
- 保留原始目录结构，便于后续同步和对比。
- 原型 HTML 与 Markdown 文档按原文件名保留。

## Windows 使用说明

1. 将 `agents/mcp.windows.json` 复制或重命名为实际运行环境读取的 MCP 配置文件。
2. 把 `C:\\Users\\<YOUR_WINDOWS_USER>\\...` 替换为 Windows 机器上的真实路径。
3. 把 `<YOUR_STITCH_API_KEY>` 替换为自己的 Stitch API Key，或改成当前工具支持的环境变量注入方式。
4. Windows PowerShell 下可使用 `agents/skills/brainstorming/scripts/start-server.ps1` 与 `stop-server.ps1`；Git Bash 或 WSL 仍可继续使用原 `.sh` 脚本。
5. 运行脚本前需确认 Windows 已安装 Node.js，并且 `node` 命令在 `PATH` 中可用。
