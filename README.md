# 龙族 · 混血种档案 ｜ Dragon Raja Fan Site

> 每个人心里都有一条龙。 — A dragon sleeps within every heart.

一个以江南小说《龙族》为主题的**非商业同人个人站**：电影感「卡塞尔学院录取通知书」开场、混血种血统鉴定仪式、36 条言灵图鉴、龙族 1—5 卷情节长卷（互动）、四大龙王双生档案，双轨 BGM，**中英双语一键切换**。

A non-commercial fan site themed on Jiang Nan's *Dragon Raja* novels — a cinematic "Cassell College admission notice" intro, a hybrid bloodline test ritual, a 36-entry spirit codex, an interactiveVolumes chronicle (Vol. 1–5), four dragon-king twin-bond dossiers, dual-track BGM, and a **one-tap Chinese / English toggle**.

## ⚠️ Disclaimer & Copyright

《龙族》(Dragon Raja) © 原作者 **江南** 及原著出版方。本站所有世界观、设定、人物与「言灵」名称的版权归属于原作者，本站为读者自发制作的**非官方、非商业同人向个人志**，无任何商用、二次售卖行为。血统鉴定结果纯属随机模拟，与现实无关。

*Dragon Raja* © its original author **Jiang Nan** and the original publisher. All worldview, settings, characters and "spirit" names belong to the original author. This is an **unofficial, non-commercial fan-made personal site** with no commercial use or resale. Bloodline test results are randomly simulated and unrelated to reality.

## License

本仓库的代码与原创内容（排版、脚本、同人扩写文案）采用 **[CC BY-NC 4.0](./LICENSE)**（署名-非商业性使用 4.0 国际）授权。

Code and original content (layout, scripts, fan-written copy) in this repository are licensed under **[CC BY-NC 4.0](./LICENSE)** (Attribution-NonCommercial 4.0 International).

> 《龙族》原著相关知识产权不在此授权范围内，归原作者所有。
> Dragon Raja original IP is NOT covered by this license and remains with its original author.

## Tech

纯静态多页站，零构建步骤：HTML / CSS / 原生 JS，双 `<audio>` 交叉淡入播放器，`localStorage` 记忆语言偏好。

Vanilla static multi-page site, zero build step: HTML / CSS / vanilla JS, dual-`<audio>` crossfade player, `localStorage` language persistence.

## Live

