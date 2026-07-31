/* 龙族 · EVA 学院终端面板（从 eva.html 合并而来，服务于单页 index.html 的 #eva 段）
 * 依赖：eva.js（window.EVA）、i18n.js（window.t / window.LANG / window.onLangChange）、account.js（window.DR_ACC）
 */
(function () {
  "use strict";
  var E = window.EVA;
  if (!E) return;
  var L = E.L;

  var tabs = document.querySelectorAll(".eva-tab");
  if (!tabs.length) return;
  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var t = b.getAttribute("data-tab");
      document.querySelectorAll(".eva-panel-box").forEach(function (p) { p.classList.add("hidden"); });
      var box = document.getElementById("tab-" + t);
      if (box) box.classList.remove("hidden");
      if (t === "notice") renderNotices();
      if (t === "task") renderTasks();
      if (t === "mail") renderMail();
    });
  });

  /* 通知板 */
  function renderNotices() {
    var list = document.getElementById("notice-list");
    if (!list) return;
    list.innerHTML = "";
    E.NOTICES.forEach(function (n) {
      var read = E.noticesRead().indexOf(n.id) >= 0;
      var d = document.createElement("div");
      d.className = "eva-row" + (read ? " read" : "");
      d.innerHTML = '<div class="eva-row-dot"></div><div class="eva-row-body"><div class="eva-row-text">' + escapeHtml(L(n)) + "</div></div><div class=\"eva-row-flag\">" + (read ? L({ zh: "已读", en: "READ" }) : L({ zh: "未读", en: "NEW" })) + "</div>";
      d.addEventListener("click", function () { E.markNotice(n.id); renderNotices(); });
      list.appendChild(d);
    });
    var unread = E.NOTICES.length - E.noticesRead().length;
    var cc = document.getElementById("notice-count");
    if (cc) cc.textContent = L({ zh: "共 " + E.NOTICES.length + " 条 · " + unread + " 条未读（点按标记已读）", en: E.NOTICES.length + " total · " + unread + " unread (tap to mark read)" });
  }

  /* 任务中心 */
  function renderTasks() {
    var chain = document.getElementById("task-chain");
    if (!chain) return;
    chain.innerHTML = "";
    E.TASKS.forEach(function (tk, i) {
      var st = E.taskStatus(tk.id);
      var node = document.createElement("div");
      node.className = "tc-node " + st;
      node.innerHTML = '<div class="tc-no">' + (i + 1) + '</div><div class="tc-name">' + L(tk) + '</div><div class="tc-state">' + stateLabel(st) + "</div>";
      node.addEventListener("click", function () { showTask(tk); });
      chain.appendChild(node);
      if (i < E.TASKS.length - 1) { var line = document.createElement("div"); line.className = "tc-line" + (st === "done" ? " done" : ""); chain.appendChild(line); }
    });
    showTask(firstActive());
  }
  function firstActive() {
    for (var i = 0; i < E.TASKS.length; i++) { var s = E.taskStatus(E.TASKS[i].id); if (s === "available" || s === "accepted") return E.TASKS[i]; }
    for (var j = 0; j < E.TASKS.length; j++) { if (E.taskStatus(E.TASKS[j].id) !== "done") return E.TASKS[j]; }
    return E.TASKS[E.TASKS.length - 1];
  }
  function stateLabel(s) {
    return { locked: L({ zh: "未解锁", en: "Locked" }), available: L({ zh: "可领取", en: "Open" }), accepted: L({ zh: "进行中", en: "Active" }), done: L({ zh: "已完成", en: "Done" }) }[s] || s;
  }
  function showTask(tk) {
    var box = document.getElementById("task-detail");
    if (!box) return;
    var st = E.taskStatus(tk.id);
    var html = '<div class="td-card ' + (st === "done" ? "done" : "") + '">' +
      '<div class="td-title">' + L(tk) + "</div>" +
      '<div class="td-brief">' + tk[window.LANG === "en" ? "en_b" : "zh_b"] + "</div>" +
      '<div class="td-row"><span class="td-k" data-i18n="eva_obj">目标</span><span>' + tk[window.LANG === "en" ? "en_o" : "zh_o"] + "</span></div>" +
      '<div class="td-row"><span class="td-k" data-i18n="eva_reward">奖励</span><span>' + tk[window.LANG === "en" ? "en_r" : "zh_r"] + "</span></div>";
    if (st === "locked") html += '<div class="td-lock" data-i18n="eva_locked">完成前置任务后解锁</div>';
    else if (st === "available") html += '<button class="eva-btn" id="tk-accept" data-i18n="eva_accept">接受任务</button>';
    else if (st === "accepted") html += '<button class="eva-btn" id="tk-done" data-i18n="eva_finish">完成任务</button>';
    else html += '<div class="td-done-badge" data-i18n="eva_done_badge">✓ 已完成</div>';
    html += "</div>";
    box.innerHTML = html;
    if (window.t) box.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = window.t(el.getAttribute("data-i18n")); });
    var acc = document.getElementById("tk-accept");
    if (acc) acc.addEventListener("click", function () { E.state.tasks[tk.id] = "accepted"; persist(); renderTasks(); });
    var dn = document.getElementById("tk-done");
    if (dn) dn.addEventListener("click", function () {
      E.state.tasks[tk.id] = "done";
      E.TASKS.forEach(function (t) { if (t.after === tk.id) E.state.tasks[t.id] = "available"; });
      E.state.extraEmails.unshift({ id: "ex_" + tk.id, from: (window.LANG === "en" ? "Execution Bureau" : "执行部"), tag: "mission",
        zh_sub: "任务结算 · " + tk.zh_t, zh_body: "【" + tk.zh_t + "】已归档。" + tk.zh_r,
        en_sub: "Mission Settled · " + tk.en_t, en_body: "[" + tk.en_t + "] archived. " + tk.en_r });
      persist(); renderTasks();
    });
  }
  function persist() { try { localStorage.setItem("dr-eva", JSON.stringify(E.state)); } catch (e) {} }

  /* 学院邮箱 */
  function mL(m, f) { return m[(window.LANG === "en" ? "en_" : "zh_") + f]; }
  function renderMail() {
    var list = document.getElementById("mail-list");
    if (!list) return;
    list.innerHTML = "";
    var all = E.emails();
    all.forEach(function (m) {
      var read = E.emailsRead().indexOf(m.id) >= 0;
      var d = document.createElement("div");
      d.className = "eva-row mail-row" + (read ? " read" : "");
      d.innerHTML = '<div class="eva-row-dot"></div><div class="eva-row-body"><div class="mail-from">' + escapeHtml(m.from) + '</div><div class="eva-row-text">' + escapeHtml(mL(m, "sub")) + "</div></div><div class=\"eva-row-flag\">" + (read ? L({ zh: "已读", en: "READ" }) : L({ zh: "未读", en: "NEW" })) + "</div>";
      d.addEventListener("click", function () { openMail(m); });
      list.appendChild(d);
    });
    var unread = all.length - E.emailsRead().length;
    var mc = document.getElementById("mail-count");
    if (mc) mc.textContent = L({ zh: "收件箱 " + all.length + " 封 · " + unread + " 封未读", en: "Inbox " + all.length + " · " + unread + " unread" });
  }
  function openMail(m) {
    E.markEmail(m.id);
    var box = document.getElementById("mail-read");
    if (!box) return;
    box.classList.remove("hidden");
    box.innerHTML = '<button class="mail-back" id="mail-back" data-i18n="eva_mail_back">← 返回收件箱</button>' +
      '<div class="mail-head"><div class="mail-from-big">' + escapeHtml(m.from) + '</div><div class="mail-subject">' + escapeHtml(mL(m, "sub")) + '</div><div class="mail-tag">' + escapeHtml(m.tag) + "</div></div>" +
      '<div class="mail-body">' + escapeHtml(mL(m, "body")).replace(/\n/g, "<br>") + "</div>";
    if (window.t) box.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = window.t(el.getAttribute("data-i18n")); });
    var back = document.getElementById("mail-back");
    if (back) back.addEventListener("click", function () { box.classList.add("hidden"); renderMail(); });
    renderMail();
  }

  function escapeHtml(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // 初次渲染
  renderNotices();
  renderTasks();
  renderMail();

  // 语言切换时重渲染
  if (window.onLangChange) window.onLangChange(function () { renderNotices(); renderTasks(); renderMail(); });
})();
