/* 龙族 · 言灵图鉴（从 codex.html 合并而来，服务于单页 index.html 的 #codex 段）
 * 依赖：i18n.js（window.t / window.tr / window.LANG / window.onLangChange）
 */
(function () {
  "use strict";
  if (!window.t) return;
  var spirits = [
    { seq: 13, name: "言灵·青铜御座", name_en: "Spirit · Bronze Throne", desc: "序列号13，硬化肉身，力量暴涨，青铜与火之王基础能力。", desc_en: "Seq. 13. Hardens the body and surges power — the Bronze & Fire King's basic ability.", high: true },
    { seq: 19, name: "言灵·龙王之齿", name_en: "Spirit · Dragon King's Fangs", desc: "序列号19，化利齿啃噬龙鳞，专破龙族防御。", desc_en: "Seq. 19. Turns into fangs that bite through dragon scales, breaking dragon defenses.", high: false },
    { seq: 22, name: "言灵·蛇", name_en: "Spirit · Serpent", desc: "序列号22，释放带有神经毒素的雾气，麻痹敌人感官。", desc_en: "Seq. 22. Releases neurotoxic mist that paralyzes the enemy's senses.", high: false },
    { seq: 27, name: "言灵·风行", name_en: "Spirit · Swift Wind", desc: "序列号27，极大提升自身速度，残影难辨。", desc_en: "Seq. 27. Greatly boosts speed; only afterimages remain.", high: false },
    { seq: 29, name: "言灵·千刃", name_en: "Spirit · Thousand Blades", desc: "序列号29，凝聚无数气刃如雨倾泻，割裂一切。", desc_en: "Seq. 29. Condenses countless air blades that fall like rain, tearing all apart.", high: false },
    { seq: 31, name: "言灵·风王之瞳", name_en: "Spirit · Wind King's Eye", desc: "序列号31，操控气流，实现短距离滑翔、风压冲击。", desc_en: "Seq. 31. Manipulates airflow for short glides and pressure blasts.", high: false },
    { seq: 33, name: "言灵·血统枷锁", name_en: "Spirit · Bloodline Shackle", desc: "序列号33，锁定并压制目标体内龙血活性。", desc_en: "Seq. 33. Locks and suppresses the dragon-blood activity within a target.", high: false },
    { seq: 38, name: "言灵·精神引路人", name_en: "Spirit · Mind Guide", desc: "序列号38，牵引他人意识进入自己的精神领域。", desc_en: "Seq. 38. Draws another's consciousness into one's own mental domain.", high: false },
    { seq: 41, name: "言灵·冰葬", name_en: "Spirit · Ice Entombment", desc: "序列号41，将目标封入永冻之棺，万载不化。", desc_en: "Seq. 41. Seals a target in a coffin of eternal frost, unmelting for ages.", high: false },
    { seq: 44, name: "言灵·镜瞳", name_en: "Spirit · Mirror Eye", desc: "序列号44，复制并反弹目视到的一次言灵，仅限同序列以下。", desc_en: "Seq. 44. Copies and reflects a spirit once seen — same sequence or lower only.", high: false },
    { seq: 47, name: "言灵·炽日", name_en: "Spirit · Blazing Sun", desc: "序列号47，制造强光与高温，短暂致盲范围内目标。", desc_en: "Seq. 47. Creates intense light and heat, briefly blinding all in range.", high: false },
    { seq: 48, name: "言灵·影月", name_en: "Spirit · Shadow Moon", desc: "序列号48，以影为媒瞬移，月下无迹可寻。", desc_en: "Seq. 48. Teleports through shadows; under the moon, leaves no trace.", high: false },
    { seq: 53, name: "言灵·极光", name_en: "Spirit · Aurora", desc: "序列号53，释放贯穿一切的高能光束，直线毁灭。", desc_en: "Seq. 53. Fires a high-energy beam that pierces everything in a straight line.", high: false },
    { seq: 58, name: "言灵·暮光", name_en: "Spirit · Twilight", desc: "序列号58，减缓范围内时间流速，暮色般朦胧。", desc_en: "Seq. 58. Slows the flow of time within range, hazy as twilight.", high: false },
    { seq: 59, name: "言灵·镰鼬", name_en: "Spirit · Kamaitachi", desc: "序列号59，路明非早期言灵，无形风刃切割范围内一切。", desc_en: "Seq. 59. Lu Mingfei's early spirit — invisible wind blades cut everything in range.", high: false },
    { seq: 64, name: "言灵·黑翼", name_en: "Spirit · Black Wings", desc: "序列号64，背后凝出漆黑龙翼，短时间飞行并以翼刃斩击。", desc_en: "Seq. 64. Forms dark dragon wings on the back for brief flight and wing-blade strikes.", high: false },
    { seq: 67, name: "言灵·赤霄", name_en: "Spirit · Crimson Spear", desc: "序列号67，凝火为枪，投掷爆裂，焚尽所过。", desc_en: "Seq. 67. Condenses fire into a thrown spear that bursts and incinerates its path.", high: false },
    { seq: 69, name: "言灵·冥照", name_en: "Spirit · Dark Veil", desc: "序列号69，扭曲光线，进入近乎隐形的状态。", desc_en: "Seq. 69. Bends light to enter a near-invisible state.", high: false },
    { seq: 71, name: "言灵·君焰", name_en: "Spirit · Junyan", desc: "序列号71，楚子航的言灵，凝聚高热于刀刃，斩出焚城烈焰之剑。", desc_en: "Seq. 71. Chu Zihang's spirit — condenses heat onto the blade, slashing a city-burning flame sword.", high: false },
    { seq: 76, name: "言灵·圣痕", name_en: "Spirit · Stigmata", desc: "序列号76，在躯体刻下圣痕，短时间内全属性暴涨，过后透支生命。", desc_en: "Seq. 76. Marks the body with stigmata; all attributes surge briefly, then life is overdrawn.", high: false },
    { seq: 81, name: "言灵·无尘之地", name_en: "Spirit · Dustless Realm", desc: "序列号81，形成气流屏障，隔绝火焰、子弹与有害物质。", desc_en: "Seq. 81. Forms an air barrier that blocks flame, bullets and harmful matter.", high: false },
    { seq: 83, name: "言灵·血噬", name_en: "Spirit · Blood Devour", desc: "序列号83，以血为引，侵蚀敌人血脉与龙血。", desc_en: "Seq. 83. Uses blood as a medium to erode the enemy's bloodline and dragon blood.", high: false },
    { seq: 84, name: "言灵·戒律", name_en: "Spirit · Precept", desc: "序列号84，压制范围内其他混血种释放言灵的能力。", desc_en: "Seq. 84. Suppresses the ability of other hybrids to release spirits within range.", high: false },
    { seq: 84, name: "言灵·不要死", name_en: "Spirit · Don't Die", desc: "序列号84，强制调动生命力修复躯体，持续消耗大量龙血。", desc_en: "Seq. 84. Forcibly channels life force to repair the body, steadily burning vast dragon blood.", high: true },
    { seq: 89, name: "言灵·时间零", name_en: "Spirit · Time Zero", desc: "序列号89，极大放慢自身感知内的世界，自身速度得到相对提升。", desc_en: "Seq. 89. Greatly slows the perceived world, relatively boosting one's own speed.", high: true },
    { seq: 91, name: "言灵·莱茵", name_en: "Spirit · Rhine", desc: "序列号91，制造极速声波共振，大范围爆破，短时间内产生毁灭性冲击波。", desc_en: "Seq. 91. Creates high-speed sonic resonance for wide-area blasts and shockwaves.", high: true },
    { seq: 97, name: "言灵·月读", name_en: "Spirit · Tsukuyomi", desc: "序列号97，编织幻境令敌沉溺于最深的梦境，无法分辨虚实。", desc_en: "Seq. 97. Weaves illusions that drown the foe in the deepest dream, unable to tell real from false.", high: true },
    { seq: 102, name: "言灵·永夜", name_en: "Spirit · Eternal Night", desc: "序列号102，抹除范围内一切光源与感知，陷入绝对黑暗。", desc_en: "Seq. 102. Erases all light and perception within range, plunging into absolute darkness.", high: true },
    { seq: 106, name: "言灵·无尽潜渊", name_en: "Spirit · Endless Abyss", desc: "序列号106，将目标拖入重力倍增的深渊领域，无法挣脱。", desc_en: "Seq. 106. Drags the target into a gravity-multiplied abyssal domain, inescapable.", high: true },
    { seq: 109, name: "言灵·审判", name_en: "Spirit · Judgment", desc: "序列号109，在领域内裁定“罪”，对被裁定者施加无法回避的毁灭。", desc_en: "Seq. 109. Within the domain it judges \"sin\", inflicting inescapable ruin on the judged.", high: true },
    { seq: 111, name: "言灵·寂灭", name_en: "Spirit · Silence", desc: "序列号111，范围内一切声响与生命气息归于死寂。", desc_en: "Seq. 111. All sound and life-signs within range fall into deathly silence.", high: true },
    { seq: 113, name: "言灵·归墟", name_en: "Spirit · Guixu", desc: "序列号113，操控水流，制造无边海啸与水压，海洋领域的终极言灵。", desc_en: "Seq. 113. Commands water, raising boundless tsunamis and pressure — the ultimate ocean spirit.", high: true },
    { seq: 114, name: "言灵·烛龙", name_en: "Spirit · Zhulong", desc: "序列号114，灭世级言灵，释放焚尽一切的赤红烈焰，足以摧毁城市。", desc_en: "Seq. 114. An apocalyptic-class spirit that unleashes city-consuming crimson flame.", high: true },
    { seq: 116, name: "言灵·灭世之瞳", name_en: "Spirit · World-Ending Eye", desc: "序列号116，凝视即引爆，传说中灭世级的瞳术。", desc_en: "Seq. 116. A gaze that detonates — a legendary apocalyptic eye technique.", high: true },
    { seq: 118, name: "言灵·王权", name_en: "Spirit · Sovereignty", desc: "序列号118，路鸣泽的王之领域，言出法随，以言改写战局。", desc_en: "Seq. 118. Lu Mingze's king-domain — words become law, rewriting the battle with speech.", high: true },
    { seq: 120, name: "言灵·龙语", name_en: "Spirit · Dragon Speech", desc: "序列号120，以太古龙语下令，强制范围内一切生物臣服。", desc_en: "Seq. 120. Commands in ancient dragon-tongue, forcing all beings in range to submit.", high: true }
  ];

  var grid = document.getElementById("grid");
  var count = document.getElementById("count");
  var search = document.getElementById("search");
  if (!grid || !count || !search) return;

  var curF = "all";
  function seqLabel() { return window.LANG === "en" ? "Seq." : "序列号"; }
  function shortName(s) {
    var nm = tr(s, "name");
    return window.LANG === "en" ? nm.replace("Spirit · ", "") : nm.replace("言灵·", "");
  }
  function render() {
    var q = (search.value || "").trim().toLowerCase();
    var list = spirits.filter(function (s) {
      if (curF === "high" && !s.high) return false;
      if (curF === "normal" && s.high) return false;
      if (q) {
        var hay = (tr(s, "name") + " " + s.seq + " " + tr(s, "desc")).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    count.textContent = t("count_tmpl").replace("{{n}}", list.length).replace("{{t}}", spirits.length);
    grid.innerHTML = list.length
      ? list.map(function (s) {
          return (
            '<div class="codex-card' + (s.high ? " high" : "") + '"' +
            (s.high ? ' data-high="' + t("high_badge") + '"' : "") +
            '><div class="seq">' + seqLabel() + " " + s.seq + "</div><h3>" + shortName(s) + "</h3><p>" + tr(s, "desc") + "</p></div>"
          );
        }).join("")
      : '<div class="empty">' + t("empty_tmpl") + "</div>";
  }

  var ftabs = document.querySelectorAll(".ftab");
  ftabs.forEach(function (b) {
    b.addEventListener("click", function () {
      ftabs.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      curF = b.getAttribute("data-f");
      render();
    });
  });
  search.addEventListener("input", render);
  if (window.onLangChange) window.onLangChange(render);
  render();
})();
