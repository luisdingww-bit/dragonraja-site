/* 龙族 · 混血种档案 · 账号系统 (Supabase 真账号 / localStorage 兜底)
 * ---------------------------------------------------------------
 * 双模式：
 *   1) Supabase 模式（推荐）：在 CONFIG 填入项目 URL 与 anon key 后，
 *      注册即真实云端账号（邮箱+密码），可在任意设备登录，会话持久化。
 *   2) 本地兜底模式：未填 CONFIG 时，账号存浏览器 localStorage，仅当前
 *      浏览器/设备可用（粉丝站体验用，非真正安全）。
 *
 * 如何开启 Supabase 真账号：
 *   1. 打开 https://supabase.com 免费注册并新建一个项目。
 *   2. 左侧 Authentication → Providers 确保 Email 已开启。
 *   3. Project Settings → API 复制 Project URL 与 anon public key。
 *   4. 粘贴到下方 CONFIG.url / CONFIG.key 即可。
 *   （免费额度：5 万月活用户 / 500MB 数据库，个人站足够）
 */
(function () {
  "use strict";

  /* ↓↓↓ 在这里粘贴你的 Supabase 凭据 ↓↓↓ */
  var CONFIG = {
    url: "",   // 例如 https://xxxx.supabase.co
    key: ""    // 例如 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  };
  /* ↑↑↑ 在这里粘贴你的 Supabase 凭据 ↑↑↑ */

  var sb = null;
  var mode = "local";
  if (CONFIG.url && CONFIG.key && window.supabase && window.supabase.createClient) {
    try {
      sb = window.supabase.createClient(CONFIG.url, CONFIG.key);
      mode = "supabase";
    } catch (e) {
      mode = "local";
    }
  }

  /* 简易密码哈希（仅本地兜底模式使用，安全上下文优先用 SubtleCrypto） */
  function sha256(str) {
    if (window.crypto && window.crypto.subtle) {
      return window.crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(str))
        .then(function (buf) {
          return Array.prototype.map
            .call(new Uint8Array(buf), function (x) {
              return ("00" + x.toString(16)).slice(-2);
            })
            .join("");
        })
        .catch(function () {
          return fallbackHash(str);
        });
    }
    return Promise.resolve(fallbackHash(str));
  }
  function fallbackHash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return "d" + (h >>> 0).toString(16);
  }

  var ACC_KEY = "dr_accounts";
  var SESSION_KEY = "dr_session";
  function getAccounts() {
    try { return JSON.parse(localStorage.getItem(ACC_KEY) || "[]"); } catch (e) { return []; }
  }
  function setAccounts(a) { localStorage.setItem(ACC_KEY, JSON.stringify(a)); }

  var api = {
    mode: mode,
    isConfigured: mode === "supabase",

    signUp: function (payload) {
      var name = (payload.name || "").trim();
      var age = (payload.age || "").toString().trim();
      var email = (payload.email || "").trim();
      var password = payload.password || "";
      if (mode === "supabase") {
        return sb.auth
          .signUp({
            email: email,
            password: password,
            options: { data: { name: name, age: age } }
          })
          .then(function (res) {
            if (res.error) throw res.error;
            return { user: res.data.user, session: res.data.session };
          });
      }
      // 本地兜底
      var accounts = getAccounts();
      email = email.toLowerCase();
      if (accounts.some(function (a) { return String(a.email).toLowerCase() === email; })) {
        var ex = new Error("already registered");
        ex.code = "exists";
        throw ex;
      }
      return sha256(password).then(function (passHash) {
        accounts.push({ name: name, age: age, email: email, passHash: passHash, ts: Date.now() });
        setAccounts(accounts);
        var sess = { email: email, name: name, age: age };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        return {
          user: { email: email, user_metadata: { name: name, age: age } },
          session: { user: { email: email, user_metadata: { name: name, age: age } } }
        };
      });
    },

    signIn: function (payload) {
      var email = (payload.email || "").trim();
      var password = payload.password || "";
      if (mode === "supabase") {
        return sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
          if (res.error) throw res.error;
          return { user: res.data.user, session: res.data.session };
        });
      }
      var accounts = getAccounts();
      email = email.toLowerCase();
      var a = accounts.find(function (x) { return String(x.email).toLowerCase() === email; });
      if (!a) {
        var nf = new Error("not found");
        nf.code = "notfound";
        throw nf;
      }
      return sha256(password).then(function (passHash) {
        if (passHash !== a.passHash) {
          // 容错：用户可能误输入首尾空格（例如输入法/自动补全），尝试去掉首尾空格后比对
          return sha256(password.trim()).then(function (trimHash) {
            if (trimHash !== a.passHash) {
              var wr = new Error("wrong password");
              wr.code = "wrong";
              throw wr;
            }
            // 命中容错 → 把存储哈希迁移为去空格版本，下次直接通过
            a.passHash = trimHash;
            setAccounts(accounts);
            var sess = { email: email, name: a.name, age: a.age };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
            return {
              user: { email: email, user_metadata: { name: a.name, age: a.age } },
              session: { user: { email: email, user_metadata: { name: a.name, age: a.age } } }
            };
          });
        }
        var sess = { email: email, name: a.name, age: a.age };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        return {
          user: { email: email, user_metadata: { name: a.name, age: a.age } },
          session: { user: { email: email, user_metadata: { name: a.name, age: a.age } } }
        };
      });
    },

    signOut: function () {
      if (mode === "supabase") {
        return sb.auth.signOut().catch(function () {});
      }
      localStorage.removeItem(SESSION_KEY);
      return Promise.resolve();
    },

    getSession: function () {
      if (mode === "supabase") {
        return sb.auth.getSession().then(function (res) {
          return res.data && res.data.session ? res.data.session : null;
        });
      }
      try { return Promise.resolve(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); }
      catch (e) { return Promise.resolve(null); }
    },

    /* 找回密码
     * - Supabase 模式：发送重置邮件（redirectTo 指向 recover.html 处理新密码）
     * - 本地演示模式：用「邮箱 + 注册姓名 + 注册年龄」验证身份后直接重置
     */
    resetPassword: function (payload) {
      var email = (payload.email || "").trim().toLowerCase();
      if (mode === "supabase") {
        var path = window.location.pathname || "/";
        var base = window.location.origin + path.slice(0, path.lastIndexOf("/") + 1);
        return sb.auth
          .resetPasswordForEmail(email, { redirectTo: base + "recover.html" })
          .then(function (res) {
            if (res.error) throw res.error;
            return { sent: true, email: email };
          });
      }
      var accounts = getAccounts();
      var a = accounts.find(function (x) { return String(x.email).toLowerCase() === email; });
      if (!a) {
        var nf = new Error("not found");
        nf.code = "notfound";
        throw nf;
      }
      var name = String(payload.name || "").trim();
      var age = String(payload.age || "").trim();
      if (String(a.name || "").toLowerCase() !== name.toLowerCase() || String(a.age || "") !== age) {
        var mm = new Error("info mismatch");
        mm.code = "mismatch";
        throw mm;
      }
      var pass = String(payload.password || "");
      if (pass.length < 6) {
        var sh = new Error("password too short");
        sh.code = "short";
        throw sh;
      }
      return sha256(pass).then(function (h) {
        a.passHash = h;
        setAccounts(accounts);
        try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
        return { reset: true, email: a.email };
      });
    },

    /* 通过 Supabase 重置邮件链接到达 recover.html 后设置新密码 */
    updatePassword: function (payload) {
      if (mode !== "supabase" || !sb) {
        var no = new Error("supabase not configured");
        no.code = "nosupabase";
        return Promise.reject(no);
      }
      var pass = String(payload.password || "");
      if (pass.length < 6) {
        var sh = new Error("password too short");
        sh.code = "short";
        return Promise.reject(sh);
      }
      return sb.auth.updateUser({ password: pass }).then(function (res) {
        if (res.error) throw res.error;
        return { done: true };
      });
    }
  };

  /* 账号档案（localStorage，按邮箱索引）
   * 让「账号 ↔ 血统鉴定 ↔ EVA 终端」形成真实闭环：
   *  - 注册/登录即建立档案；
   *  - 完成血统检测后结果写回档案；
   *  - 任意页面重新登录都能恢复姓名与血统。 */
  var PROFILE_KEY = "dr-profile";
  function getProfiles() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch (e) { return {}; } }
  function setProfiles(p) { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) {} }
  var profileApi = {
    get: function (email) {
      email = (email || "").trim().toLowerCase();
      var p = getProfiles();
      return p[email] || null;
    },
    set: function (p) {
      if (!p || !p.email) return;
      var e = (p.email || "").trim().toLowerCase();
      var all = getProfiles();
      all[e] = Object.assign({}, all[e] || {}, p);
      setProfiles(all);
    },
    saveBloodline: function (email, bl) {
      if (!email) return;
      var p = profileApi.get(email) || { email: email };
      if (bl.bloodLevel !== undefined) p.bloodLevel = bl.bloodLevel;
      if (bl.bloodLevelEn !== undefined) p.bloodLevelEn = bl.bloodLevelEn;
      if (bl.spirit !== undefined) p.spirit = bl.spirit;
      if (bl.spiritEn !== undefined) p.spiritEn = bl.spiritEn;
      if (bl.spiritSeq !== undefined) p.spiritSeq = bl.spiritSeq;
      p.testedAt = bl.testedAt || Date.now();
      profileApi.set(p);
    }
  };

  window.DR = window.DR || {};
  window.DR.auth = api;
  window.DR.authMode = mode;
  window.DR.profile = profileApi;
})();
