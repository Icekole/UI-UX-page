import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATA_SOURCE_ID = (process.env.NOTION_DATA_SOURCE_ID || "1f7ecc85-3324-4c87-9b26-e2281393f188").replace(/^collection:\/\//, "");
const NOTION_TOOLS_DATA_SOURCE_ID = (process.env.NOTION_TOOLS_DATA_SOURCE_ID || "653252c3-0b5b-4f8f-987f-0cda8f1b2780").replace(/^collection:\/\//, "");
const NOTION_VERSION = process.env.NOTION_VERSION || "2025-09-03";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "content/readings";
const ARCHIVE_DIR = path.join(OUTPUT_DIR, "archive");
const TOOLS_OUTPUT_DIR = process.env.TOOLS_OUTPUT_DIR || "content/tools";

if (!NOTION_TOKEN) {
  throw new Error("缺少 NOTION_TOKEN。请在 GitHub Secrets 中配置 Notion Integration Token。");
}

// 读取 Notion API，统一处理鉴权和错误信息。
async function notionApi(endpoint, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Notion API 请求失败：${response.status} ${body}`);
  }

  return response.json();
}

// 提取 Notion 富文本中的纯文本，链接保留为 Markdown 形式。
function richTextToMarkdown(items = []) {
  return items.map(item => {
    const text = item.plain_text || "";
    return item.href ? `[${text}](${item.href})` : text;
  }).join("");
}

function propText(page, name) {
  const prop = page.properties?.[name];
  if (!prop) return "";
  if (prop.type === "title") return richTextToMarkdown(prop.title);
  if (prop.type === "rich_text") return richTextToMarkdown(prop.rich_text);
  if (prop.type === "url") return prop.url || "";
  return "";
}

function propDate(page, name) {
  return page.properties?.[name]?.date?.start || "";
}

function propSelect(page, name) {
  return page.properties?.[name]?.select?.name || "";
}

function propCheckbox(page, name) {
  return Boolean(page.properties?.[name]?.checkbox);
}

function propNumber(page, name) {
  return page.properties?.[name]?.number || 0;
}

function propMultiSelect(page, name) {
  return (page.properties?.[name]?.multi_select || []).map(item => item.name);
}

function slugify(value, fallback) {
  const source = value || fallback;
  return String(source)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
}

// 将常见 Notion block 转成网站可渲染的 Markdown。
async function blockToMarkdown(block) {
  const type = block.type;
  const value = block[type];
  const text = richTextToMarkdown(value?.rich_text || []);
  let line = "";

  if (type === "heading_1") line = `## ${text}`;
  if (type === "heading_2") line = `## ${text}`;
  if (type === "heading_3") line = `### ${text}`;
  if (type === "paragraph") line = text;
  if (type === "bulleted_list_item") line = `- ${text}`;
  if (type === "numbered_list_item") line = `1. ${text}`;
  if (type === "quote") line = `> ${text}`;
  if (type === "to_do") line = `- ${value.checked ? "[x]" : "[ ]"} ${text}`;
  if (type === "callout") line = text;
  if (type === "bookmark") line = value.url || "";
  if (type === "embed") line = value.url || "";
  if (type === "image") {
    const url = value.type === "external" ? value.external.url : value.file?.url;
    line = url ? `![图片](${url})` : "";
  }
  if (type === "divider") line = "---";

  if (!block.has_children) return line;

  const children = await fetchBlocks(block.id);
  return [line, children].filter(Boolean).join("\n");
}

async function fetchBlocks(blockId) {
  const blocks = [];
  let cursor;

  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (cursor) query.set("start_cursor", cursor);
    const data = await notionApi(`/blocks/${blockId}/children?${query.toString()}`);
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const markdown = [];
  for (const block of blocks) {
    const line = await blockToMarkdown(block);
    if (line) markdown.push(line);
  }

  return markdown.join("\n");
}

async function fetchPublishedPages() {
  const pages = [];
  let cursor;

  do {
    const body = {
      page_size: 100,
      filter: {
        property: "状态",
        select: { equals: "已发布" }
      },
      sorts: [
        { property: "日期", direction: "descending" }
      ]
    };
    if (cursor) body.start_cursor = cursor;

    const data = await notionApi(`/data_sources/${NOTION_DATA_SOURCE_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body)
    });

    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages;
}

async function fetchPublishedTools() {
  const tools = [];
  let cursor;

  do {
    const body = {
      page_size: 100,
      filter: {
        property: "状态",
        select: { equals: "已发布" }
      },
      sorts: [
        { property: "排序", direction: "ascending" }
      ]
    };
    if (cursor) body.start_cursor = cursor;

    const data = await notionApi(`/data_sources/${NOTION_TOOLS_DATA_SOURCE_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body)
    });

    tools.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return tools;
}

function toIndexItem(reading) {
  return {
    id: reading.id,
    date: reading.date,
    title: reading.title,
    slug: reading.slug,
    summary: reading.summary,
    tags: reading.tags,
    sourcesCount: reading.sourcesCount,
    path: reading.path
  };
}

async function readExistingLatest() {
  try {
    return JSON.parse(await readFile(path.join(OUTPUT_DIR, "latest.json"), "utf8"));
  } catch {
    return null;
  }
}

async function sync() {
  await mkdir(ARCHIVE_DIR, { recursive: true });

  const pages = await fetchPublishedPages();
  const readings = [];

  for (const page of pages) {
    const date = propDate(page, "日期");
    const slug = slugify(propText(page, "Slug"), date || page.id);
    const title = propText(page, "标题") || `${date} UI/产品前沿晨读`;
    const contentMarkdown = await fetchBlocks(page.id);
    const reading = {
      id: page.id,
      date,
      title,
      slug,
      status: propSelect(page, "状态"),
      isLatest: propCheckbox(page, "是否最新"),
      trend: {
        title: propText(page, "趋势标题"),
        summary: propText(page, "趋势摘要")
      },
      summary: propText(page, "列表摘要") || propText(page, "趋势摘要"),
      tags: propMultiSelect(page, "标签"),
      sourcesCount: propNumber(page, "来源数量"),
      publicUrl: propText(page, "公开链接"),
      notionUrl: page.url,
      path: `content/readings/archive/${slug}.json`,
      contentMarkdown,
      generatedAt: new Date().toISOString()
    };

    readings.push(reading);
  }

  const latest = readings.find(item => item.isLatest) || readings[0] || await readExistingLatest();
  const archiveSlugs = new Set(readings.map(item => `${item.slug}.json`));

  for (const reading of readings) {
    await writeFile(path.join(ARCHIVE_DIR, `${reading.slug}.json`), JSON.stringify(reading, null, 2), "utf8");
  }

  for (const file of await readdir(ARCHIVE_DIR).catch(() => [])) {
    if (file.endsWith(".json") && !archiveSlugs.has(file)) {
      await rm(path.join(ARCHIVE_DIR, file));
    }
  }

  await writeFile(path.join(OUTPUT_DIR, "latest.json"), JSON.stringify(latest, null, 2), "utf8");
  await writeFile(path.join(OUTPUT_DIR, "index.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    readings: readings.map(toIndexItem)
  }, null, 2), "utf8");

  console.log(`已同步 ${readings.length} 条已发布晨读。`);
}

async function syncTools() {
  await mkdir(TOOLS_OUTPUT_DIR, { recursive: true });

  const categoryMap = {
    "设计": "design",
    "产品": "product",
    "AI": "ai",
    "研发": "dev"
  };
  const groups = { design: [], product: [], ai: [], dev: [] };
  const pages = await fetchPublishedTools();

  pages.forEach(page => {
    const category = propSelect(page, "分类");
    const key = categoryMap[category];
    if (!key) return;

    groups[key].push({
      id: page.id,
      name: propText(page, "名称"),
      desc: propText(page, "描述"),
      url: propText(page, "链接"),
      category,
      order: propNumber(page, "排序"),
      tags: propMultiSelect(page, "标签")
    });
  });

  Object.values(groups).forEach(items => items.sort((a, b) => a.order - b.order));
  await writeFile(path.join(TOOLS_OUTPUT_DIR, "index.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    groups
  }, null, 2), "utf8");

  console.log(`已同步 ${pages.length} 条已发布工具。`);
}

async function main() {
  await sync();
  await syncTools();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
