/* 龙族 · 情节长卷（从 story.html 合并而来，服务于单页 index.html 的 #story 段）
 * 依赖：i18n.js（window.t / window.tr / window.LANG / window.onLangChange）
 */
(function () {
  "use strict";
  if (!window.t) return;

  var VOLS = [
    { id: "v1", roman: "Ⅰ", name: "火之晨曦", name_en: "Dawn of Fire", en: "DAWN OF FIRE", img: "img/dragon-02.webp", cap: "⟪ 卷一 · 火之晨曦 ⟫",
      syn: "一个被全世界当作废柴的少年，收到一封来自卡塞尔学院的录取信。在那里他第一次知道，自己体内流淌着龙的血，而屠龙，是这个学院唯一的专业。这一卷是路明非的觉醒之卷——从被人忽视的'烂泥'，到第一次握住属于自己的言灵。",
      syn_en: "A boy the whole world wrote off as worthless receives an admission letter from Cassell College. There he learns for the first time that dragon blood runs in his veins, and that dragon-slaying is the college's only major. This is Lu Mingfei's volume of awakening — from the ignored 'mud' to the first time he grasps a spirit of his own.",
      chars: ["路明非", "诺诺", "楚子航", "恺撒", "路鸣泽", "康斯坦丁"],
      chars_en: ["Lu Mingfei", "Nono", "Chu Zihang", "Caesar", "Lu Mingze", "Constantine"],
      scenes: [
        { t: "芝加哥的红发女孩", t_en: "The red-haired girl in Chicago", d: "路明非在芝加哥车站第一次遇见诺诺——那个把辫子甩过他肩头、头也不回的红发女孩。她自称是他的'辅导员'，把他带进一个他从未想象过的世界。", d_en: "At Chicago station Lu Mingfei meets Nono for the first time — the red-haired girl who flicks her braid over his shoulder and never looks back. She calls herself his 'mentor' and pulls him into a world he never imagined.", q: "你知道卡塞尔学院是干什么的吗？屠龙。", q_en: "Do you know what Cassell College is for? Slaying dragons." },
        { t: "言灵·镰鼬觉醒", t_en: "Awakening of the Kamaitachi", d: "在执行部的第一次实战中，路明非被迫面对生死。危急时刻，体内沉睡的力量苏醒，无形的风刃切割开敌人——以及一个自称'路鸣泽'的声音，在他脑海里第一次自我介绍。", d_en: "In his first real combat with the Execution Bureau, Mingfei is forced to the edge of life and death. At the critical moment the sleeping power within wakes — invisible wind blades cut down the enemy — and a voice calling itself 'Lu Mingze' introduces itself in his mind for the first time.", q: "哥哥你好，我是路鸣泽。", q_en: "Hello, brother. I'm Lu Mingze." },
        { t: "卡塞尔学院", t_en: "Cassell College", d: "一所藏在美国山区的秘密学院，学员全是混血种，课程包括言灵学、龙族史、近身格斗。路明非在这里遇见了楚子航、恺撒，以及那个永远高高在上的诺诺。", d_en: "A secret academy hidden in the American mountains, its students all hybrids. Curriculum includes Spiritology, Dragon History, close combat. Here Mingfei meets Chu Zihang, Caesar, and the ever-unreachable Nono.", q: "我们都是怪物，只是有的人藏得好一点。", q_en: "We're all monsters. Some of us just hide it better." },
        { t: "青铜城之战", t_en: "Battle of Bronze City", d: "执行部深入青铜城深处，与青铜与火之王之弟康斯坦丁正面交锋。路明非第一次以'屠龙者'的身份站在战场上，第一次明白所谓勇气，不过是恐惧之下仍向前迈出的一步。", d_en: "The Execution Bureau pushes deep into Bronze City to face Constantine, brother of the Bronze & Fire King. For the first time Mingfei stands on the battlefield as a dragon-slayer, and learns for the first time that courage is only taking one more step forward despite fear." },
        { t: "康斯坦丁之死", t_en: "Death of Constantine", d: "那个用'哥哥'称呼路明非的小龙，最终死在了路明非面前。它临终前还在问路明非要不要和它一起回家。这是路明非第一次为屠龙流泪。", d_en: "The little dragon who called Mingfei 'brother' dies before him in the end. With his last words he asks Mingfei if they can go home together. It is the first time Mingfei weeps for a kill.", q: "哥哥……我们都要死了。", q_en: "Brother… we're both going to die." }
      ] },
    { id: "v2", roman: "Ⅱ", name: "悼亡者之瞳", name_en: "Mourner's Eyes", en: "MOURNER'S EYES", img: "img/dragon-03.webp", cap: "⟪ 卷二 · 悼亡者之瞳 ⟫",
      syn: "一个假装失忆的'普通女孩'住进楚子航隔壁。她太笨了，笨到让一向冷漠的楚子航想一直看着她。可她其实是大地与山之王——耶梦加得。这一卷是关于'龙能不能学会爱'的悲剧。",
      syn_en: "A 'ordinary girl' pretending amnesia moves in next door to Chu Zihang. She is so clumsy it makes the usually cold Chu Zihang want to keep watching over her. But she is in fact Jörmungandr, the Earth & Mountain King. This volume is the tragedy of whether a dragon can learn to love.",
      chars: ["楚子航", "夏弥 / 耶梦加得", "路明非", "零", "恺撒"],
      chars_en: ["Chu Zihang", "Xia Mi / Jörmungandr", "Lu Mingfei", "Zero", "Caesar"],
      scenes: [
        { t: "夏弥与楚子航", t_en: "Xia Mi & Chu Zihang", d: "夏弥搬进楚子航隔壁，自称失忆。她做饭很难吃、总是迷路、却能在楚子航疲惫时安静地坐在他身边。楚子航渐渐发现，自己离不开这个笨拙的女孩了。", d_en: "Xia Mi moves in next to Chu Zihang, claiming amnesia. She cooks terribly, gets lost constantly, yet sits quietly beside him when he is tired. Zihang slowly realizes he cannot live without this clumsy girl.", q: "你太笨了，所以我要一直看着你。", q_en: "You're too clumsy, so I have to keep watching you." },
        { t: "耶梦加得", t_en: "Jörmungandr", d: "夏弥的真实身份是大地与山之王耶梦加得。她在人类世界里学到的不是伪装，而是爱——这份爱，最终成了她致命的弱点。", d_en: "Xia Mi's true identity is Jörmungandr, the Earth & Mountain King. What she learns in the human world is not disguise, but love — and that love becomes her fatal weakness." },
        { t: "悼亡者之瞳", t_en: "Mourner's Eyes", d: "所谓'悼亡者之瞳'，是耶梦加得一族代代相传的宿命：双子龙王中，必有一人吞噬另一人才能完成加冕。夏弥不愿吞噬自己的兄长，选择了另一种结局。", d_en: "The so-called 'Mourner's Eyes' is the inherited fate of Jörmungandr's line: of the twin dragon kings, one must devour the other to complete the coronation. Xia Mi refused to devour her brother, and chose another ending." },
        { t: "夏弥之死", t_en: "Death of Xia Mi", d: "她为楚子航挡下了致命一击，化作人形消散在风里。临终前她对楚子航说出了那句让所有人落泪的话。楚子航抱着她，第一次在战场上落泪。", d_en: "She takes a fatal blow for Chu Zihang and dissolves into the wind as a human form. With her last words she says the line that makes everyone weep. Zihang holds her, weeping on the battlefield for the first time.", q: "因为我爱过你……所以我是世界上最厉害的龙。", q_en: "Because I loved you… I am the most powerful dragon in the world." },
        { t: "冰海王女零", t_en: "Zero, the Ice-Sea Princess", d: "路明非在冰海上遇到了另一位与他'同病相怜'的混血种——那个冷若冰霜、却叫他'师兄'的女孩零。她将成为日后故事里至关重要的人物。", d_en: "On the ice sea Mingfei meets another hybrid 'bound by the same fate' — the cold girl who calls him 'senior', Zero. She will become a crucial figure in later stories." }
      ] },
    { id: "v3", roman: "Ⅲ", name: "黑月之潮", name_en: "Dark Moon Tide", en: "DARK MOON TIDE", img: "img/dragon-04.webp", cap: "⟪ 卷三 · 黑月之潮 ⟫",
      syn: "全系列最催泪的一卷。路明非来到日本，遇见了上杉绘梨衣——一个被家族当作终极武器养大、从未见过外面世界的女孩。他带她逛东京、吃拉面、看东京塔，然后眼睁睁看着她死去。这一卷是路明非真正的成长之痛。",
      syn_en: "The most heartbreaking volume of the series. Mingfei goes to Japan and meets Uesugi Eri — a girl raised as the ultimate weapon by the Snake Qishu Eight Families, who has never seen the outside world. He takes her to Tokyo, to ramen, to Tokyo Tower, and watches her die. This is Mingfei's true growing pain.",
      chars: ["路明非", "上杉绘梨衣", "恺撒", "楚子航", "路鸣泽", "赫尔佐格"],
      chars_en: ["Lu Mingfei", "Uesugi Eri", "Caesar", "Chu Zihang", "Lu Mingze", "Herzog"],
      scenes: [
        { t: "上杉绘梨衣", t_en: "Uesugi Eri", d: "绘梨衣被蛇岐八家当作'终极武器'囚禁在地下室，从未见过阳光。路明非第一次见到她时，她正抱着膝盖坐在角落，像一只受惊的小兽。", d_en: "Eri is imprisoned in a basement by the Snake Qishu Families as their 'ultimate weapon', never having seen sunlight. When Mingfei first meets her, she sits hugging her knees in the corner like a startled small beast.", q: "Sakura……这是你给我起的名字吗？", q_en: "Sakura…… is that the name you gave me?" },
        { t: "拉面与东京塔", t_en: "Ramen & Tokyo Tower", d: "路明非带绘梨衣第一次走出家门：第一次吃拉面、第一次逛庙会、第一次被人牵着手看东京塔。她给路明非起了一个只有她叫的名字——Sakura。", d_en: "Mingfei takes Eri out of the house for the first time: her first ramen, her first festival, the first time someone holds her hand to see Tokyo Tower. She gives Mingfei a name only she uses — Sakura.", q: "Sakura，你说我们还能再来这里吗？", q_en: "Sakura, do you think we can come back here again?" },
        { t: "4 / 4 献祭", t_en: "The 4/4 Sacrifice", d: "赫尔佐格抽干绘梨衣的血以复活白王。路明非用尽全部四分之一的生命，召唤路鸣泽降临，以'不要死'强行续住绘梨衣最后一口气——却终究没能留住她。", d_en: "Herzog drains Eri's blood to revive the White King. Mingfei spends a full quarter of his life to summon Lu Mingze, forcibly keeping Eri's last breath with 'Don't die' — yet still cannot hold her.", q: "哥哥，我们又见面了。这次，你要付出全部了。", q_en: "Brother, we meet again. This time, you must pay everything." },
        { t: "东京塔下的告别", t_en: "Farewell Beneath Tokyo Tower", d: "绘梨衣在源氏重工的地下室里，给路明非发了一条短信，里面是她穿着婚纱的自拍。她没能等到路明非回来。东京塔的灯，那一夜为谁而亮。", d_en: "In the Genji Heavy Industries basement, Eri sends Mingfei a text — a selfie of her in a wedding dress. She never waits for Mingfei to return. That night, for whom did the lights of Tokyo Tower burn?", q: "Sakura……", q_en: "Sakura……" }
      ] },
    { id: "v4", roman: "Ⅳ", name: "奥丁之渊", name_en: "Abyss of Odin", en: "ABYSS OF ODIN", img: "img/dragon-05.webp", cap: "⟪ 卷四 · 奥丁之渊 ⟫",
      syn: "失踪多年的楚子航出现在北欧的雪原上，却陷入了奥丁编织的尼伯龙根——一个永远走不出的梦境。这一卷揭开了楚子航最深的伤疤：那个雨夜，他的父亲为何走入暴风雨，再也没有回来。",
      syn_en: "Chu Zihang, missing for years, appears on the Nordic snowfields, trapped in Odin's Nibelung — a dream he can never escape. This volume reveals Zihang's deepest scar: that rainy night, why his father walked into the storm and never came back.",
      chars: ["楚子航", "路明非", "楚父", "奥丁", "诺诺"],
      chars_en: ["Chu Zihang", "Lu Mingfei", "Chu's Father", "Odin", "Nono"],
      scenes: [
        { t: "楚子航的梦境", t_en: "Chu Zihang's Dream", d: "楚子航在奥丁的尼伯龙根中反复经历同一天——父亲从桥上走入暴风雨的那一天。他试图改变结局，却一次次失败。这是神明对凡人最残忍的惩罚。", d_en: "Inside Odin's Nibelung, Zihang relives the same day again and again — the day his father walked from the bridge into the storm. He tries to change the ending, and fails each time. This is a god's cruelest punishment upon a mortal." },
        { t: "奥丁之枪", t_en: "Odin's Spear", d: "手持命运之枪的神明在北欧雪原上等待。它要的从来不是龙，而是某个人的灵魂——一个足够强大、又足够痛苦的灵魂来承载它的降临。", d_en: "The god holding the spear of fate waits on the Nordic snowfields. What he wants is never a dragon, but a soul — one strong enough, and wounded enough, to bear his descent." },
        { t: "父亲的背影", t_en: "His Father's Back", d: "楚子航终于看清那个雨夜的真相：父亲走入暴风雨，是为了替他挡下奥丁的命运之枪。父亲不是抛弃了他，而是用生命换了他一条活路。", d_en: "Zihang finally sees the truth of that rainy night: his father walked into the storm to block Odin's spear of fate for him. The father did not abandon him; he bought his son a life with his own.", q: "孩子，往前走，别回头。", q_en: "Son, walk forward. Don't look back." },
        { t: "走入暴风雨", t_en: "Walking Into the Storm", d: "这一次，换楚子航走进暴风雨——为了救出那个一直困在梦境里、走不出去的自己，也为了替父亲完成未竟的战斗。", d_en: "This time, it is Zihang who walks into the storm — to rescue the self trapped in the dream, and to finish the battle his father left unfinished." }
      ] },
    { id: "v5", roman: "Ⅴ", name: "悼亡者的归来", name_en: "Return of the Mourner", en: "RETURN OF THE MOURNER", img: "img/dragon-06.webp", cap: "⟪ 卷五 · 悼亡者的归来 ⟫",
      syn: "路明非带着诺诺回到东京。这一次不是为了屠龙，而是为了找一个人——一个本该早已死去的女孩。当世界树苏醒、白王的力量现世，所有未完成的承诺都将在此了结。",
      syn_en: "Mingfei returns to Tokyo with Nono. Not to slay dragons, but to find someone — a girl who should have long been dead. When the World Tree awakens and the White King's power manifests, every unfinished promise will be settled.",
      chars: ["路明非", "诺诺", "赫尔佐格", "路鸣泽", "绘梨衣"],
      chars_en: ["Lu Mingfei", "Nono", "Herzog", "Lu Mingze", "Eri"],
      scenes: [
        { t: "重返日本", t_en: "Return to Japan", d: "路明非带着诺诺回到东京。这座城市的每一盏灯、每一家拉面店，都让他想起绘梨衣。但这一次他回来，是为了一个几乎不可能的可能。", d_en: "Mingfei returns to Tokyo with Nono. Every light, every ramen shop in this city reminds him of Eri. But this time he comes back for a near-impossible possibility." },
        { t: "赫尔佐格的终局", t_en: "Herzog's End", d: "那个曾经抽干绘梨衣血液的疯子，最终也要面对他所觊觎的白王的力量——以及它无法承受的代价。罪恶终有清算之日。", d_en: "The madman who drained Eri's blood must himself face the White King's power he coveted — and the price it demands. Sin is finally reckoned." },
        { t: "世界树之下", t_en: "Beneath the World Tree", d: "北欧神话中支撑九界的白蜡树在现实中苏醒。树根下埋着所有死去的龙，也埋着一切未完成的承诺。路明非站在树下，做了一个关于生与死的选择。", d_en: "The ash tree that supports the nine worlds in Norse myth awakens in reality. Beneath its roots lie all the dead dragons, and all the unfinished promises. Mingfei stands beneath it and makes a choice between life and death.", q: "如果命运选择了我，那我也可以选择，为谁而活。", q_en: "If fate chose me, then I can also choose — for whom to live." },
        { t: "诺诺与命运", t_en: "Nono & Fate", d: "那个在芝加哥车站甩着辫子的红发女孩，始终站在路明非身边。她是他与人类世界最后的羁绊，也是他选择活下去的理由。", d_en: "The red-haired girl who flicked her braid at Chicago station always stands beside Mingfei. She is his last bond to the human world, and the reason he chooses to keep living." }
      ] }
  ];

  var tabs = document.getElementById("volTabs");
  var panels = document.getElementById("volPanels");
  var rl = document.getElementById("randLine");
  if (!tabs || !panels || !rl) return;

  function sceneNo(j) {
    return window.LANG === "en" ? ["I", "II", "III", "IV", "V"][j] || (j + 1) : ["壹", "贰", "叁", "肆", "伍"][j] || (j + 1);
  }
  function quoteOf(s) { return window.LANG === "en" ? (s.q_en || "") : (s.q || ""); }
  function quoteMark(s) {
    var q = quoteOf(s);
    if (!q) return "";
    return window.LANG === "en" ? '<div class="s-quote">"' + q + '"</div>' : '<div class="s-quote">「' + q + '」</div>';
  }
  function render() {
    tabs.innerHTML = "";
    panels.innerHTML = "";
    var prefix = window.LANG === "en" ? "Dragon Raja " : "龙族";
    VOLS.forEach(function (v, i) {
      var b = document.createElement("button");
      b.className = "vol-tab" + (i === 0 ? " active" : "");
      b.textContent = v.roman + " · " + tr(v, "name");
      b.addEventListener("click", function () { select(i); });
      tabs.appendChild(b);

      var p = document.createElement("div");
      p.className = "vol-panel" + (i === 0 ? " active" : "");
      p.id = v.id;
      p.innerHTML =
        '<div class="vol-head"><div class="art-frame"><img src="' + v.img + '" alt=""><div class="cap">' + v.cap + '</div></div>' +
        '<div class="vol-info"><h3>' + prefix + v.roman + " · " + tr(v, "name") + '</h3><span class="en">' + v.en + '</span><p class="syn">' + tr(v, "syn") + '</p>' +
        '<div class="char-row">' + (window.LANG === "en" ? v.chars_en : v.chars).map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</div></div></div>" +
        '<div class="scene-list">' + v.scenes.map(function (s, j) {
          return '<div class="scene2"><div class="s-head"><span class="s-no">' + sceneNo(j) + '</span><span class="s-title">' + tr(s, "t") + '</span><span class="s-toggle">+</span></div><div class="s-body"><p>' + tr(s, "d") + quoteMark(s) + "</p></div></div>";
        }).join("") + "</div>";
      panels.appendChild(p);
    });
    document.querySelectorAll(".scene2 .s-head").forEach(function (h) {
      h.addEventListener("click", function () {
        var sc = h.parentElement;
        sc.classList.toggle("open");
        var tg = h.querySelector(".s-toggle");
        tg.textContent = sc.classList.contains("open") ? "×" : "+";
      });
    });
  }
  function select(i) {
    document.querySelectorAll(".vol-tab").forEach(function (b, k) { b.classList.toggle("active", k === i); });
    document.querySelectorAll(".vol-panel").forEach(function (p, k) { p.classList.toggle("active", k === i); });
  }

  var quotes = ["凡王之血，必以剑终。", "我们都是小怪兽，总有一天会被正义的奥特曼杀死。", "因为我爱过你……所以我是世界上最厉害的龙。", "Sakura，你说我们还能再来这里吗？", "哥哥……我们都要死了。", "每个人心里都有一条龙。", "孩子，往前走，别回头。", "如果命运选择了我，那我也可以选择，为谁而活。", "哥哥，我们又见面了。", "你太笨了，所以我要一直看着你。"];
  var quotes_en = ["The blood of kings ends by the sword.", "We are all little monsters; one day we'll be killed by the righteous Ultraman.", "Because I loved you… I am the most powerful dragon in the world.", "Sakura, do you think we can come back here again?", "Brother… we're both going to die.", "A dragon lives in every heart.", "Son, walk forward. Don't look back.", "If fate chose me, then I can also choose — for whom to live.", "Brother, we meet again.", "You're too clumsy, so I have to keep watching you."];
  var randBtn = document.getElementById("randQuote");
  if (randBtn) {
    randBtn.addEventListener("click", function () {
      var arr = window.LANG === "en" ? quotes_en : quotes;
      var q;
      do { q = arr[Math.floor(Math.random() * arr.length)]; } while (q === rl.dataset.q);
      rl.dataset.q = q;
      rl.textContent = (window.LANG === "en" ? '"' : "「") + q + (window.LANG === "en" ? '"' : "」");
    });
  }

  if (window.onLangChange) window.onLangChange(function () { render(); rl.textContent = t("rand_hint"); delete rl.dataset.q; });
  render();
})();
