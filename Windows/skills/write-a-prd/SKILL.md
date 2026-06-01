---
name: write-a-prd
description: Create or revise a PRD through user interview, repo exploration, and module design. Use when the user wants to write a PRD, revise an existing PRD, unify PRD structure, or plan a new feature in the repository documentation system.
---

This skill is used when the user wants to create a new PRD or revise an existing PRD in this repository. Follow the repository PRD rules in `AGENTS.md` and the canonical template in `PRD/PRD模版.md`.

1. If the task is a new PRD or a substantial solution design, start with the brainstorming skill to clarify requirements before drafting.

2. Explore the repo and existing PRD documents to verify the current state, terminology, module boundaries, and whether a related PRD already exists.

3. For new PRDs, present a draft to the user for review before writing to file. Only write after the user explicitly approves. For edits to existing PRDs, if the user has already explicitly authorized direct cleanup or batch standardization, you may edit files directly.

4. Keep the PRD aligned to the repository template. The standard structure is:

- 一、前言
- 二、需求背景
- 三、产品流程图
- 四、产品原型图与规则定义
- 五、异常流与边界条件
- 六、数据埋点
- 七、功能清单与排期
- 八、待办事项
- 九、性能要求（可选）
- 十、附录（可选）

5. The PRD title must follow this format: `<产品端><功能模块> PRD Vx.y`.

6. New PRD files should be created directly under the product directory, without extra feature subfolders. Use names such as `能力图谱.md` rather than nested directories unless the repository owner explicitly changes this convention.

7. Update the version change log whenever the PRD is materially revised. Remove redundant footer metadata such as "文档结束"、"最后更新时间"、"文档类型" if the front matter already carries version context.

8. Use repository PRD output, not GitHub issue output.

9. When standardizing existing PRDs, prioritize:

- title consistency
- section skeleton consistency
- terminology consistency
- removing repeated logic across sections
- merging non-core sections into 附录 when appropriate
- fixing stale paths, stale version markers, and heading numbering drift

10. Do not switch to the generic issue-style template below; the repository template takes precedence.

