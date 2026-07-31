/* Dragon Raja fan site — 发布辅助脚本
 * 用法：
 *   node deploy.mjs            # 注入版本号并重建 sw.js（不发布）
 *   node deploy.mjs --deploy   # 注入 + surge 发布
 *   $env:DR_VERSION="20260731-1"; node deploy.mjs   # 手动指定版本
 *
 * 作用：
 *  - 为所有本地 JS/CSS 引用追加 ?v= 版本号（外部链接不动）
 *  - 为 style.css / eva-extra.css 内的 url(img/...) 追加版本号
 *  - 重写 sw.js：更新缓存版本号与预缓存清单
 * 由此绕开 Surge 边缘缓存与浏览器缓存，保证「发布即更新」。
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(process.env.DR_DIST || path.dirname(fileURLToPath(import.meta.url)));
const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

function stamp() {
  if (process.env.DR_VERSION) return String(process.env.DR_VERSION).trim();
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
const VERSION = stamp();

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function injectHtml(html) {
  return html.replace(/((?:src|href)=")([^"]+?)(\?v=[^"]*)?(")/g, (m, pre, url, oldQ, post) => {
    if (/^(?:https?:)?\/\//.test(url) || url.startsWith('#') || url.startsWith('data:')) return m;
    if (!/\.(?:js|css)$/i.test(url)) return m;
    return `${pre}${url}?v=${VERSION}${post}`;
  });
}

function injectCss(css) {
  return css.replace(/url\(\s*['"]?(img\/[^)'"]+?)['"]?\s*\)/g, (m, u) => {
    const clean = u.replace(/\?v=[^)]*$/, '');
    return `url(${clean}?v=${VERSION})`;
  });
}

// 1) HTML / CSS 注入版本号
const htmlFiles = walk(DIST).filter((f) => /\.html$/i.test(f));
let htmlCount = 0;
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const next = injectHtml(html);
  if (next !== html) { fs.writeFileSync(f, next); htmlCount++; }
}
const cssFiles = walk(DIST).filter((f) => /\.css$/i.test(f));
for (const f of cssFiles) {
  const css = fs.readFileSync(f, 'utf8');
  const next = injectCss(css);
  if (next !== css) fs.writeFileSync(f, next);
}

// 2) 重建 sw.js
const swTplPath = path.join(DIST, 'sw.js.template');
let sw = fs.readFileSync(swTplPath, 'utf8');
const assets = walk(DIST)
  .filter((f) => /\.(?:js|css|webp|png|jpe?g)$/i.test(f))
  .filter((f) => !f.endsWith('sw.js'))
  .map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/'));
const precache = assets.map((u) => (/\.(?:js|css)$/i.test(u) ? `${u}?v=${VERSION}` : u));
// GitHub Pages 以子路径（/dragonraja-site/）部署，预缓存必须用相对路径；
// Surge 根域名部署同样适用相对路径（相对 sw.js 所在目录解析）。
const relPrecache = precache.map((u) => u.replace(/^\//, ''));
sw = sw.replaceAll('__CACHE_VERSION__', VERSION).replaceAll('__PRECACHE__', JSON.stringify(relPrecache));
fs.writeFileSync(path.join(DIST, 'sw.js'), sw);

console.log(`[deploy] version=${VERSION}`);
console.log(`[deploy] html updated=${htmlCount}/${htmlFiles.length} precache=${relPrecache.length}`);

// 3) 可选：surge 发布
if (process.argv.includes('--deploy')) {
  let domain = '';
  try { domain = fs.readFileSync(path.join(DIST, 'CNAME'), 'utf8').trim(); } catch (e) {}
  const cmd = `npx surge "${DIST}" ${domain}`.trim();
  console.log(`[deploy] ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}
