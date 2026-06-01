# Agent 与 Skill 整理说明

本仓库整理自原 macOS 工作区当前使用的 agent、skill 与原型文件，用于集中保存 UI/UX 页面相关能力与示例原型。agent 与 skill 已按 `macOS/` 和 `Windows/` 两个平台目录分开。

## 目录结构

```text
macOS/
  agents/
    mcp.json
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

Windows/
  agents/
    mcp.json
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

- `AGENTS.md`：agent 工作规约，说明产品设计前的 skill 使用流程、代码实现规则、实现后文档产出和 PRD/交互文档/功能实现文档格式。
- `macOS/agents/`：macOS 版项目级 agent 配置与 `.agents/skills` 下当前使用的协作、设计审查、设计 token 实现、PRD 写作相关 skill。
- `macOS/skills/`：macOS 版项目根目录 `skills` 下的通用 skill。
- `Windows/agents/`：Windows 版项目级 agent 配置与 agent skills，MCP 本机命令路径已改为 Windows 占位路径。
- `Windows/skills/`：Windows 版通用 skill。
- `prototypes/`：`PRD/prototypes` 下的个人门户原型、交互文档与功能实现文档。

## 整理规则

- 已排除 macOS 生成的 `.DS_Store` 文件。
- `macOS/agents/mcp.json` 与 `Windows/agents/mcp.json` 中的 Stitch API Key 均已替换为 `<YOUR_STITCH_API_KEY>`，使用前请在本地填入自己的密钥或改为环境变量注入。
- `macOS/` 保留 `.sh` 脚本；`Windows/` 保留 `.ps1` 脚本。
- 保留原型 HTML 与 Markdown 文档按原文件名展示，原型内容不区分平台。

## Windows 使用说明

1. 使用 `Windows/agents/mcp.json` 作为 Windows 参考配置。
2. 把 `C:\\Users\\<YOUR_WINDOWS_USER>\\...` 替换为 Windows 机器上的真实路径。
3. 把 `<YOUR_STITCH_API_KEY>` 替换为自己的 Stitch API Key，或改成当前工具支持的环境变量注入方式。
4. Windows PowerShell 下可使用 `Windows/agents/skills/brainstorming/scripts/start-server.ps1` 与 `stop-server.ps1`。
5. 运行脚本前需确认 Windows 已安装 Node.js，并且 `node` 命令在 `PATH` 中可用。

## macOS 使用说明

1. 使用 `macOS/agents/mcp.json` 作为 macOS 参考配置。
2. 把 `/Users/<YOUR_MAC_USER>/...` 替换为 macOS 机器上的真实路径。
3. macOS 或类 Unix shell 下可使用 `macOS/agents/skills/brainstorming/scripts/start-server.sh` 与 `stop-server.sh`。