GitHub Pages: **[https://luisdingww-bit.github.io/dragonraja-site/](https://luisdingww-bit.github.io/dragonraja-site/)**

---

© 龙族同人个人站 · Ding.LDCrew-MADE · 禁止商用 / No Commercial Use

## 更新与缓存（2026-07 优化）

> 线上曾出现「改完代码还是旧版」：Surge 边缘节点会把同名 `eva.js` / `style.css` 等资源缓存数小时（响应头 `surge-cache: HIT` + 长 `age`），浏览器与 CDN 都会命中旧文件。

**发布请使用脚本，不要手动上传：**

```bash
node deploy.mjs            # 为 JS/CSS 追加 ?v= 版本号，重建 sw.js（不发布）
node deploy.mjs --deploy   # 注入版本号后直接发布到 Surge
$env:DR_VERSION="20260731-1"; node deploy.mjs   # 手动指定版本
```

- HTML 中所有本地 `js/css` 引用都会带 `?v=<部署时间>`：新文件名 → 绕过浏览器与 CDN 全部缓存层，发布即生效。
- `sw.js`（Service Worker）：导航请求网络优先、静态资源 stale-while-revalidate（秒开 + 后台更新）；每次部署缓存版本变化，自动清理旧缓存；离线时回退已缓存页面。
- 音频/视频（`mp3/mp4`）不预缓存，仅在使用时进入缓存，避免首访流量过大。

## EVA 智能终端（2026-07 升级）

- 知识库从 ~15 条扩到 **40+ 条**：人物（夏弥/零/源稚生/赫尔佐格/康斯坦丁/芬里厄/奥丁/楚天骄…）、地点（青铜城/东京塔/源氏重工/尼伯龙根/世界树/冰窖…）、组织（秘党/执行部/装备部/学生会…）、五卷剧情、经典台词。
- 匹配引擎：加权关键词打分（主词/别名/子串/覆盖度），不再"第一个命中就返回"；重复提问会换角度回答。
- 多轮上下文：回答后可用「再说点 / 然后呢」继续追问同一条目；支持「你好 / 谢谢 / 我爱你 / Sakura / 绘梨衣的结局」等情感向应答。
- 回答附带**站内导航按钮**（如"言灵 → 言灵图鉴"）与**追问 chips**；新增「语录」快捷命令（随机经典台词）。
- 修复：`characters-data.js` 此前在线上 404（备份缺失），已补占位文件；人物页核心数据本就在 `characters.html` 内联。

## 新增模块（2026-07-31 按《新增模块建议》落地）

### 高优先级
- **语录图书馆 `quotes.html`**：32 条经典台词，按人物 / 主题（离别·牺牲·温柔·爱情·希望·中二）/ 卷次筛选，支持搜索与收藏（localStorage）；「每日一句」按日期 seed 轮换；搜索「绘梨衣 / Sakura」触发樱花粒子彩蛋。
- **龙族编年史 `timeline.html`**：从黑王诞生、白王被弑、千年权位之争，到青铜城、夏弥与芬里厄、东京、世界树终局共 10 个节点；点击展开档案卡，可跳转对应卷次。
- **卡塞尔机构簿 `orgs.html`**：秘党 / 执行部 / 装备部 / 狮心会 / 学生会 / 蛇岐八家，每家一张卡（职能 · 代表人物 · 经典事件 · 经典梗）。
- **装备部仓库 `items.html`**：黑卡、红白护腕、迈巴赫、七宗罪、四分之一条命契约书、学生证、尼伯龙根钥匙、《东京爱情故事》画册、村雨、芬里厄的篮球——出处卷次 + 名场面引文。
- **混血种档案 · 成就系统 `achievements.js`**：7 枚徽章（血统鉴定 / 言灵觉醒 / 屠龙者试炼 / 三十六言灵 / 五卷编年 / EVA 之友 / 语录收藏家），纯 localStorage；首页血统仪式下方与 EVA 终端学员档案卡展示「档案完成度」进度条。

### 中优先级
- **学院测验 `quiz.html`**：「你是龙族中的谁」十题人格测试（匹配明非 / 楚子航 / 凯撒 / 绘梨衣 / 路鸣泽 / 零六种结局卡）+ 十题龙族知识快问快答（按得分给混血种等级，可 canvas 生成成绩分享卡并下载）。

### 彩蛋
- 页面停留 60 秒后 EVA 挂件轻轻低语一句名台词（不打断浏览）。

### 联动
- EVA 知识库新增「编年史 / 语录图书馆 / 黑卡 / 迈巴赫 / 装备 / 机构 / 成就 / 测验」条目，秘党、执行部、装备部、学生会、狮心会、蛇岐八家、红白护腕、四分之一条命等旧条目补充站内导航；「语录」命令回答自动附带语录图书馆入口。
- 全站导航新增 5 个入口：语录图书馆 / 龙族编年史 / 学院机构簿 / 装备部仓库 / 学院测验。

## 账号与找回密码（2026-08-01）

- **登录宽容化**：邮箱大小写不敏感；密码若带首尾空格（输入法 / 自动补全常见）会自动容错并迁移存储，解决「密码总是输错」。
- **忘记密码**：首页录取弹窗与全站通用登录弹窗均新增「忘记密码？」。
  - 演示模式（默认，localStorage 账号）：填写注册时的「邮箱 + 姓名 + 年龄」验证身份后直接设置新密码；本地无此账号时会明确提示「演示模式账号仅保存在注册时的浏览器」。
  - Supabase 模式（auth.js 填入凭据后）：向邮箱发送重置链接，落地到 `recover.html` 设置新密码。
- 提醒：演示模式账号只存在于注册时的那台设备 / 浏览器中，跨设备请重新登记，或配置 Supabase 实现真账号。

## 已知待修正（原站遗留）

- `characters.html` 中楚子航言灵写作「君焰（序列号89）」，而 `codex.html` 图鉴为 71，两处不一致，建议统一为 71（图鉴页为准）。
- 页面加载了 Google Fonts 外部字体，国内访问可能较慢；可考虑自托管字体。
