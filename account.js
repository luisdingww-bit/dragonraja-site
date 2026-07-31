/* 龙族 · 混血种档案 · 账号界面与档案联动（所有页面共用）
 * 职责：
 *  - 在导航栏渲染「欢迎，{姓名} · 血统徽章 · 退出」或「登录」按钮；
 *  - 会话恢复、登出；
 *  - 把血统鉴定结果写回账号档案，并广播事件给 EVA 终端；
 *  - 为非首页（如 EVA 终端页）注入轻量登录弹窗；
 *  - 统一的 toast 提示。
 * 依赖：auth.js（window.DR.auth / window.DR.profile）与 i18n.js（window.t / window.LANG）。
 */
(function () {
  "use strict";
  if (!window.DR) window.DR = {};
  var DR = window.DR;
  var t = window.t || function (k) { return k; };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '"' }[c];
    });
  }
  function fire(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {}
  }

  /* ============ 配置（由各页面在 init 前设置） ============ */
  var config = {
    openLogin: null,   // function() 打开登录入口（首页用录取弹窗，其他页用注入弹窗）
    onLogin: null,     // function(user) 登录成功回调（首页用于启用「启程」）
    injectLoginModal: false
  };

  /* ============ 状态 ============ */
  var CURRENT = null;     // {email,name,age,profile}
  var pending = null;     // 需登录后执行的回调
  var LOGIN_MODAL_READY = false;

  /* ============ 渲染 ============ */
  function renderArea(el) {
    if (!el) return;
    var isEn = window.LANG === "en";
    if (!CURRENT) {
      el.innerHTML = '<button class="acc-login" type="button">' + esc(t("acc_login")) + "</button>";
      var lb = el.querySelector(".acc-login");
      if (lb) lb.onclick = function () { if (config.openLogin) config.openLogin(); else toast(t("ritual_needlogin")); };
      return;
    }
    var name = CURRENT.name || (isEn ? "Cadet" : "学员");
    var prof = CURRENT.profile || {};
    var badge = "";
    if (prof.bloodLevel) {
      var lv = isEn ? (prof.bloodLevelEn || prof.bloodLevel) : prof.bloodLevel;
      badge = '<span class="acc-badge" title="' + esc(isEn ? "Bloodline" : "血统等级") + '">' + esc(lv) + "</span>";
    }
    el.innerHTML =
      '<span class="acc-name">' + esc(t("acc_welcome")) + esc(name) + "</span>" +
      badge +
      '<button class="acc-out" type="button">' + esc(t("acc_logout")) + "</button>";
    var ob = el.querySelector(".acc-out");
    if (ob) ob.onclick = logout;
  }

  function renderProfileBox() {
    var box = document.getElementById("accProfileBox");
    if (!box) return;
    var isEn = window.LANG === "en";
    if (!CURRENT) {
      box.className = "acc-profile-box guest";
      box.innerHTML =
        '<div class="apb-card">' +
          '<div class="apb-icon">❖</div>' +
          '<div class="apb-title">' + esc(t("eva_profile_title")) + "</div>" +
          '<div class="apb-cta">' + esc(t("eva_login_cta")) + "</div>" +
          '<button class="apb-login" type="button">' + esc(t("acc_login")) + "</button>" +
        "</div>";
      var lb = box.querySelector(".apb-login");
      if (lb) lb.onclick = function () { if (config.openLogin) config.openLogin(); };
      return;
    }
    var prof = CURRENT.profile || {};
    var rows = "";
    rows += row(t("eva_profile_name"), esc(CURRENT.name));
    if (prof.bloodLevel) {
      rows += row(t("eva_profile_blood"), esc(isEn ? (prof.bloodLevelEn || prof.bloodLevel) : prof.bloodLevel));
    } else {
      rows += row(t("eva_profile_blood"), '<span class="dim">' + esc(t("eva_profile_notest")) + "</span>");
    }
    if (prof.spirit) {
      rows += row(t("eva_profile_spirit"), esc(isEn ? (prof.spiritEn || prof.spirit) : prof.spirit));
    }
    box.className = "acc-profile-box member";
    box.innerHTML =
      '<div class="apb-card">' +
        '<div class="apb-head">' +
          '<span class="apb-crest"><img src="img/cassell-seal-round.png" alt="Cassell"></span>' +
          '<div class="apb-id"><div class="apb-title">' + esc(t("eva_profile_title")) + "</div>" +
          '<div class="apb-name">' + esc(CURRENT.name) + "</div></div>" +
          '<button class="acc-out" type="button">' + esc(t("acc_logout")) + "</button>" +
        "</div>" + rows +
      "</div>";
    var ob = box.querySelector(".acc-out");
    if (ob) ob.onclick = logout;
  }
  function row(k, v) {
    return '<div class="apb-row"><span class="apb-k">' + esc(k) + '</span><span class="apb-v">' + v + "</span></div>";
  }

  function renderAll() {
    document.querySelectorAll(".account-area").forEach(renderArea);
    renderProfileBox();
  }

  /* ============ 账号邮件（写入 EVA 共享的 dr-eva，跨页持久） ============ */
  function evaAddEmail(m) {
    try {
      var KEY = "dr-eva";
      var st = JSON.parse(localStorage.getItem(KEY) || "{}");
      st.extraEmails = st.extraEmails || [];
      if (!st.extraEmails.some(function (x) { return x.id === m.id; })) {
        st.extraEmails.unshift(m);
        localStorage.setItem(KEY, JSON.stringify(st));
      }
    } catch (e) {}
  }
  function addMemberEmail(name, email) {
    evaAddEmail({
      id: "m-member", from: "卡塞尔学院 · 学院终端", tag: "学员",
      zh_sub: "欢迎回到卡塞尔学院",
      zh_body: "亲爱的 " + name + "：欢迎回到卡塞尔学院学员系统。你的学员档案已与录取登记绑定，可随时在「EVA 终端 → 学院邮箱」查收任务与通知，血统鉴定进度也已为你保留。",
      en_sub: "Welcome back to Cassell",
      en_body: "Dear " + name + ": welcome back to the Cassell student system. Your profile is linked to your admission. Open EVA Terminal → Academy Inbox for missions and notices; your bloodline progress is saved."
    });
  }
  function addBloodlineEmail(name, email, level, spirit) {
    evaAddEmail({
      id: "m-bloodline", from: "曼施坦因教授 · 血统鉴定科", tag: "report",
      zh_sub: "你的血统鉴定报告",
      zh_body: "亲爱的 " + name + "：经卡塞尔学院血统鉴定委员会裁定，你的血统等级为「" + level + "」" + (spirit ? "，觉醒言灵「" + spirit + "」" : "") + "。该结果已记入你的学员档案。言灵序列的稳定性仍需持续监测——请安心，你已踏入真正的混血种之列。",
      en_sub: "Your Bloodline Report",
      en_body: "Dear " + name + ": by ruling of the Cassell Bloodline Committee, your level is '" + level + "'" + (spirit ? ", with awakened spirit '" + spirit + "'" : "") + ". It has been recorded to your cadet file. Continuous monitoring of your spirit's stability is advised — rest assured, you now walk among true hybrids."
    });
  }

  /* ============ 登录 / 登出 ============ */
  function setUser(user) {
    if (!user) return;
    var meta = user.user_metadata || {};
    var email = (user.email || meta.email || "").trim().toLowerCase();
    var name = (meta.name || user.name || email || "").trim();
    var age = meta.age || user.age || "";
    if (!email) return;
    if (!name) name = email.split("@")[0];
    var prof = DR.profile.get(email) || {};
    prof.email = email; prof.name = name; if (age) prof.age = age;
    DR.profile.set(prof);
    CURRENT = { email: email, name: name, age: age, profile: prof };
    renderAll();
    fire("acc:login", CURRENT);
    if (config.onLogin) { try { config.onLogin(CURRENT); } catch (e) {} }
    addMemberEmail(name, email);
    // 若此前已做过血统鉴定，补齐「新生登记」任务
    if (prof.bloodLevel && window.EVA) window.EVA.completeTask("t0");
    // 登录后执行待定回调（如：被拦截的血统检测）
    if (pending) { var p = pending; pending = null; try { p(CURRENT); } catch (e) {} }
  }

  function logout() {
    if (DR.auth && DR.auth.signOut) { try { DR.auth.signOut(); } catch (e) {} }
    CURRENT = null;
    renderAll();
    fire("acc:logout");
  }

  function requireLogin(cb) {
    if (CURRENT) { try { cb(CURRENT); } catch (e) {} return; }
    pending = cb;
    if (config.openLogin) config.openLogin();
    else toast(t("ritual_needlogin"));
  }

  /* ============ 血统鉴定 → 档案 ============ */
  function saveBloodlineLevel(bloodLevel, bloodLevelEn) {
    if (!CURRENT) return false;
    DR.profile.saveBloodline(CURRENT.email, { bloodLevel: bloodLevel, bloodLevelEn: bloodLevelEn });
    CURRENT.profile = DR.profile.get(CURRENT.email);
    renderAll();
    fire("acc:bloodline", { level: bloodLevel, levelEn: bloodLevelEn, spirit: null });
    if (window.EVA) window.EVA.completeTask("t0");
    addBloodlineEmail(CURRENT.name, CURRENT.email, bloodLevel, null);
    return true;
  }
  function saveBloodlineSpirit(spiritObj, spiritEn, spiritSeq) {
    if (!CURRENT) return false;
    var sName = spiritObj && spiritObj.name;
    var sEn = spiritEn || (spiritObj && spiritObj.name_en);
    DR.profile.saveBloodline(CURRENT.email, { spirit: sName, spiritEn: sEn, spiritSeq: spiritSeq });
    CURRENT.profile = DR.profile.get(CURRENT.email);
    renderAll();
    fire("acc:bloodline", { level: CURRENT.profile.bloodLevel, levelEn: CURRENT.profile.bloodLevelEn, spirit: sName, spiritEn: sEn });
    return true;
  }

  /* ============ 轻量登录弹窗（非首页注入） ============ */
  function ensureLoginModal() {
    if (LOGIN_MODAL_READY) { openLoginModal(); return; }
    var style = document.createElement("style");
    style.textContent =
      ".acc-modal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.82);backdrop-filter:blur(4px);}" +
      ".acc-modal.show{display:flex;}" +
      ".acc-sheet{width:min(420px,92vw);background:linear-gradient(180deg,#fbf6e8,#f3e9d0);color:#2b2118;border:8px double #bfa36f;padding:30px 26px;text-align:center;border-radius:2px;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.55);}" +
      ".acc-close{position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;color:#7a6046;cursor:pointer;line-height:1;}" +
      ".acc-close:hover{color:#3e2f22;}" +
      ".acc-crest{width:64px;height:64px;margin:0 auto 8px;border-radius:50%;box-shadow:0 0 0 2px #bfa36f;}" +
      ".acc-crest img{width:100%;height:100%;border-radius:50%;}" +
      ".acc-title{font-family:var(--serif);letter-spacing:.3em;color:#3e2f22;font-weight:700;margin-bottom:16px;}" +
      ".acc-form{display:flex;flex-direction:column;gap:12px;}" +
      ".acc-form input{background:rgba(255,255,255,.7);border:1px solid #c9b48a;color:#3e2f22;font-family:var(--serif);font-size:14px;padding:12px 14px;border-radius:2px;outline:none;}" +
      ".acc-form input:focus{border-color:#8c6f3f;box-shadow:0 0 12px rgba(140,111,63,.25);}" +
      ".acc-hint{color:#7a6046;font-size:11px;font-family:var(--serif);letter-spacing:.1em;min-height:14px;}" +
      ".acc-hint.err{color:#b33939;}" +
      ".acc-submit{background:#3e2f22;color:#fbf6e8;border:none;padding:13px 28px;font-family:var(--serif);letter-spacing:.2em;cursor:pointer;border-radius:2px;transition:.3s;}" +
      ".acc-submit:hover{background:#5a4431;}" +
      ".acc-foot{margin-top:14px;font-family:var(--serif);font-size:12px;}" +
      ".acc-foot a{color:#8c6f3f;text-decoration:none;border-bottom:1px dashed rgba(140,111,63,.5);}";
    document.head.appendChild(style);

    var modal = document.createElement("div");
    modal.id = "accLoginModal";
    modal.className = "acc-modal";
    modal.innerHTML =
      '<div class="acc-sheet">' +
        '<button class="acc-close" type="button" aria-label="close">×</button>' +
        '<div class="acc-crest"><img src="img/cassell-seal-round.png" alt="Cassell College"></div>' +
        '<div class="acc-title">' + esc(t("login_title")) + "</div>" +
        '<form class="acc-form" id="accLoginForm" autocomplete="off" novalidate>' +
          '<input id="accLgEmail" type="email" placeholder="' + esc(t("ph_email")) + '" maxlength="80">' +
          '<input id="accLgPass" type="password" placeholder="' + esc(t("ph_password")) + '" maxlength="64">' +
          '<div class="acc-hint" id="accLgHint">' + esc(t("login_hint")) + "</div>" +
          '<button class="acc-submit" type="submit">' + esc(t("boot_login_btn")) + "</button>" +
        "</form>" +
        '<div class="acc-foot"><a href="index.html#ritual" id="accToEnroll">' + esc(t("login_to_enroll")) + "</a></div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) { if (e.target === modal) closeLoginModal(); });
    modal.querySelector(".acc-close").addEventListener("click", closeLoginModal);
    modal.querySelector("#accLoginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (document.getElementById("accLgEmail").value || "").trim();
      var pass = document.getElementById("accLgPass").value || "";
      var hint = document.getElementById("accLgHint");
      if (!email || !pass) { hint.textContent = t("login_hint"); hint.classList.add("err"); return; }
      hint.classList.remove("err"); hint.textContent = t("login_hint");
      if (!(DR.auth && DR.auth.signIn)) { hint.textContent = "认证模块未加载"; hint.classList.add("err"); return; }
      DR.auth.signIn({ email: email, password: pass }).then(function (r) {
        var user = r && r.user;
        closeLoginModal();
        setUser(user);
      }).catch(function (err) {
        var msg = ((err && err.message) || "").toLowerCase();
        var txt = window.LANG === "en" ? "Login failed, please retry" : "登录失败，请重试";
        if (msg.indexOf("wrong") >= 0 || msg.indexOf("invalid") >= 0) txt = window.LANG === "en" ? "Wrong email or password" : "邮箱或密码错误";
        else if (msg.indexOf("notfound") >= 0) txt = window.LANG === "en" ? "No such account, please register" : "该邮箱未注册，请先登记";
        else if (msg.indexOf("email not confirmed") >= 0) txt = window.LANG === "en" ? "Please confirm your email first" : "请先到邮箱点击确认链接";
        hint.textContent = txt; hint.classList.add("err");
      });
    });

    LOGIN_MODAL_READY = true;
    openLoginModal();
  }
  function openLoginModal() {
    var m = document.getElementById("accLoginModal");
    if (m) { m.classList.add("show"); m.setAttribute("aria-hidden", "false"); }
  }
  function closeLoginModal() {
    var m = document.getElementById("accLoginModal");
    if (m) { m.classList.remove("show"); m.setAttribute("aria-hidden", "true"); }
  }

  /* ============ Toast ============ */
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById("accToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "accToast";
      el.className = "acc-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
  }

  /* ============ 初始化 ============ */
  function init(opts) {
    if (opts) {
      if (opts.openLogin !== undefined) config.openLogin = opts.openLogin;
      if (opts.onLogin !== undefined) config.onLogin = opts.onLogin;
      if (opts.injectLoginModal) config.injectLoginModal = true;
    }
    // 先按本地缓存渲染（避免闪烁）
    renderAll();
    // 再尝试恢复云端/本地会话
    if (DR.auth && DR.auth.getSession) {
      DR.auth.getSession().then(function (s) {
        if (s && s.user) setUser(s.user);
        else renderAll();
      }).catch(function () { renderAll(); });
    } else {
      renderAll();
    }
    if (window.onLangChange) window.onLangChange(function () { renderAll(); });
  }

  window.DR_ACC = {
    init: init,
    setUser: setUser,
    logout: logout,
    requireLogin: requireLogin,
    current: function () { return CURRENT; },
    config: config,
    ensureLoginModal: ensureLoginModal,
    saveBloodlineLevel: saveBloodlineLevel,
    saveBloodlineSpirit: saveBloodlineSpirit,
    toast: toast
  };
})();
