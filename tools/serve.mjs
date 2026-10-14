#!/usr/bin/env node
/**
 * serve.mjs — 本地静态服务器，伺服 site/ 目录并自动打开浏览器。
 *
 * 用法：
 *   node tools/serve.mjs            # 默认端口 4370
 *   node tools/serve.mjs --port 8080
 *   node tools/serve.mjs --no-open  # 不自动打开浏览器
 */
import { exec } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');

const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT = portIdx >= 0 ? Number(args[portIdx + 1]) : 4370;
const NO_OPEN = args.includes('--no-open');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.tsv': 'text/tab-separated-values; charset=utf-8',
};

if (!fs.existsSync(path.join(SITE, 'index.html'))) {
  console.error('✗ 尚未生成网站。请先运行：node tools/build.mjs（或双击 启动网站.bat）');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(SITE, urlPath);
  if (!file.startsWith(SITE)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<meta charset="utf-8"><h1>404</h1><p>页面不存在。<a href="/">返回首页</a></p>');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`✓ 网站已启动：${url}`);
  console.log('  按 Ctrl+C 停止服务。');
  if (!NO_OPEN) {
    exec(`cmd /c start "" "${url}"`, () => {});
  }
});
