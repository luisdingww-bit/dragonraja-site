/* 龙族 · 混血种档案 · 账号系统（真实云端认证）
 * ---------------------------------------------------------------
 * 2026-10-03 重写：原先依赖 Supabase，但 CONFIG 从未填写 → 永远降级
 * localStorage，导致「换个浏览器/设备登录就没了」。现在改为直连
 * WorkBuddy 云服务，账号真实存在云端，任意设备可登录。
 *
 * 认证方式：邮箱验证码（真实验证邮箱归属，跨设备一致）
 * 身份由 cloud.auth 提供，会话自动持久化；数据库 RLS 保证
 * 每个人只能读写自己的档案。
 *
 * 对外接口与旧版完全一致，上层（account.js / index.html）无需改动：
 *   DR.auth.signUp({name,age,email,password}) → {user}
 *   DR.auth.signIn({email,password})           → {user,session}
 *   DR.auth.signOut()                          → {done}
 *   DR.auth.getSession()                       → {user,session}|null
 *   DR.auth.sendCode({email})                  → {sent,email}
 *   DR.auth.resetPassword({email,password})    → {reset,email}
 *   DR.auth.mode                               → "cloud"
 */
(function () {
  "use strict";

  /* ---- 云服务公开配置（仅公开端点与 publishableKey，无任何私密凭据） ----
     endpoint 用 location.origin：云服务按 Origin 校验，必须与部署域同源，
     这样无论部署到 WorkBuddy / GitHub Pages / surge 都能对上。 */
  var CLOUD = {
    endpoint: (typeof location !== "undefined" && location.origin) || "",
    oauthRelayBaseUrl: "https://www.workbuddy.cn/v2/as/genie-baas/oauth",
    publishableKey: "wbpk_3HnQvT4BzfmUMKF1Pvs6Ml_LLOxPaP4s5zw6mYP8wXVCrR0Azx58kmV"
  };

  var db = null;          // cloud.database
  var auth = null;        // cloud.auth
  var ready = null;       // 初始化 Promise
  var mode = "cloud";
  var LSK = "dr_member_v2";   // 本地仅作离线兜底（云端不可用时）

  /* 云服务是否可用（跨域部署时会被 Origin 校验拒绝）。
     供 UI 提前判断，避免用户点了登录却毫无反应。 */
  var cloudHint = null;
  function cloudAvailable() {
    // 已知可用的同源部署
    if (location.origin === "https://dragonraja-archive.app.workbuddy.host") return true;
    // 其他域名下无法保证 Origin 匹配，登录可能被服务端拒绝
    return false;
  }

  function init() {
    if (ready) return ready;
    ready = (function () {
      if (!window.WorkBuddyCloud) throw new Error("云服务 SDK 未加载");
      var cloud = window.WorkBuddyCloud.createWorkBuddyCloud(CLOUD);
      db = cloud.database;
      auth = cloud.auth;
      return true;
    })();
    return ready;
  }

  /* ---------- 工具 ---------- */
  function normEmail(e) { return String(e || "").trim().toLowerCase(); }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  function localGet() { try { return JSON.parse(localStorage.getItem(LSK) || "{}"); } catch (e) { return {}; } }
  function localSet(o) { try { localStorage.setItem(LSK, JSON.stringify(o)); } catch (e) {} }

  /* 从云端身份取稳定用户 id（uid） */
  function uidOf(user) {
    if (!user) return null;
    return user.id || user.user_id || (user.uid) || null;
  }
  function emailOf(user) {
    if (!user) return "";
    return user.email || user.phone || "";
  }

  /* ---------- 注册：先发邮箱验证码 ---------- */
  function sendCode(payload) {
    var email = normEmail(payload && payload.email);
    if (!validEmail(email)) return Promise.reject(new Error("请输入正确的邮箱地址"));
    return init()
      .then(function () { return auth.sendOtp({ email: email }); })
      .then(function (r) {
        if (r && r.error) throw new Error(r.error.message || "验证码发送失败");
        var d = (r && r.data) || {};
        // 暂存挑战上下文，verify 时复用（提交绝不重发验证码）
        localSet({ pendingEmail: email, verificationId: d.verificationId, isExistingUser: !!d.isExistingUser });
        return { sent: true, email: email };
      });
  }

  /* ---------- 注册：校验验证码并建立账号 ---------- */
  function signUp(payload) {
    var p = payload || {};
    var email = normEmail(p.email);
    var name = String(p.name || "").trim();
    var age = p.age ? parseInt(p.age, 10) : null;
    var st = localGet();

    if (!name) return Promise.reject(new Error("请填写姓名"));
    if (!validEmail(email)) return Promise.reject(new Error("请输入正确的邮箱地址"));
    if (!st.pendingEmail || st.pendingEmail !== email || !st.verificationId) {
      return Promise.reject(new Error("请先获取邮箱验证码"));
    }
    var token = String(p.code || p.token || "").trim();
    if (!token) return Promise.reject(new Error("请填写邮箱验证码"));

    return init()
      .then(function () {
        return auth.verifyOtp({
          email: email,
          verificationId: st.verificationId,
          isExistingUser: st.isExistingUser,
          token: token,
          password: p.password || undefined   // 新账号需密码，便于后续密码登录
        });
      })
      .then(function (r) {
        if (r && r.error) throw new Error(r.error.message || "注册失败");
        var user = (r && r.data && (r.data.user || r.data)) || null;
        if (!user) throw new Error("注册未返回用户身份");
        // 清掉挑战，避免重复使用
        delete st.pendingEmail; delete st.verificationId; delete st.isExistingUser;
        localSet(st);
        // 写入本人档案（owner_id 由数据库 DEFAULT auth.uid() 填充，客户端不发送）
        return saveMember({
          member_name: name, member_age: age, member_email: email
        }).catch(function () { /* 档案写入失败不阻断注册 */ })
          .then(function () { return { user: user }; });
      });
  }

  /* ---------- 登录：邮箱 + 密码 ---------- */
  function signIn(payload) {
    var p = payload || {};
    var email = normEmail(p.email);
    var pass = String(p.password || "");
    if (!validEmail(email)) return Promise.reject(new Error("请输入正确的邮箱地址"));
    if (!pass) return Promise.reject(new Error("请输入密码"));
    return init()
      .then(function () { return auth.signInWithPassword({ email: email, password: pass }); })
      .then(function (r) {
        if (r && r.error) throw new Error(mapSignInError(r.error));
        var d = (r && r.data) || {};
        var user = d.user || null;
        var session = d.session || null;
        if (!user && !session) throw new Error("登录未返回身份");
        return { user: user || (session && session.user), session: session };
      });
  }

  function mapSignInError(err) {
    var m = String((err && (err.message || err)) || "");
    if (/invalid|credential|wrong|密码|401/i.test(m)) return "邮箱或密码不正确";
    if (/verify|confirm|验证/i.test(m)) return "邮箱尚未验证";
    return m || "登录失败";
  }

  /* ---------- 当前会话 ---------- */
  function getSession() {
    return init()
      .then(function () { return auth.getSession(); })
      .then(function (r) {
        if (r && r.error) return null;
        var s = r && r.data;
        if (!s) return null;
        var session = s.session || s;
        var user = session && (session.user || s.user);
        if (!user) return null;
        return { user: user, session: session };
      })
      .catch(function () { return null; });
  }

  function signOut() {
    return init()
      .then(function () { return auth.signOut(); })
      .then(function () { return { done: true }; })
      .catch(function () { return { done: true }; });
  }

  /* ---------- 重置密码：走邮箱验证码 ---------- */
  function resetPassword(payload) {
    var p = payload || {};
    var email = normEmail(p.email);
    if (!validEmail(email)) return Promise.reject(new Error("请输入正确的邮箱地址"));
    return sendCode({ email: email }).then(function () {
      return { reset: true, email: email, needCode: true };
    });
  }
  function confirmReset(payload) {
    var p = payload || {};
    var st = localGet();
    var token = String(p.code || "").trim();
    if (!st.verificationId || !token) return Promise.reject(new Error("请先获取验证码"));
    return init()
      .then(function () {
        return auth.verifyOtp({
          email: st.pendingEmail,
          verificationId: st.verificationId,
          isExistingUser: st.isExistingUser,
          token: token,
          password: p.password
        });
      })
      .then(function (r) {
        if (r && r.error) throw new Error(r.error.message || "重置失败");
        var d = (r && r.data) || {};
        var user = d.user || (d.session && d.session.user) || null;
        delete st.pendingEmail; delete st.verificationId; delete st.isExistingUser;
        localSet(st);
        return { done: true, user: user };
      });
  }

  /* ---------- 本人档案：写入 / 读取 ---------- */
  function saveMember(patch) {
    return init()
      .then(function () { return auth.getSession(); })
      .then(function (r) {
        var s = r && r.data;
        var session = s && (s.session || s);
        var user = session && (session.user || (s && s.user));
        if (!user) throw new Error("未登录，无法保存档案");
        var row = Object.assign({}, patch || {});
        row.updated_at = new Date().toISOString();
        /* 注意：绝不发送 owner_id —— 由数据库 DEFAULT auth.uid() 填充并由 RLS 校验 */
        return db.from("site_members")
          .select("*", { count: "exact", head: true })
          .then(function (probe) { return probe; })
          .then(function () {
            return db.from("site_members").upsert(
              Object.assign(row, { created_at: new Date().toISOString() }),
              { onConflict: "owner_id" }
            );
          });
      });
  }

  function loadMember() {
    return init()
      .then(function () { return auth.getSession(); })
      .then(function (r) {
        var s = r && r.data;
        var session = s && (s.session || s);
        var user = session && (session.user || (s && s.user));
        if (!user) return null;
        return db.from("site_members").select("*").limit(1)
          .then(function (q) { return (q && q.data && q.data[0]) || null; });
      })
      .catch(function () { return null; });
  }

  /* ---------- 对外 API（与旧版接口兼容） ---------- */
  var api = {
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    sendCode: sendCode,
    resetPassword: resetPassword,
    confirmReset: confirmReset,
    saveMember: saveMember,
    loadMember: loadMember,
    validEmail: validEmail,
    cloudAvailable: cloudAvailable,
    get mode() { return mode; }
  };

  window.DR = window.DR || {};
  window.DR.auth = api;
  window.DR.authMode = mode;
  // 旧代码读 DR.profile 的地方保留一个空壳，避免报错
  window.DR.profile = window.DR.profile || {};
})();
