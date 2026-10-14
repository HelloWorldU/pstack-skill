#!/usr/bin/env node
/**
 * translate.mjs — 翻译状态检查 + 可选的机器翻译。
 *
 * 翻译存放规则：i18n/zh-CN/ 下按源文件相同相对路径存放中文 markdown，
 * 构建网站时优先采用译文，缺失时回退英文原文并在页面上标注。
 *
 * 用法：
 *   node tools/translate.mjs            # 列出尚未翻译的文件（默认）
 *   node tools/translate.mjs --apply    # 对缺失文件调用机器翻译 API
 *
 * 机器翻译通过环境变量配置（LibreTranslate 兼容协议）：
 *   TRANSLATE_API_URL   例如 https://libretranslate.com/translate
 *   TRANSLATE_API_KEY   可选，API 密钥
 * 未配置时 --apply 会提示如何配置并退出。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZH = path.join(ROOT, 'i18n', 'zh-CN');
const SKIP_DIRS = new Set(['.git', '.upstream-cache', 'site', 'i18n', 'tools', 'node_modules']);

const apply = process.argv.includes('--apply');

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path.relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

const all = walk(ROOT);
const missing = all.filter((rel) => !fs.existsSync(path.join(ZH, rel)));

console.log(`markdown 文件共 ${all.length} 个，已翻译 ${all.length - missing.length} 个，待翻译 ${missing.length} 个。`);
for (const rel of missing) console.log(`  ✗ ${rel}`);

if (!apply) {
  if (missing.length > 0) console.log('\n提示：配置 TRANSLATE_API_URL 后运行 node tools/translate.mjs --apply 可机器翻译缺失文件。');
  process.exit(0);
}

if (missing.length === 0) process.exit(0);

const API_URL = process.env.TRANSLATE_API_URL;
const API_KEY = process.env.TRANSLATE_API_KEY;
if (!API_URL) {
  console.error('\n✗ 未配置 TRANSLATE_API_URL 环境变量，无法机器翻译。');
  console.error('  示例（PowerShell）：$env:TRANSLATE_API_URL="https://libretranslate.com/translate"');
  process.exit(1);
}

/** 按块切分 markdown：代码块与 frontmatter 不翻译，其余逐块翻译。 */
function splitBlocks(src) {
  const lines = src.split('\n');
  const blocks = [];
  let cur = [];
  let inCode = false;
  let inFront = lines[0] === '---';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inFront) {
      blocks.push({ text: line, skip: true });
      if (i > 0 && line === '---') inFront = false;
      continue;
    }
    if (/^```/.test(line)) {
      if (cur.length) { blocks.push({ text: cur.join('\n'), skip: false }); cur = []; }
      inCode = !inCode;
      blocks.push({ text: line, skip: true });
      continue;
    }
    if (inCode) { blocks.push({ text: line, skip: true }); continue; }
    if (line.trim() === '') {
      if (cur.length) { blocks.push({ text: cur.join('\n'), skip: false }); cur = []; }
      blocks.push({ text: '', skip: true });
    } else {
      cur.push(line);
    }
  }
  if (cur.length) blocks.push({ text: cur.join('\n'), skip: false });
  return blocks;
}

async function translateText(text) {
  const body = { q: text, source: 'en', target: 'zh', format: 'text' };
  if (API_KEY) body.api_key = API_KEY;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`翻译 API 返回 ${res.status}`);
  const data = await res.json();
  return data.translatedText ?? data.translation ?? text;
}

for (const rel of missing) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const blocks = splitBlocks(src);
  const out = [];
  for (const b of blocks) {
    if (b.skip || !b.text.trim()) { out.push(b.text); continue; }
    try {
      out.push(await translateText(b.text));
    } catch (e) {
      console.error(`  ! ${rel} 有一块翻译失败（${e.message}），保留原文`);
      out.push(b.text);
    }
  }
  const dst = path.join(ZH, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, out.join('\n'));
  console.log(`  ✓ ${rel}`);
}
console.log('\n机器翻译完成。建议人工校对后运行 node tools/build.mjs 重建网站。');
