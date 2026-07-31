/* 龙族 · 混血种资质鉴定仪式（服务于单页 index.html 的 #ritual 段）
 * 依赖：i18n.js（window.t / window.LANG / window.onLangChange）、account.js（window.DR_ACC）
 * 流程：启动血统检测 -> 随机抽取 8 档血统 -> 召唤言灵 -> 写回学员档案 + EVA 邮件
 */
(function () {
  "use strict";
  if (!window.t) return;
  var ACC = window.DR_ACC;
  if (!ACC) return;

  var checkBtn = document.getElementById("checkBloodBtn");
  var summonBtn = document.getElementById("callSpiritBtn");
  var scan = document.getElementById("scan");
  var scanTip = document.getElementById("scanTip");
  var resultBox = document.getElementById("resultBox");
  var bloodText = document.getElementById("bloodText");
  var spiritText = document.getElementById("spiritText");
  var spiritDesc = document.getElementById("spiritDesc");
  if (!checkBtn || !summonBtn || !scan || !scanTip || !resultBox || !bloodText || !spiritText || !spiritDesc) return;

  function L(o) { return (window.LANG === "en" && o.en !== undefined) ? o.en : o.zh; }

  /* 8 档血统 -> 对应言灵（与言灵图鉴序列号一致） */
  var BLOOD = [
    { level: "D 级", levelEn: "D-class", weight: 24, spirit: { name: "言灵·蛇", name_en: "Spirit · Serpent", seq: 22,
      desc: "释放带有神经毒素的雾气，麻痹敌人感官。", desc_en: "Releases neurotoxic mist that paralyzes the enemy's senses." } },
    { level: "C 级", levelEn: "C-class", weight: 22, spirit: { name: "言灵·风行", name_en: "Spirit · Swift Wind", seq: 27,
      desc: "极大提升自身速度，残影难辨。", desc_en: "Greatly boosts speed; only afterimages remain." } },
    { level: "B 级", levelEn: "B-class", weight: 20, spirit: { name: "言灵·镰鼬", name_en: "Spirit · Kamaitachi", seq: 59,
      desc: "路明非早期言灵，无形风刃切割范围内一切。", desc_en: "Lu Mingfei's early spirit — invisible wind blades cut everything in range." } },
    { level: "A 级", levelEn: "A-class", weight: 16, spirit: { name: "言灵·君焰", name_en: "Spirit · Junyan", seq: 71,
      desc: "楚子航的言灵，凝聚高热于刀刃，斩出焚城烈焰之剑。", desc_en: "Chu Zihang's spirit — condenses heat onto the blade, slashing a city-burning flame sword." } },
    { level: "S 级", levelEn: "S-class", weight: 9, spirit: { name: "言灵·时间零", name_en: "Spirit · Time Zero", seq: 89,
      desc: "极大放慢自身感知内的世界，自身速度得到相对提升。", desc_en: "Greatly slows the perceived world, relatively boosting one's own speed." } },
    { level: "S+ 级", levelEn: "S+ class", weight: 5, spirit: { name: "言灵·莱茵", name_en: "Spirit · Rhine", seq: 91,
      desc: "制造极速声波共振，大范围爆破，短时间内产生毁灭性冲击波。", desc_en: "Creates high-speed sonic resonance for wide-area blasts and shockwaves." } },
    { level: "SS 级", levelEn: "SS-class", weight: 3, spirit: { name: "言灵·审判", name_en: "Spirit · Judgment", seq: 109,
      desc: "在领域内裁定“罪”，对被裁定者施加无法回避的毁灭。", desc_en: "Within the domain it judges \"sin\", inflicting inescapable ruin on the judged." } },
    { level: "SSS 级", levelEn: "SSS-class", weight: 1, spirit: { name: "言灵·烛龙", name_en: "Spirit · Zhulong", seq: 114,
      desc: "灭世级言灵，释放焚尽一切的赤红烈焰，足以摧毁城市。", desc_en: "An apocalyptic-class spirit that unleashes city-consuming crimson flame." } }
  ];
  var WSUM = BLOOD.reduce(function (a, b) { return a + b.weight; }, 0);

  var cur = null; // 当前抽中的血统对象
  var summoned = false;

  function rollBlood() {
    var r = Math.random() * WSUM;
    for (var i = 0; i < BLOOD.length; i++) { r -= BLOOD[i].weight; if (r <= 0) return BLOOD[i]; }
    return BLOOD[0];
  }

  function applyResult(b, isSummoned) {
    cur = b;
    bloodText.textContent = L({ zh: b.level, en: b.levelEn });
    resultBox.style.display = "block";
    if (isSummoned) {
      var s = b.spirit;
      spiritText.textContent = L({ zh: s.name, en: s.name_en }) + "（" + s.seq + "）";
      spiritDesc.textContent = L({ zh: s.desc, en: s.desc_en });
    }
  }

  checkBtn.addEventListener("click", function () {
    if (!ACC.current()) { ACC.requireLogin(function () {}); return; }
    if (cur) { /* 已检测过，不重复 */ return; }
    checkBtn.disabled = true;
    scan.style.display = "block";
    scanTip.style.display = "block";
    scanTip.textContent = t("scan_tip");
    var bar = scan.querySelector("i");
    if (bar) { bar.style.transition = "none"; bar.style.width = "0"; void bar.offsetWidth; bar.style.transition = "width 2.4s ease"; bar.style.width = "100%"; }
    setTimeout(function () {
      var b = rollBlood();
      applyResult(b, false);
      scanTip.textContent = t("promptSummon");
      summonBtn.disabled = false;
      if (ACC.saveBloodlineLevel) ACC.saveBloodlineLevel(L({ zh: b.level, en: b.levelEn }), b.levelEn);
    }, 2450);
  });

  summonBtn.addEventListener("click", function () {
    if (!cur || summoned) return;
    summoned = true;
    summonBtn.disabled = true;
    var s = cur.spirit;
    spiritText.textContent = L({ zh: s.name, en: s.name_en }) + "（" + s.seq + "）";
    spiritDesc.textContent = L({ zh: s.desc, en: s.desc_en });
    if (ACC.saveBloodlineSpirit) ACC.saveBloodlineSpirit({ name: s.name }, s.name_en, s.seq);
  });

  /* 返回用户：若已鉴定，恢复结果 */
  function restore() {
    var u = ACC.current();
    if (!u || !u.profile) return;
    var p = u.profile;
    if (p.bloodLevel) {
      var b = BLOOD.filter(function (x) { return (x.level === p.bloodLevel || x.levelEn === (p.bloodLevelEn || p.bloodLevel)); })[0];
      if (b) {
        cur = b; checkBtn.disabled = true; summonBtn.disabled = true; summoned = !!p.spirit;
        applyResult(b, !!p.spirit);
        scan.style.display = "none"; scanTip.style.display = "none";
      }
    }
  }
  restore();

  /* 语言切换：若已有结果，按当前语言重填 */
  if (window.onLangChange) window.onLangChange(function () {
    if (cur) applyResult(cur, summoned);
  });

  /* 账号登录后补恢复（若进入页面时未登录，登录后此处补上） */
  window.addEventListener("acc:login", restore);
})();
