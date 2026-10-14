#!/usr/bin/env node
/**
 * sync.mjs — 拉取上游 https://github.com/cursor/plugins 中 pstack 目录的最新内容。
 *
 * 原理：
 *   1. 用稀疏检出（sparse checkout）把上游仓库克隆到 .upstream-cache/（只取 pstack/ 目录）。
 *   2. 依据 tools/upstream-manifest.json 记录的上次同步文件清单做镜像：
 *      - 上游新增/修改的文件 → 复制到本仓库；
 *      - 上游已删除的文件   → 从本仓库删除；
 *      - 本仓库自有文件（tools/、i18n/、site/、*.bat 等）永远不动。
 *   3. 更新 manifest，打印变更摘要。
 *
 * 用法：
 *   node tools/sync.mjs            # 同步上游
 *   node tools/sync.mjs --check    # 只检查是否有更新，不写入
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.upstream-cache');
const MANIFEST_PATH = path.join(ROOT, 'tools', 'upstream-manifest.json');
const UPSTREAM_URL = 'https://github.com/cursor/plugins';
const UPSTREAM_SUBDIR = 'pstack';

// 本仓库自有路径（不属于上游内容，同步时跳过）
const LOCAL_ONLY = [
  'tools/', 'i18n/', 'site/', '.upstream-cache/', '.git/',
  '启动网站.bat', '更新网站.bat', '网站说明.md',
];

const checkOnly = process.argv.includes('--check');

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function isLocalOnly(rel) {
  const r = rel.replace(/\\/g, '/');
  return LOCAL_ONLY.some((p) => r === p || r.startsWith(p));
}

function hashFile(p) {
  return crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex');
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.isFile()) out.push(path.relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(commit, files) {
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify({ upstream: UPSTREAM_URL, subdir: UPSTREAM_SUBDIR, commit, syncedAt: new Date().toISOString(), files }, null, 2) + '\n',
  );
}

function ensureCache() {
  if (fs.existsSync(path.join(CACHE, '.git'))) {
    console.log('· 拉取上游更新…');
    run('git', ['fetch', 'origin', 'main', '--depth', '1'], CACHE);
    run('git', ['checkout', 'FETCH_HEAD'], CACHE);
  } else {
    console.log('· 首次克隆上游仓库（稀疏检出，仅 pstack 目录）…');
    fs.mkdirSync(CACHE, { recursive: true });
    run('git', ['clone', '--depth', '1', '--filter=blob:none', '--sparse', UPSTREAM_URL, CACHE], ROOT);
    run('git', ['sparse-checkout', 'set', UPSTREAM_SUBDIR], CACHE);
  }
  return run('git', ['rev-parse', 'HEAD'], CACHE);
}

function bootstrapManifest() {
  // 首次运行：把当前工作区里已有的上游内容登记为基线，
  // 这样接下来的镜像只会删除"上游确实删掉"的文件，而不会误删自有文件。
  const files = walk(ROOT).filter((rel) => !isLocalOnly(rel) && !rel.startsWith('tools/'));
  return { commit: null, files };
}

function main() {
  const commit = ensureCache();
  const srcDir = path.join(CACHE, UPSTREAM_SUBDIR);
  if (!fs.existsSync(srcDir)) {
    console.error(`✗ 上游仓库中未找到 ${UPSTREAM_SUBDIR}/ 目录`);
    process.exit(1);
  }

  const manifest = loadManifest() ?? bootstrapManifest();
  const upstreamFiles = walk(srcDir).sort();
  const upstreamSet = new Set(upstreamFiles);
  const oldSet = new Set(manifest.files);

  const added = [];
  const changed = [];
  const removed = manifest.files.filter((f) => !upstreamSet.has(f));

  for (const rel of upstreamFiles) {
    const src = path.join(srcDir, rel);
    const dst = path.join(ROOT, rel);
    if (!oldSet.has(rel)) {
      added.push(rel);
      if (!checkOnly) {
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(src, dst);
      }
    } else if (!fs.existsSync(dst) || hashFile(src) !== hashFile(dst)) {
      changed.push(rel);
      if (!checkOnly) fs.copyFileSync(src, dst);
    }
  }

  if (!checkOnly) {
    for (const rel of removed) {
      const dst = path.join(ROOT, rel);
      if (fs.existsSync(dst)) fs.rmSync(dst);
    }
    saveManifest(commit, upstreamFiles);
  }

  console.log(`\n上游提交: ${commit.slice(0, 10)}${manifest.commit === commit ? '（无变化）' : ''}`);
  console.log(`新增 ${added.length} · 更新 ${changed.length} · 删除 ${removed.length}`);
  for (const f of added.slice(0, 20)) console.log(`  + ${f}`);
  for (const f of changed.slice(0, 20)) console.log(`  ~ ${f}`);
  for (const f of removed.slice(0, 20)) console.log(`  - ${f}`);
  if (added.length > 20 || changed.length > 20 || removed.length > 20) console.log('  …');

  if (checkOnly) {
    process.exit(added.length + changed.length + removed.length > 0 ? 2 : 0);
  }
  if (added.length + changed.length + removed.length > 0) {
    console.log('\n提示：有内容变化，请运行 node tools/translate.mjs 查看待翻译文件，然后 node tools/build.mjs 重建网站。');
  }
}

main();
