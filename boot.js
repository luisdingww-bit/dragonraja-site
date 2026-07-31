/* 龙族 · 进入界面 + 录取登记弹窗 + 账号联动（单页 index.html 专用）
 * 依赖（按 index.html 加载顺序，均在 boot.js 之前就绪）：
 *   i18n.js   -> window.t / window.LANG / window.onLangChange
 *   app.js    -> window.AP（双轨音乐播放器）
 *   eva.js    -> window.EVA（注入 m-admission / m-member 邮件由 account.js 负责）
 *   auth.js   -> window.DR.auth（signUp / signIn / signOut / getSession，本地兜底或 Supabase）
 *   account.js-> window.DR_ACC（init / setUser / config / ensureLoginModal / saveBloodline*）
 *
 * 设计要点：
 *   - 「启程」按钮默认 disabled，仅在登录成功（config.onLogin）后启用；不自动跳过。
 *   - 录取登记：DR.auth.signUp -> signIn -> DR_ACC.setUser -> 生成录取信 -> EmailJS 通知站长。
 *   - 录取信写入 EVA 学院邮箱由 account.js 的 addMemberEmail 负责（setUser 内触发）。
 */
(function () {
  "use strict";
  if (!window.t) return;

  var DR = window.DR || {};
  var ACC = window.DR_ACC;
  if (!ACC) return;

  var boot = document.getElementById("boot");
  var enter = document.getElementById("bootEnter");
  var enrollBtn = document.getElementById("bootEnrollBtn");
  var musicBtn = document.getElementById("bootMusic");
  var letterWrap = document.getElementById("letterWrapper");
  var letterToggle = document.getElementById("letterToggle");

  var modal = document.getElementById("admissionModal");
  var enrollView = document.getElementById("enrollView");
  var loginView = document.getElementById("loginView");
  var letterView = document.getElementById("letterView");
  var admLetter = document.getElementById("admLetter");
  var admReady = document.getElementById("admReady");
  var admClose = document.getElementById("admClose");
  var tabEnroll = document.getElementById("tabEnroll");
  var tabLogin = document.getElementById("tabLogin");
  var toEnroll = document.getElementById("toEnroll");

  var enrollForm = document.getElementById("enrollForm");
  var loginForm = document.getElementById("loginForm");
  var enrollHint = document.getElementById("enrollHint");
  var loginHint = document.getElementById("loginHint");

  /* 录取信折叠样式（index.html 内联样式未含，此处补） */
  var st = document.createElement("style");
  st.textContent = ".boot-letter-wrap.collapsed .boot-letter{max-height:0!important;opacity:0;margin:0;padding-top:0;padding-bottom:0;transition:max-height .4s ease,opacity .35s ease,margin .4s ease,padding .4s ease;}";
  document.head.appendChild(st);

  /* ============ EmailJS 配置（站长录取通知） ============ */
  var EMAILJS = { service: "thisislouis", template: "template_4rdi994", key: "mOzpZGE6NTHWKlCCC", owner: "1543922663@qq.com" };
  function sendAdmissionEmail(m) {
    if (typeof emailjs === "undefined" || !emailjs) return;
    try {
      if (emailjs.init) emailjs.init({ publicKey: EMAILJS.key });
    } catch (e) {}
    try {
      emailjs.send(EMAILJS.service, EMAILJS.template, {
        to_email: EMAILJS.owner,
        from_name: m.name || "",
        from_email: m.email || "",
        age: m.age || "",
        dr_no: m.drNo || "",
        subject: "新生登记 · " + (m.name || ""),
        message: "姓名：" + (m.name || "") + "\n邮箱：" + (m.email || "") + "\n年龄：" + (m.age || "") + "\n档案编号：" + (m.drNo || "")
      }).catch(function () {});
    } catch (e) {}
  }

  /* ============ 录取数据持久化 ============ */
  var AKEY = "dr-admission";
  function loadAdmission() { try { return JSON.parse(localStorage.getItem(AKEY) || "null"); } catch (e) { return null; } }
  function saveAdmission(m) { try { localStorage.setItem(AKEY, JSON.stringify(m)); } catch (e) {} }
  function drNoOf(email) {
    var prev = loadAdmission();
    if (prev && prev.email === email && prev.drNo) return prev.drNo;
    var h = 0;
    for (var i = 0; i < email.length; i++) { h = (h << 5) - h + email.charCodeAt(i); h |= 0; }
    return "DR-" + ("0000" + (Math.abs(h) % 10000)).slice(-4);
  }

  /* ============ 录取信 HTML ============ */
  function buildLetter(m) {
    var isEn = window.LANG === "en";
    var name = m.name || (isEn ? "Cadet" : "学员");
    var prof = (DR.profile && DR.profile.get) ? (DR.profile.get(m.email) || {}) : {};
    var blood = isEn ? (prof.bloodLevelEn || prof.bloodLevel || "") : (prof.bloodLevel || "");
    var spirit = isEn ? (prof.spiritEn || prof.spirit || "") : (prof.spirit || "");
    var bloodLine = blood || (isEn ? "Pending bloodline test" : "待血统鉴定");
    var spiritLine = spirit || (isEn ? "—" : "—");
    var dateStr = new Date(m.genAt || Date.now()).toLocaleDateString(isEn ? "en-US" : "zh-CN");
    if (isEn) {
      return (
        '<div class="adm-date">' + dateStr + "</div>" +
        '<p>Dear <span class="emph">' + esc(name) + "</span>,</p>" +
        '<p>By joint ruling of the Cassell College Admissions Committee and the Bloodline Board, you are formally admitted as a hybrid cadet of this term. The dragon blood within you has passed preliminary awakening — when the college bells toll, proceed to <b>Bloodline Test</b> to register your Spirit.</p>' +
        '<p><span class="emph">The bells toll for you.</span> Step through this gate, and there is no turning back.</p>' +
        '<p style="text-indent:0;margin-top:1.6em">— File No. <b>' + esc(m.drNo || "") + "</b><br>" +
        "— Bloodline: <b>" + esc(bloodLine) + "</b><br>" +
        "— Spirit: <b>" + esc(spiritLine) + "</b><br>" +
        "— Email: <b>" + esc(m.email || "") + "</b></p>"
      );
    }
    return (
      '<div class="adm-date">' + dateStr + "</div>" +
      '<p>致 <span class="emph">' + esc(name) + "：</span></p>" +
      '<p>经卡塞尔学院招生委员会与血统鉴定委员会联合裁定，你已被正式录取为本届混血种学员。你体内的龙血已通过初步觉醒鉴定——请于学院钟声敲响之际，前往「血统鉴定」完成言灵登记。</p>' +
      '<p><span class="emph">钟声将为你敲响。</span>踏入此门，便再无回头。</p>' +
      '<p style="text-indent:0;margin-top:1.6em">— 档案编号：<b>' + esc(m.drNo || "") + "</b><br>" +
      "— 血统等级：<b>" + esc(bloodLine) + "</b><br>" +
      "— 觉醒言灵：<b>" + esc(spiritLine) + "</b><br>" +
      "— 登记邮箱：<b>" + esc(m.email || "") + "</b></p>"
    );
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ============ 进入界面控制 ============ */
  function enableEnter() {
    if (!enter) return;
    enter.disabled = false;
    enter.classList.add("ready");
  }
  function closeBoot() {
    if (!boot) return;
    boot.classList.add("hide");
    setTimeout(function () { boot.style.display = "none"; }, 1100);
  }

  /* ============ 弹窗控制 ============ */
  function openModal() {
    if (!modal) return;
    showEnrollTab();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }
  function showEnrollTab() {
    enrollView.classList.remove("hidden");
    loginView.classList.add("hidden");
    letterView.classList.add("hidden");
    tabEnroll.classList.add("active");
    tabLogin.classList.remove("active");
  }
  function showLoginTab() {
    loginView.classList.remove("hidden");
    enrollView.classList.add("hidden");
    letterView.classList.add("hidden");
    tabLogin.classList.add("active");
    tabEnroll.classList.remove("active");
  }
  function showLetter(m) {
    enrollView.classList.add("hidden");
    loginView.classList.add("hidden");
    letterView.classList.remove("hidden");
    if (admLetter) admLetter.innerHTML = buildLetter(m);
    tabEnroll.classList.remove("active");
    tabLogin.classList.remove("active");
  }

  function setHint(el, txt, isErr) {
    if (!el) return;
    el.textContent = txt;
    el.classList.toggle("err", !!isErr);
  }
  function authErrMsg(err, isEn) {
    var msg = ((err && err.message) || "").toLowerCase();
    if (err && err.code === "exists") return isEn ? "Already registered — please log in" : "该邮箱已登记，请直接登录";
    if (msg.indexOf("already") >= 0) return isEn ? "Already registered — please log in" : "该邮箱已登记，请直接登录";
    if (err && err.code === "notfound" || msg.indexOf("not found") >= 0) return isEn ? "No such account — register first" : "该邮箱未注册，请先登记";
    if (err && err.code === "wrong" || msg.indexOf("wrong") >= 0 || msg.indexOf("invalid") >= 0) return isEn ? "Wrong email or password" : "邮箱或密码错误";
    if (msg.indexOf("email not confirmed") >= 0) return isEn ? "Please confirm your email first" : "请先到邮箱点击确认链接";
    return isEn ? "Something went wrong, please retry" : "操作失败，请重试";
  }

  /* ============ 录取登记提交 ============ */
  if (enrollForm) enrollForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var isEn = window.LANG === "en";
    var name = (document.getElementById("enName").value || "").trim();
    var age = (document.getElementById("enAge").value || "").trim();
    var email = (document.getElementById("enEmail").value || "").trim().toLowerCase();
    var pass = document.getElementById("enPass").value || "";
    if (!name || !email || !pass) {
      setHint(enrollHint, isEn ? "Name, email and password are required" : "请填写姓名、邮箱与密码", true);
      return;
    }
    if (pass.length < 6) {
      setHint(enrollHint, isEn ? "Password must be at least 6 characters" : "密码至少 6 位", true);
      return;
    }
    setHint(enrollHint, isEn ? "Registering…" : "登记中…", false);

    if (!DR.auth || !DR.auth.signUp) { setHint(enrollHint, isEn ? "Auth module not loaded" : "认证模块未加载", true); return; }

    try {
      var r = await DR.auth.signUp({ email: email, password: pass, name: name, age: age });
      var s = await DR.auth.signIn({ email: email, password: pass });
      var user = (s && s.user) || (r && r.user);
      if (user && ACC.setUser) ACC.setUser(user);
      var drNo = drNoOf(email);
      var m = { name: name, email: email, age: age, drNo: drNo, genAt: Date.now() };
      saveAdmission(m);
      showLetter(m);
      sendAdmissionEmail(m);
      enableEnter();
    } catch (err) {
      setHint(enrollHint, authErrMsg(err, isEn), true);
    }
  });

  /* ============ 登录提交 ============ */
  if (loginForm) loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var isEn = window.LANG === "en";
    var email = (document.getElementById("lgEmail").value || "").trim().toLowerCase();
    var pass = document.getElementById("lgPass").value || "";
    if (!email || !pass) { setHint(loginHint, isEn ? "Enter email and password" : "请输入邮箱与密码", true); return; }
    setHint(loginHint, isEn ? "Signing in…" : "登录中…", false);

    if (!DR.auth || !DR.auth.signIn) { setHint(loginHint, isEn ? "Auth module not loaded" : "认证模块未加载", true); return; }

    try {
      var s = await DR.auth.signIn({ email: email, password: pass });
      var user = s && s.user;
      if (user && ACC.setUser) ACC.setUser(user);
      closeModal();
      enableEnter();
    } catch (err) {
      setHint(loginHint, authErrMsg(err, isEn), true);
    }
  });

  /* ============ 事件绑定 ============ */
  if (enrollBtn) enrollBtn.addEventListener("click", openModal);
  if (admClose) admClose.addEventListener("click", closeModal);
  if (tabEnroll) tabEnroll.addEventListener("click", showEnrollTab);
  if (tabLogin) tabLogin.addEventListener("click", showLoginTab);
  if (toEnroll) toEnroll.addEventListener("click", function (e) { e.preventDefault(); showEnrollTab(); });
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  if (admReady) admReady.addEventListener("click", closeModal);
  if (enter) enter.addEventListener("click", closeBoot);
  if (musicBtn) musicBtn.addEventListener("click", function () { if (window.AP && window.AP.toggle) window.AP.toggle(); });
  if (letterToggle && letterWrap) letterToggle.addEventListener("click", function () {
    letterWrap.classList.toggle("collapsed");
    letterToggle.setAttribute("aria-expanded", String(!letterWrap.classList.contains("collapsed")));
  });

  /* ============ 语言切换：重建录取信 ============ */
  if (window.onLangChange) window.onLangChange(function () {
    var prev = loadAdmission();
    if (prev && letterView && !letterView.classList.contains("hidden") && admLetter) {
      admLetter.innerHTML = buildLetter(prev);
    }
  });

  /* ============ 账号初始化 ============ */
  ACC.config.openLogin = openModal;
  ACC.config.onLogin = function () { enableEnter(); };
  ACC.init({ injectLoginModal: true });
})();
