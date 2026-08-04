/* 龙族 · 学院人工智能 EVA — 终端引擎 + 浮动聊天挂件
 * 静态站点无后端，EVA 为「基于剧情知识库的交互体」：
 *  - 意图识别：通知 / 任务 / 邮箱 / 帮助 / 语录 / 情感问候
 *  - 加权关键词打分匹配（别名、子串、覆盖度），支持多轮上下文承接
 *  - 发放可推进的任务链（模拟龙族情节）
 *  - 管理学院邮箱（localStorage 记住已读/新邮件）
 *  - 回答附带站内导航链接与追问建议
 */
(function(){
  "use strict";
  var L = function(o){ return (window.LANG==='en' && o.en!==undefined) ? o.en : o.zh; };
  var t = window.t || function(k){ return k; };

  /* ============ 数据 ============ */
  // 学院通知
  var NOTICES = [
    { id:'n0', zh:"【招生委员会】致 DR-0001：你的混血种档案已激活。请于卡塞尔钟声敲响前完成「新生登记」任务。",
      en:"[Admissions] To DR-0001: your hybrid file is active. Complete the 'Freshman Registration' task before the bells toll." },
    { id:'n1', zh:"【实战演练】青铜城外围探测任务开放。禁止单独行动，言灵·镰鼬保持开启。",
      en:"[Field Exercise] Bronze City perimeter recon is open. No solo ops; keep Spirit · Kamaitachi active." },
    { id:'n2', zh:"【安全预警】夏弥同学失踪超过 72 小时。任何目击耶梦加得气息者，立即上报执行部。",
      en:"[Security] Student Xia Mi missing 72h+. Report any Jörmungandr scent to the Execution Bureau at once." },
    { id:'n3', zh:"【一级行动令】东京源氏重工。目标：获取神遗产线索，与代号『绘梨衣』的权天使汇合。危险性：极高。",
      en:"[Level-1 Op] Tokyo, Genji Heavy Industries. Objective: secure the God's Legacy clue, rendezvous with the Power Angel codename 'Eri'. Threat: extreme." },
    { id:'n4', zh:"【封印解除】权与力之七宗罪已自冰窖解封。租赁方须与路鸣泽签订四分之一灵魂契约——后果不可逆。",
      en:"[Seal Lifted] The Seven Deadly Sins are released from the ice vault. The lessee must sign a quarter-soul pact with Lu Mingze — irreversible." },
    { id:'n5', zh:"【末日警报】白王复苏征兆确认。世界树下的最终权位之争即将开启。全体 S 级待命。",
      en:"[Doomsday Alert] White King revival signs confirmed. The final struggle beneath the World Tree is imminent. All S-class on standby." }
  ];

  // 任务链（模拟龙族情节，按序解锁）
  var TASKS = [
    { id:'t0', after:null,
      zh_t:"新生登记", zh_b:"完成你的混血种血统鉴定，让学院记录你的言灵。", zh_o:"在首页启动血统检测。", zh_r:"解锁青铜城侦察。",
      en_t:"Freshman Registration", en_b:"Finish your hybrid bloodline test so the college records your spirit.", en_o:"Run the blood test on the homepage.", en_r:"Unlocks Bronze City recon." },
    { id:'t1', after:'t0',
      zh_t:"青铜城侦察", zh_b:"潜入青铜城外围，记录赤红烈焰的脉冲频率。", zh_o:"在聊天中输入「任务」领取简报。", zh_r:"解锁镰鼬训练。",
      en_t:"Bronze City Recon", en_b:"Infiltrate Bronze City's perimeter and log the crimson-flame pulse.", en_o:"Type 'task' in chat to receive the brief.", en_r:"Unlocks Kamaitachi training." },
    { id:'t2', after:'t1',
      zh_t:"镰鼬训练", zh_b:"在楚子航指导下掌握言灵·镰鼬（序列号59），感知风中的情报。", zh_o:"与楚子航建立兄弟契约。", zh_r:"解锁夏弥线索。",
      en_t:"Kamaitachi Training", en_b:"Under Chu Zihang, master Spirit · Kamaitachi (Seq.59) — read intel in the wind.", en_o:"Forge a brother-pact with Chu Zihang.", en_r:"Unlocks Xia Mi's trail." },
    { id:'t3', after:'t2',
      zh_t:"夏弥线索", zh_b:"追查夏弥失踪，在地铁站发现她与大地的双生真相。", zh_o:"不发动攻击，先理解她。", zh_r:"解锁东京潜入。",
      en_t:"Xia Mi's Trail", en_b:"Trace Xia Mi's disappearance; in the subway find her twin truth with the Earth.", en_o:"Do not attack — understand her first.", en_r:"Unlocks Tokyo infiltration." },
    { id:'t4', after:'t3',
      zh_t:"东京潜入", zh_b:"与绘梨衣汇合，潜入源氏重工地底，取得神遗产。", zh_o:"对绘梨衣说一句「Sakura」。", zh_r:"解锁七宗罪试炼。",
      en_t:"Tokyo Infiltration", en_b:"Meet Eri, infiltrate Genji Heavy Industries' basement, seize the God's Legacy.", en_o:"Say 'Sakura' to Eri.", en_r:"Unlocks the Seven Sins trial." },
    { id:'t5', after:'t4',
      zh_t:"七宗罪试炼", zh_b:"向路鸣泽租借七宗罪，在源氏重工地底击败篡位的赫尔佐格。", zh_o:"签署四分之一灵魂契约。", zh_r:"解锁白王终局。",
      en_t:"Trial of the Seven Sins", en_b:"Lease the Seven Sins from Lu Mingze; slay the usurper Herzog in the Genji basement.", en_o:"Sign the quarter-soul pact.", en_r:"Unlocks the White King's end." },
    { id:'t6', after:'t5',
      zh_t:"白王终局", zh_b:"在世界树下终结千年权位之争，送绘梨衣回家。", zh_o:"握住她的手，别让她独自走进雨里。", zh_r:"你已成为真正的屠龙者。",
      en_t:"The White King's End", en_b:"End the millennial struggle beneath the World Tree; walk Eri home.", en_o:"Hold her hand — don't let her walk into the rain alone.", en_r:"You have become a true dragon-slayer." }
  ];

  // 学院邮箱
  var EMAILS = [
    { id:'m0', from:'昂热 · 校长', tag:'system',
      zh_sub:"欢迎来到卡塞尔学院", zh_body:"明非（及每一位新血）：当你读到这封信，说明钟声已为你敲响。卡塞尔不生产英雄，它只打磨那些愿意为同伴挡在龙类面前的人。你的路，从这里开始。",
      en_sub:"Welcome to Cassell College", en_body:"Mingfei (and every new blood): if you read this, the bells have tolled for you. Cassell makes no heroes; it only hones those willing to stand before dragons for their friends. Your road begins here." },
    { id:'m1', from:'曼施坦因教授', tag:'report',
      zh_sub:"你的血统鉴定报告", zh_body:"初步序列显示：S 级潜力，言灵尚未稳定。建议持续监测。另——你哥哥路鸣泽的档案被加密至最高权限，执行部拒绝透露细节。",
      en_sub:"Your Bloodline Report", en_body:"Preliminary sequence: S-class potential, spirit unstable. Continuous monitoring advised. Also — your brother Lu Mingze's file is encrypted at top clearance; the Execution Bureau refused details." },
    { id:'m2', from:'陈墨瞳 · 诺诺', tag:'student',
      zh_sub:"学生会邀请", zh_body:"小衰鬼，听说过学生会吗？凯撒说你有点意思。周五夜，狮心会 vs 学生会的橄榄球赛，来看热闹——顺便，别死在场上。",
      en_sub:"Student Union Invite", en_body:"Loser, ever heard of the Student Union? Caesar says you're interesting. Friday night,狮心会 vs Student Union rugby — come watch. And try not to die on the field." },
    { id:'m3', from:'楚子航', tag:'lionheart',
      zh_sub:"狮心会", zh_body:"路明非：我在图书馆留了镰鼬的训练笔记。夏弥的事……如果有一天你发现身边的人是龙，希望你能比我更温柔。",
      en_sub:"The Lionheart Society", en_body:"Lu Mingfei: I left Kamaitachi training notes in the library. About Xia Mi… if one day you find someone beside you is a dragon, I hope you can be gentler than I was." },
    { id:'m4', from:'路鸣泽', tag:'contract',
      zh_sub:"契约", zh_body:"哥哥，七宗罪我替你保管着。想借吗？租金很便宜——只要四分之一条命。随时找我，我都在你心里。",
      en_sub:"The Pact", en_body:"Brother, I've kept the Seven Sins safe for you. Want to borrow them? The rent is cheap — just a quarter of your life. Find me anytime; I'm always in your heart." },
    { id:'m5', from:'上杉绘梨衣', tag:'eri',
      zh_sub:"Sakura", zh_body:"Sakura，今天的东京塔很好看。我把红白的护腕留给你。如果下雨，记得打伞，别让肩膀淋湿。",
      en_sub:"Sakura", en_body:"Sakura, Tokyo Tower was beautiful today. I left you the red-white wristband. If it rains, hold the umbrella — don't let your shoulder get wet." },
    { id:'m6', from:'执行部', tag:'mission',
      zh_sub:"一级行动令 · 东京", zh_body:"目标：源氏重工 B4 层。确认白王容器状态。危险性评定：灭世级。S 级学员路明非、楚子航、凯撒编入同一小队。",
      en_sub:"Level-1 Op · Tokyo", en_body:"Objective: Genji Heavy Industries B4. Confirm White King vessel status. Threat: apocalyptic. S-class Mingfei, Zihang, Caesar in one squad." }
  ];
  /* ============ 剧情知识库（加权打分匹配） ============ */
  // kw: 主关键词（命中加权高）；aliases: 别名/昵称（命中加权低）；more: 追问内容；page: 站内导航
  var KB = [
    { id:'mingfei', kw:['路明非','明非','mingfei'], aliases:['明妃','衰小孩','废柴','sakura'],
      zh:"路明非——卡塞尔学院 S 级混血种，自称「衰小孩」的普通少年。他在青铜城第一次为一条叫他「哥哥」的小龙落泪，在东京塔把红白护腕系在绘梨衣腕上，为救所有人一次次向路鸣泽租借四分之一条命。",
      en:"Lu Mingfei — an S-class hybrid at Cassell who calls himself a 'loser'. He wept in Bronze City for a little dragon that called him 'brother', tied the red-white wristband on Eri beneath Tokyo Tower, and leased a quarter of his life to Lu Mingze again and again to save everyone.",
      more:[
        { zh:"他的言灵并不稳定——早期最常用的是「镰鼬」（序列号59），但他真正的力量来自路鸣泽的租借：每交换一次，都是一次置之死地而后生的豪赌。",
          en:"His spirit is unstable — early on he leans on Kamaitachi (Seq. 59), but his true power comes from Lu Mingze's leases: each trade is a life-or-death gamble." },
        { zh:"东京的雨里，绘梨衣叫他 Sakura。那是他这一生听过最好听的名字，也是他再也没能亲口答应的约定。",
          en:"In Tokyo's rain, Eri called him Sakura — the sweetest name he ever heard, and a promise he could never answer in person." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 路明非', en:'Dossier · Lu Mingfei' } },

    { id:'zihang', kw:['楚子航','子航','zihang'], aliases:['面瘫','楚师兄','君焰'],
      zh:"楚子航——狮心会会长，A 级混血种，言灵·君焰。他追猎奥丁只为找回失踪的父亲，也在夏弥身上学会了「比屠龙更难的是温柔」。",
      en:"Chu Zihang — Lionheart president, A-class, Spirit · King's Inferno. He hunts Odin to find his lost father, and through Xia Mi learned that 'gentler than slaying is harder'.",
      more:[
        { zh:"地铁站的那一晚，他识破了夏弥的双生身份。他没有立刻出刀——因为那一刻他明白，这世上有些刀，出了就收不回来。",
          en:"That night in the subway he saw Xia Mi's twin truth. He didn't strike at once — because he understood some blades, once drawn, can never be sheathed." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 楚子航', en:'Dossier · Chu Zihang' } },

    { id:'caesar', kw:['凯撒','恺撒','caesar'], aliases:['加图索','学生会主席','黄金狮子'],
      zh:"凯撒·加图索——学生会主席，骄傲的贵族之子，言灵·吸血镰。他从把路明非当笑柄，到在东京与他、楚子航结为生死兄弟。他爱诺诺，也把「屠龙者的荣光」扛在肩上。",
      en:"Caesar Gattuso — Student Union president, proud noble heir, Spirit · Bloodsucking Scythe. From mocking Mingfei to a life-or-death brotherhood with him and Zihang in Tokyo, he loves Nono and carries 'the glory of dragon-slayers'.",
      page:{ href:'characters.html', zh:'人物档案 · 凯撒', en:'Dossier · Caesar' } },

    { id:'nono', kw:['诺诺','陈墨瞳','nono'], aliases:['红发巫女','先知'],
      zh:"陈墨瞳（诺诺）——恺撒的妻子，红发巫女，言灵·先知。她总在路明非最狼狈时递来一只手，也总是第一个看穿他心事的人。",
      en:"Chen Motong (Nono) — Caesar's wife, the red-haired witch, Spirit · Prophet. She always lends a hand when Mingfei is at his lowest, and is the first to see through him.",
      page:{ href:'characters.html', zh:'人物档案 · 诺诺', en:'Dossier · Nono' } },

    { id:'eri', kw:['绘梨衣','上杉绘梨衣','eri'], aliases:['权天使','白王容器','sakura','樱花'],
      zh:"上杉绘梨衣——白王容器「权天使」，源稚生与源稚女的妹妹。她不会说话，却把整本《东京爱情故事》画给 Sakura 看。东京塔下，她把红白护腕留给了路明非。",
      en:"Uesugi Eri — the White King vessel 'Power Angel', sister of Yubetsu and Minamoto. Unable to speak, she drew a whole 'Tokyo Love Story' for her Sakura. Beneath Tokyo Tower she left Mingfei her red-white wristband.",
      more:[
        { zh:"她只能通过写字与人交流，可她的世界比任何人都干净：一罐可乐、一场烟花、一个叫 Sakura 的人，就够她快乐一整天。",
          en:"She could only communicate in writing, yet her world was cleaner than most: a can of cola, fireworks, a person called Sakura — enough to make her happy all day." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 绘梨衣', en:'Dossier · Eri' } },

    { id:'mingze', kw:['路鸣泽','鸣泽','mingze'], aliases:['魔鬼','弟弟','四分之一'],
      zh:"路鸣泽——路明非的「弟弟」，栖身在他体内的魔鬼。他锻造了七宗罪，以四分之一条命为租金，一次次把哥哥从绝境里拉回来。",
      en:"Lu Mingze — Mingfei's 'brother', a devil within him. He forged the Seven Sins and, for a quarter of a life, pulls his brother back from death again and again.",
      more:[
        { zh:"「哥哥，想活下去吗？四分之一条命，很便宜。」——每一次他出现，都意味着路明非已经退无可退。",
          en:"'Brother, want to live? A quarter of a life — cheap.' Every time he appears, it means Mingfei has nowhere left to run." }
      ],
      page:{ href:'sins.html', zh:'七宗罪 · 权与力', en:'Seven Sins' } },

    { id:'angers', kw:['昂热','校长','angers'], aliases:['希尔伯特','千年屠龙者'],
      zh:"昂热——卡塞尔学院校长，初代狮心会唯一幸存者，千年屠龙者。他追猎四大龙王，也把最后的希望寄托在路明非身上。",
      en:"Angers — Cassell's headmaster, sole survivor of the first Lionheart, a millennial dragon-slayer. He hunts the Four Kings and pins his last hope on Mingfei.",
      more:[
        { zh:"他的言灵是「时间零」（序列号07）——在时间几乎静止的世界里，他可以一个人对抗一支军团。",
          en:"His spirit is Time Zero (Seq. 07) — in a world where time nearly stops, he can face an army alone." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 昂热', en:'Dossier · Angers' } },
    { id:'xiami', kw:['夏弥','耶梦加得','xiami','jormungandr'], aliases:['小龙女','龙女','芬里厄的姐姐'],
      zh:"夏弥（耶梦加得）——大地与山之王的双生之一，化身人类少女潜入卡塞尔学院。她在地铁的尼伯龙根里藏着弟弟芬里厄，也在地铁站被楚子航识破。最后一刻她挡下了那一刀：因为我爱你，所以我是世界上最厉害的龙。",
      en:"Xia Mi (Jörmungandr) — one of the Earth & Mountain King's twins, a human girl infiltrating Cassell. She hid her brother Fenrir in the Nibelungen beneath the subway, and was found out by Zihang. At the last moment she took the blade: because I loved you, I am the most powerful dragon in the world.",
      more:[
        { zh:"她笨拙地学着做人：装失忆住到楚子航隔壁，学写字，学微笑。可龙王终究是龙王——她唯一没学会的，是放弃弟弟。",
          en:"She clumsily learned to be human: faking amnesia, moving next door to Zihang, learning to write and smile. But a King is still a King — the one thing she never learned was abandoning her brother." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 夏弥', en:'Dossier · Xia Mi' } },

    { id:'zero', kw:['零','zero'], aliases:['冰海王女','居合'],
      zh:"零——卡塞尔学院执行部王牌，美得近乎非人的少女，黑色风衣下藏着一柄短刀，居合一闪即可斩落龙类。她的血统高到让鉴定仪器失语，是学院最深的一道谜题。",
      en:"Zero — the ace of Cassell's execution department, beautiful almost beyond human, a short blade beneath her black windbreaker. Her bloodline is so pure the testing instruments fall silent — the college's deepest riddle.",
      page:{ href:'characters.html', zh:'人物档案 · 零', en:'Dossier · Zero' } },

    { id:'yubetsu', kw:['源稚生','稚生','yubetsu'], aliases:['执行部部长','绘梨衣的哥哥'],
      zh:"源稚生——卡塞尔执行部部长，绘梨衣的兄长。他背着学院最黑暗的工作，把妹妹护在身后，却终究没能阻止 4 月 4 日的献祭。",
      en:"Yubetsu — head of the Execution Bureau, Eri's brother. He carried the college's darkest work, shielded his sister — yet could not stop the 4/4 sacrifice.",
      more:[
        { zh:"他与双生弟弟源稚女（风间琉璃）的命运同样凄烈：一个继承屠龙的职责，一个被白王血裔选中，两兄弟最后都成了那场千年棋局里的棋子。",
          en:"His twin brother Yuzhinyu (Kazama Ruri) shares the tragedy: one inherits the duty to slay, the other is chosen by the White King's blood — both pawns in a millennial game." }
      ],
      page:{ href:'characters.html', zh:'人物档案 · 绘梨衣', en:'Dossier · Eri' } },

    { id:'yuzhinyu', kw:['源稚女','风间琉璃','琉璃'], aliases:['王将','白王血裔'],
      zh:"源稚女——源稚生的双生弟弟，化名「风间琉璃」登台唱戏。他是白王血裔的另一枚棋子，美得妖冶，也苦得彻骨。",
      en:"Yuzhinyu — Yubetsu's twin brother, performing as Kazama Ruri. Another pawn of the White King's blood: bewitchingly beautiful, bitterly doomed." },

    { id:'herzog', kw:['赫尔佐格','herzog','邦达列夫'], aliases:['王将','博士'],
      zh:"赫尔佐格——龙族Ⅲ《黑月之潮》的大反派，真身是潜伏在卡塞尔学院的 S 级混血种邦达列夫教授，代号「王将」。他在源氏重工地底谋划白王复活，最终被七宗罪了结。",
      en:"Herzog — the great villain of Vol.3 Dark Moon Tide, in truth Professor Bondarev, an S-class hybrid hiding in Cassell, codename 'the General'. He plotted the White King's resurrection beneath Genji Heavy Industries and was ended by the Seven Sins.",
      more:[
        { zh:"他比任何龙王都更像「人」——贪婪、算计、渴望永生。路明非说：他不是龙，他只是把自己活成了怪物。",
          en:"He was more 'human' than any dragon — greedy, scheming, craving immortality. Mingfei said: he isn't a dragon; he just made himself a monster." }
      ] },

    { id:'constantine', kw:['康斯坦丁','constantine'], aliases:['小龙','青铜与火'],
      zh:"康斯坦丁——青铜与火之王的双生幼体，青铜城里苏醒的小龙。他叫路明非「哥哥」，最后在明非怀里化作灰烬——那是路明非第一次为一条龙流泪。",
      en:"Constantine — the Bronze & Fire King's twin, the little dragon who woke in Bronze City. He called Mingfei 'brother' and turned to ash in his arms — the first time Mingfei ever wept for a dragon.",
      more:[
        { zh:"「哥哥……我们都要死了。」——他把最后的话留给路明非，然后安静地碎成赤红的尘埃。",
          en:"'Brother… we're both going to die.' — He left those last words to Mingfei, then quietly fell into crimson ash." }
      ] },

    { id:'fenrir', kw:['芬里厄','fenrir'], aliases:['夏弥的弟弟','地底巨龙'],
      zh:"芬里厄——大地与山之王的双生之一，夏弥（耶梦加得）的弟弟，沉睡于地铁站下方尼伯龙根里的巨龙。夏弥为他隐瞒身份，也为他走完最后的路。",
      en:"Fenrir — one of the Earth & Mountain King's twins, Xia Mi's brother, a dragon sleeping in the Nibelungen beneath the subway. Xia Mi hid her identity for him and walked her last road for him." },

    { id:'odin', kw:['奥丁','odin'], aliases:['死神','八足马','单眼面具'],
      zh:"奥丁——骑八足神马、戴单眼面具的「死神」。他在雨夜高架桥上带走了楚子航的父亲楚天骄，也留下楚子航一生的执念。",
      en:"Odin — the 'death-god' who rides an eight-legged horse behind a one-eyed mask. On a rainy viaduct he took Chu Zihang's father, leaving Zihang a lifelong obsession.",
      page:{ href:'characters.html', zh:'人物档案 · 楚子航', en:'Dossier · Chu Zihang' } },

    { id:'tianjiao', kw:['楚天骄','tianjiao'], aliases:['楚子航的父亲','迈巴赫'],
      zh:"楚天骄——楚子航之父，迈巴赫的方向盘后。他把儿子锁进车里，独自走向雨中的奥丁；世界随后把他的存在从所有人的记忆里抹去，只有楚子航还记得那双手。",
      en:"Chu Tianjiao — Zihang's father, behind the Maybach wheel. He locked his son in the car and walked alone toward Odin in the rain; the world later erased him from every memory but Zihang's." },

    { id:'bronze', kw:['青铜城','青铜城之战','bronze'], aliases:['青铜巨卵','火之晨曦'],
      zh:"青铜城——龙族Ⅰ《火之晨曦》的终局战场。沉睡的青铜巨卵、赤红的烈焰，以及一声「哥哥」——路明非在这里第一次握住了弑王的力量，也第一次为一条龙流泪。",
      en:"Bronze City — the final battlefield of Vol.1 Dawn of Fire. The slumbering bronze egg, crimson flames, and a single 'brother' — here Mingfei first grasped king-slaying power, and first wept for a dragon.",
      more:[
        { zh:"康斯坦丁在他怀里碎成赤红的尘埃。昂热说：历史总是这样开始——一个会哭的孩子，举起弑王的剑。",
          en:"Constantine crumbled to crimson ash in his arms. Angers said: history always begins so — a weeping child raising the king-slaying blade." }
      ],
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅰ', en:'Volumes · Vol.1' } },
    { id:'tokyotower', kw:['东京塔','tokyo tower'], aliases:['4月4日','献祭'],
      zh:"东京塔——龙族Ⅲ的告别之地。4 月 4 日，绘梨衣把红白护腕留给 Sakura：「我们还能再来吗？」——雨里的人，再没回来。",
      en:"Tokyo Tower — the farewell of Vol.3. On 4/4, Eri left the red-white wristband for her Sakura: 'Can we come back again?' — she never returned from the rain.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅲ', en:'Volumes · Vol.3' } },

    { id:'genji', kw:['源氏重工','genji'], aliases:['重工','蛇岐八家'],
      zh:"源氏重工——东京蛇岐八家的据点，地下埋藏着神遗产与白王容器。赫尔佐格的阴谋在这里揭晓，七宗罪在此了结篡位者。",
      en:"Genji Heavy Industries — the stronghold of the Snake-Octad families in Tokyo, beneath which lie the God's Legacy and the White King vessel. Herzog's plot unravels here; the Seven Sins end the usurper here." },

    { id:'nibelungen', kw:['尼伯龙根','nibelungen'], aliases:['神国','龙族的隐藏世界'],
      zh:"尼伯龙根——龙族创造的隐藏世界，独立于人类时空的「神国」。夏弥的弟弟芬里厄就沉睡于地铁站之下的尼伯龙根中。",
      en:"Nibelungen — a hidden world created by dragons, a 'realm of gods' outside human time. Xia Mi's brother Fenrir sleeps in the Nibelungen beneath the subway." },

    { id:'worldtree', kw:['世界树','world tree'], aliases:['白王终局','最终权位'],
      zh:"世界树——白王终局的舞台。千年权位之争在树影下收束，绘梨衣把路让给了 Sakura，路明非在这里送她回家。",
      en:"The World Tree — stage of the White King's end. The millennial struggle closes beneath its shadow; Eri gives the road to Sakura, and Mingfei walks her home." },

    { id:'icevault', kw:['冰窖','ice vault'], aliases:['封印库','七宗罪封印'],
      zh:"冰窖——卡塞尔学院地下的封印库，权与力之七宗罪曾在此沉睡。解封那天，路鸣泽开出了四分之一条命的租金。",
      en:"The Ice Vault — the sealed vault beneath Cassell where the Seven Sins slept. The day they were unsealed, Lu Mingze set the price: a quarter of a life.",
      page:{ href:'sins.html', zh:'七宗罪 · 权与力', en:'Seven Sins' } },

    { id:'viaduct', kw:['高架桥','viaduct','迈巴赫'], aliases:['雨夜','奥丁之渊'],
      zh:"高架桥——雨夜、迈巴赫、八足神马。楚天骄在这里走向奥丁，楚子航从此再没有「普通的早晨」。这是龙族Ⅳ《奥丁之渊》的核心谜题。",
      en:"The viaduct — rain, a Maybach, an eight-legged horse. Chu Tianjiao walked toward Odin here, and Zihang lost every 'ordinary morning' after. The core mystery of Vol.4 Odin's Abyss." },

    { id:'secret', kw:['秘党','secret party'], aliases:['屠龙者联盟','学院组织'],
      zh:"秘党——掌控卡塞尔学院的古老组织，世界屠龙者的联盟。昂热是它的旗帜，执行部是它的刀。",
      en:"The Secret Party — the ancient organization behind Cassell, alliance of the world's dragon-slayers. Angers is its banner; the Execution Bureau is its blade.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 秘党', en:'Institutions · Secret Party' } },

    { id:'execution', kw:['执行部','execution bureau'], aliases:['武装力量','源稚生'],
      zh:"执行部——卡塞尔学院的武装力量，专司高危任务：潜入、猎杀、回收龙类遗产。源稚生、零都曾隶属其中。",
      en:"The Execution Bureau — Cassell's armed force for high-risk ops: infiltration, hunting, and recovering dragon relics. Yubetsu and Zero both served there.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 执行部', en:'Institutions · Execution Bureau' } },

    { id:'equipment', kw:['装备部','equipment'], aliases:['疯子工程师','实验室'],
      zh:"装备部——卡塞尔最神秘的部门，一群疯狂的工程师。他们的武器偶尔爆炸，但也偶尔能救你一命。",
      en:"The Equipment Department — Cassell's most mysterious workshop of mad engineers. Their weapons sometimes explode — and sometimes save your life.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 装备部', en:'Institutions · Equipment Dept.' } },

    { id:'union', kw:['学生会','student union'], aliases:['社团','凯撒的社团'],
      zh:"学生会——与狮心会对峙的社团，主席凯撒。每年与狮心会的橄榄球赛是学院的盛事，也是贵族与精英的战场。",
      en:"The Student Union — the society rivaling the Lionheart, led by Caesar. Its annual rugby match against the Lionheart is a college institution.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 学生会', en:'Institutions · Student Union' } },

    { id:'hybrid', kw:['混血种','hybrid'], aliases:['龙血','异类'],
      zh:"混血种——人与龙的混血，龙血在他们体内沉眠。血统越纯，力量越危险——也越接近疯狂。卡塞尔学院就是为守护与猎杀他们而存在的。",
      en:"Hybrids — human-dragon blends with sleeping dragon blood. The purer the bloodline, the deadlier and more dangerous the power. Cassell exists to shelter and hunt them." },

    { id:'bloodtest', kw:['血统鉴定','血统测试','血统检测','blood test'], aliases:['血统等级','S级','鉴定仪式','基因序列'],
      zh:"血统鉴定——卡塞尔入学第一关。仪器读取你基因里的龙血浓度，从 S 级到普通人类。想看看你自己的结果？首页的鉴定仪式等着你。",
      en:"The bloodline test — the first threshold of Cassell. The scanner reads the dragon blood in your genes, from S-class to ordinary human. Want your own result? The ritual awaits on the homepage.",
      page:{ href:'index.html#ritual', zh:'首页 · 血统鉴定', en:'Home · Blood Test' } },
    { id:'quarter', kw:['四分之一','quarter'], aliases:['灵魂契约','租金'],
      zh:"四分之一条命——路鸣泽的租金。「哥哥，想活下去吗？四分之一条命，很便宜。」每次哥哥陷入绝境，他都会出现在心里，开出同样的价码。",
      en:"A quarter of a life — Lu Mingze's rent. 'Brother, want to live? A quarter of a life — cheap.' Every time Mingfei is cornered, he appears in his heart with the same price.",
      more:[
        { zh:"代价不可逆。路明非用一次次「交换」换回同伴的命，也把自己一点点交到魔鬼手里——可他始终没后悔。",
          en:"The price is irreversible. Mingfei traded again and again to bring his friends back, slowly giving himself to the devil — yet he never regretted it." }
      ],
      page:{ href:'items.html', zh:'装备部仓库 · 契约书', en:'Arsenal · The Pact' } },

    { id:'wristband', kw:['红白护腕','护腕','wristband'], aliases:['红白','东京塔的约定'],
      zh:"红白护腕——路明非送给绘梨衣的护腕。东京塔下，她把护腕留下，把名字留给他——Sakura，我们还能再来吗？",
      en:"The red-white wristband — the band Mingfei gave Eri. Beneath Tokyo Tower she left it behind and left him her name — Sakura, can we come back again?",
      page:{ href:'items.html', zh:'装备部仓库 · 红白护腕', en:'Arsenal · Wristband' } },

    { id:'spirit', kw:['言灵','spirit'], aliases:['序列号','咒语','codex','图鉴'],
      zh:"言灵——混血种觉醒后释放的先天能力，各有序列号：从「蛇」（22）、「镰鼬」（59）、「君焰」（71）到「审判」（111）、「归墟」（113）、「烛龙」（114），甚至「龙语」（120）。你的血统越高，能驾驭的言灵越危险。",
      en:"A Spirit — the innate power a hybrid releases upon awakening, each with a sequence number: from Serpent (22), Kamaitachi (59), King's Inferno (71) to Judgment (111), Guixu (113), Zhulong (114), even Dragon Speech (120). Higher bloodline, deadlier spirit.",
      more:[
        { zh:"名场面盘点：楚子航的君焰斩出焚城之剑；路明非的镰鼬听风辨位；昂热的时间零让他一个人屠一支军团；而绘梨衣的「审判」——她一生只对自己用过。",
          en:"Famous scenes: Zihang's Inferno slashes a burning sword; Mingfei's Kamaitachi reads the wind; Angers' Time Zero lets him face an army alone; and Eri's Judgment — she only ever used it on herself." }
      ],
      page:{ href:'codex.html', zh:'言灵图鉴 · 36 条', en:'Spirit Codex · 36' } },

    { id:'cassell', kw:['卡塞尔','学院','cassell'], aliases:['卡塞尔学院','芝加哥'],
      zh:"卡塞尔学院——藏在芝加哥的混血种学府，钟声为屠龙者而鸣。这里有狮心会与学生会的 rivalry，也有无数少年在龙类面前挡在同伴身前的故事。",
      en:"Cassell College — the hybrid academy hidden in Chicago, its bells tolling for dragon-slayers. Home to the Lionheart/Student-Union rivalry and countless stories of boys shielding friends from dragons.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 卡塞尔学院', en:'Institutions · Cassell College' } },

    { id:'lionheart', kw:['狮心会','lionheart'], aliases:['精英社团','楚子航的社团'],
      zh:"狮心会——由昂热创立、楚子航执掌的精英社团，承袭初代屠龙者的荣光。与学生会的橄榄球赛是每年的固定节目。",
      en:"The Lionheart Society — elite club founded by Angers, led by Chu Zihang, heir to the first dragon-slayers' glory. Its rugby match vs the Student Union is annual.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 狮心会', en:'Institutions · Lionheart' } },

    { id:'tokyo', kw:['东京','tokyo'], aliases:['日本','黑月之潮'],
      zh:"东京——龙族Ⅲ《黑月之潮》的舞台。源氏重工、东京塔、4 月 4 日的献祭，以及 Sakura 与绘梨衣的告别，都在这里的雨里发生。",
      en:"Tokyo — stage of Vol.3 Dark Moon Tide. Genji Heavy Industries, Tokyo Tower, the 4/4 sacrifice, and Sakura's farewell to Eri all happen in its rain.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅲ', en:'Volumes · Vol.3' } },

    { id:'seven', kw:['七宗罪','七宗','seven','sins'], aliases:['魔剑','弑王之刃'],
      zh:"权与力之七宗罪——路鸣泽以龙王之骨锻造的七柄魔剑，各对应一罪：傲慢、妒忌、暴怒、懒惰、贪婪、饕餮、色欲。它们斩杀过四大龙王，也将在东京了结篡位者赫尔佐格。",
      en:"The Seven Deadly Sins — seven demonic swords Lu Mingze forged from dragon-king bones, each a sin: Pride, Envy, Wrath, Sloth, Greed, Gluttony, Lust. They slew the Four Kings and ended the usurper Herzog in Tokyo.",
      more:[
        { zh:"七柄剑中，贪婪、饕餮、色欲三柄始终空置——它们沉默地见证着一场未竟的加冕。",
          en:"Of the seven blades, Greed, Gluttony and Lust have always hung empty — silently witnessing an unfinished coronation." }
      ],
      page:{ href:'sins.html', zh:'七宗罪 · 权与力', en:'Seven Sins' } },

    { id:'fourkings', kw:['四大龙王','龙王','kings','four'], aliases:['双生','初代种'],
      zh:"四大龙王——青铜与火、白王·天空、大地与山、海洋与水。每一位都是双子相食的悲剧，而昂热追猎他们已逾千年。",
      en:"The Four Kings — Bronze & Fire, White King · Sky, Earth & Mountain, Sea & Water. Each is a tragedy of twin-devouring; Angers has hunted them for over a thousand years.",
      more:[
        { zh:"龙王加冕的规则冷酷而古老：双生必有一方吞食另一方，才能成为完整的王。所以每一代龙王，都从一场手足相残开始。",
          en:"The law of coronation is cold and ancient: of twins, one must devour the other to become a complete King. Thus every King begins with fratricide." }
      ],
      page:{ href:'kings.html', zh:'四大龙王 · 双生档案', en:'Four Kings · Dossiers' } },

    { id:'whiteking', kw:['白王','white'], aliases:['天空','精神','白王血裔'],
      zh:"白王——四王之首，掌天空与精神，被黑王亲手斩杀。其血引发千年权位之争，最终在绘梨衣与赫尔佐格身上迎来终局。",
      en:"The White King — first of the Four, master of sky and mind, slain by the Black King. Its blood drove a millennial struggle, ending with Eri and Herzog." },

    { id:'blackking', kw:['黑王','nidhogg','black'], aliases:['尼德霍格','龙族之祖'],
      zh:"黑王尼德霍格——龙族之祖，所有龙血的来源。七宗罪本为弑黑王而生，却被路鸣泽先行借给了哥哥。",
      en:"The Black King Nidhogg — progenitor of all dragons, source of every dragon blood. The Seven Sins were forged to kill him, yet Mingze lent them to his brother first." },

    { id:'novel', kw:['龙族','小说','江南'], aliases:['原著','系列'],
      zh:"《龙族》是作家江南创作的奇幻小说系列，共五卷：《火之晨曦》《悼亡者之瞳》《黑月之潮》《奥丁之渊》《悼亡者的归来》。主线是混血种少年路明非的成长——从衰小孩到屠龙者。",
      en:"Dragon Raja is Jiang Nan's fantasy series in five volumes: Dawn of Fire, The Mourner's Eyes, Dark Moon Tide, Odin's Abyss, and Return of the Mourner. Its spine is Lu Mingfei's growth from loser to dragon-slayer.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族 1—5', en:'Volumes · 1—5' } },

    { id:'vol1', kw:['火之晨曦','龙族一','龙族1'], aliases:['第一卷','青铜城'],
      zh:"龙族Ⅰ《火之晨曦》——路明非收到卡塞尔学院的录取通知书，在青铜城经历第一次屠龙。康斯坦丁之死，让他明白：屠龙，是要还命的。",
      en:"Vol.1 Dawn of Fire — Mingfei receives Cassell's admission letter and faces his first dragon at Bronze City. Constantine's death teaches him: slaying dragons demands a life in return.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅰ', en:'Volumes · Vol.1' } },

    { id:'vol2', kw:['悼亡者之瞳','龙族二','龙族2'], aliases:['第二卷','夏弥'],
      zh:"龙族Ⅱ《悼亡者之瞳》——夏弥与芬里厄，地铁站的尼伯龙根。楚子航在这里学会「比屠龙更难的是温柔」，也在这里失去一个人。",
      en:"Vol.2 The Mourner's Eyes — Xia Mi and Fenrir, the Nibelungen beneath the subway. Zihang learns that 'gentler than slaying is harder' — and loses someone he loves.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅱ', en:'Volumes · Vol.2' } },

    { id:'vol3', kw:['黑月之潮','龙族三','龙族3'], aliases:['第三卷','东京','绘梨衣'],
      zh:"龙族Ⅲ《黑月之潮》——东京雨夜，绘梨衣与 Sakura，源氏重工地底的白王阴谋。路明非在这里亲手送别最想保护的人。",
      en:"Vol.3 Dark Moon Tide — a rainy Tokyo, Eri and Sakura, the White King's plot beneath Genji Heavy Industries. Here Mingfei bids farewell to the one he most wanted to protect.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅲ', en:'Volumes · Vol.3' } },

    { id:'vol4', kw:['奥丁之渊','龙族四','龙族4'], aliases:['第四卷','高架桥','楚天骄'],
      zh:"龙族Ⅳ《奥丁之渊》——高架桥的真相浮出水面：楚子航的父亲楚天骄被奥丁带走，也从所有人的记忆里被抹去。",
      en:"Vol.4 Odin's Abyss — the truth of the viaduct surfaces: Zihang's father was taken by Odin and erased from every memory.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅳ', en:'Volumes · Vol.4' } },

    { id:'vol5', kw:['悼亡者的归来','龙族五','龙族5'], aliases:['第五卷','世界树'],
      zh:"龙族Ⅴ《悼亡者的归来》——世界树下的终局，白王血裔的千年之争落幕。路明非握紧七宗罪，也握紧了他想守护的一切。",
      en:"Vol.5 Return of the Mourner — the end beneath the World Tree, where the White King's millennial struggle closes. Mingfei grips the Seven Sins — and everything he means to protect.",
      page:{ href:'story.html', zh:'情节长卷 · 龙族Ⅴ', en:'Volumes · Vol.5' } },

    { id:'snake8', kw:['蛇岐八家','蛇岐'], aliases:['日本混血种','源氏'],
      zh:"蛇岐八家——日本混血种世界的统治家族集团，源氏重工与上杉家都出自其中。它是龙族Ⅲ的主要舞台，也是卡塞尔学院复杂旧账的另一端。",
      en:"The Snake-Octad — the ruling hybrid families of Japan, from which Genji Heavy Industries and the Uesugi house descend. The main stage of Vol.3, and the other side of Cassell's tangled history.",
      page:{ href:'orgs.html', zh:'学院机构簿 · 蛇岐八家', en:'Institutions · Snake-Octad' } },

    { id:'timeline', kw:['编年史','时间线','timeline','chronology'], aliases:['历史','年表','龙族史'],
      zh:"龙族编年史——从黑王尼德霍格诞生、白王被弑，到千年权位之争、青铜城、夏弥与芬里厄、东京，直至世界树终局。整条时间线已整理成独立页面。",
      en:"The Dragon Raja Chronicle — from Nidhogg's birth and the White King's fall, through the millennial struggle, Bronze City, Xia Mi & Fenrir, Tokyo, to the World Tree finale. Now a standalone timeline.",
      page:{ href:'timeline.html', zh:'龙族编年史 · 时间线', en:'Chronicle · Timeline' } },

    { id:'quoteslib', kw:['语录图书馆','quote library'], aliases:['台词库','金句库'],
      zh:"语录图书馆——按人物、主题、卷次整理了数十条经典台词，支持搜索与收藏；每日一句按日期轮换，EVA 的「语录」命令也指向这里。",
      en:"The Quote Library — dozens of classic lines organized by speaker, theme and volume, with search and favorites; a daily quote rotates by date, and EVA's 'quote' command points here.",
      page:{ href:'quotes.html', zh:'语录图书馆', en:'Quote Library' } },

    { id:'blackcard', kw:['黑卡','录取通知','black card'], aliases:['激活码','录取通知书'],
      zh:"黑卡——卡塞尔学院的录取凭证，通往混血种世界的车票。激活码一旦启用，便再无回头。",
      en:"The Black Card — Cassell's admission token, a ticket to the hybrid world. Once the activation code is used, there is no turning back.",
      page:{ href:'items.html', zh:'装备部仓库 · 黑卡', en:'Arsenal · Black Card' } },

    { id:'maybach', kw:['迈巴赫','maybach'], aliases:['豪车','高架桥的车'],
      zh:"迈巴赫——雨夜高架桥上的老旧豪车，车前站着八足神马。楚天骄在这里走向奥丁，也从此被抹去。",
      en:"The Maybach — the old sedan on the rain-swept viaduct, facing an eight-legged horse. Here Chu Tianjiao walked toward Odin and was erased.",
      page:{ href:'items.html', zh:'装备部仓库 · 迈巴赫', en:'Arsenal · Maybach' } },

    { id:'items', kw:['装备','道具','物品','仓库','arsenal','item'], aliases:['装备部仓库','道具图鉴'],
      zh:"装备部仓库——黑卡、红白护腕、迈巴赫、七宗罪、四分之一条命契约书、尼伯龙根钥匙……每一件藏品都对应一段名场面。",
      en:"The Arsenal — the Black Card, the red-white wristband, the Maybach, the Seven Sins, the quarter-life pact, the Nibelungen key… every relic carries a famous scene.",
      page:{ href:'items.html', zh:'装备部仓库 · 道具图鉴', en:'Arsenal · Item Codex' } },

    { id:'orgs', kw:['机构','组织','学院机构','institution','organization'], aliases:['机构簿','org'],
      zh:"卡塞尔机构簿——秘党、执行部、装备部、狮心会、学生会、蛇岐八家，一家机构一张档案卡：职能、代表人物、经典事件与经典梗。",
      en:"Cassell Institutions — the Secret Party, Execution Bureau, Equipment Department, Lionheart, Student Union and the Snake-Octad: one dossier per institution, with function, key people, classic events and memes.",
      page:{ href:'orgs.html', zh:'学院机构簿', en:'Institutions' } },

    { id:'achievements', kw:['成就','徽章','档案完成度','achievement','badge'], aliases:['收藏','勋章'],
      zh:"混血种档案成就系统——完成血统鉴定、召唤言灵、读完 36 言灵、翻完五卷，即可点亮对应徽章。",
      en:"The achievement system — complete the bloodline test, summon a spirit, read the codex, and flip through all volumes to light up badges.",
      page:{ href:'index.html#ritual', zh:'首页 · 档案完成度', en:'Home · File Progress' } },

    { id:'quiz', kw:['测试','测验','quiz','test','你是龙族中的谁','快问快答'], aliases:['人格测试','答题'],
      zh:"学院测验——「你是龙族中的谁」人格测试，加上 10 题龙族知识快问快答；答完可按得分获得混血种等级，并生成成绩分享卡。",
      en:"The Examination — a 'Who are you in Dragon Raja' personality test plus a 10-question knowledge quiz; score a hybrid rank and generate a shareable score card.",
      page:{ href:'quiz.html', zh:'学院测验', en:'Examination' } }
  ];
  // 经典台词（随机语录）
  var QUOTES = [
    { zh:"凡王之血，必以剑终。", en:"The blood of kings ends by the sword.", who_zh:"—— 龙族 · 卷首", who_en:"— Dragon Raja" },
    { zh:"我们都是小怪兽，总有一天会被正义的奥特曼杀死。", en:"We are all little monsters; one day we'll be killed by the righteous Ultraman.", who_zh:"—— 路明非", who_en:"— Lu Mingfei" },
    { zh:"因为我爱过你……所以我是世界上最厉害的龙。", en:"Because I loved you… I am the most powerful dragon in the world.", who_zh:"—— 夏弥", who_en:"— Xia Mi" },
    { zh:"Sakura，你说我们还能再来这里吗？", en:"Sakura, do you think we can come back here again?", who_zh:"—— 上杉绘梨衣", who_en:"— Uesugi Eri" },
    { zh:"哥哥……我们都要死了。", en:"Brother… we're both going to die.", who_zh:"—— 绘梨衣", who_en:"— Eri" },
    { zh:"每个人心里都有一条龙。", en:"A dragon lives in every heart.", who_zh:"—— 龙族", who_en:"— Dragon Raja" },
    { zh:"孩子，往前走，别回头。", en:"Son, walk forward. Don't look back.", who_zh:"—— 龙族", who_en:"— Dragon Raja" },
    { zh:"如果命运选择了我，那我也可以选择，为谁而活。", en:"If fate chose me, then I can also choose — for whom to live.", who_zh:"—— 路明非", who_en:"— Lu Mingfei" },
    { zh:"哥哥，我们又见面了。", en:"Brother, we meet again.", who_zh:"—— 路鸣泽", who_en:"— Lu Mingze" },
    { zh:"你太笨了，所以我要一直看着你。", en:"You're too clumsy, so I have to keep watching you.", who_zh:"—— 诺诺", who_en:"— Nono" },
    { zh:"世界上有一种生命，它的每一次死亡，都是为了归来。", en:"There is a kind of life whose every death is for the sake of return.", who_zh:"—— 江南 · 龙族", who_en:"— Jiang Nan · Dragon Raja" },
    { zh:"如果全世界都背叛了你，我会站在你身后背叛全世界。", en:"If the whole world betrays you, I will stand behind you and betray the world.", who_zh:"—— 江南 · 龙族", who_en:"— Jiang Nan · Dragon Raja" }
  ];

  /* ============ 状态 ============ */
  var KEY='dr-eva';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
  var S = load();
  S.noticesRead = S.noticesRead||[];
  S.emailsRead = S.emailsRead||[];
  S.extraEmails = S.extraEmails||[];
  S.tasks = S.tasks||{};
  TASKS.forEach(function(tk){ if(!(tk.id in S.tasks)) S.tasks[tk.id] = tk.after ? 'locked' : 'available'; });
  // 修正：若前置已完成，则解锁
  function recompute(){
    TASKS.forEach(function(tk){
      if(tk.after){
        if(S.tasks[tk.after]==='done' && (S.tasks[tk.id]==='locked'||S.tasks[tk.id]==='available')) S.tasks[tk.id]='available';
      }
    });
  }
  recompute(); save(S);

  function taskStatus(id){ return S.tasks[id]||'locked'; }
  function firstAvailable(){
    for(var i=0;i<TASKS.length;i++){ if(taskStatus(TASKS[i].id)==='available'||taskStatus(TASKS[i].id)==='accepted') return TASKS[i]; }
    for(var j=0;j<TASKS.length;j++){ if(taskStatus(TASKS[j].id)!=='done') return TASKS[j]; }
    return null;
  }

  /* ============ 匹配引擎 ============ */
  var ctx={ entry:null, moreIdx:0, lastId:null, lastCount:0 };
  function norm(s){ return String(s||'').toLowerCase().replace(/[\s\u3000]+/g,''); }
  function entryScore(q, e){
    var s=0, matched=0, i, kw, al;
    for(i=0;i<e.kw.length;i++){
      kw=norm(e.kw[i]); if(!kw) continue;
      if(q===kw){ s+=10; matched+=kw.length; }
      else if(q.indexOf(kw)>=0){ s+=(kw.length>=3?3:2); matched+=kw.length; }
      else if(kw.indexOf(q)>=0 && q.length>=2){ s+=1.2; matched+=q.length; }
    }
    for(i=0;i<(e.aliases||[]).length;i++){
      al=norm(e.aliases[i]); if(!al) continue;
      if(q.indexOf(al)>=0){ s+=1.5; matched+=al.length; }
    }
    if(s>0){ s+=2*matched/Math.max(q.length,1); }
    return s;
  }
  function matchKB(input){
    var q=norm(input); if(!q) return null;
    var best=null, bestScore=0, i, sc;
    for(i=0;i<KB.length;i++){
      sc=entryScore(q, KB[i]);
      if(sc>bestScore){ bestScore=sc; best=KB[i]; }
    }
    return (best && bestScore>=2.5) ? { entry:best, score:bestScore } : null;
  }

  /* ============ 挂件 DOM ============ */
  var CHIPS=[
    { cmd:'notice', zh:'通知', en:'Notice' },
    { cmd:'task', zh:'任务', en:'Missions' },
    { cmd:'mail', zh:'邮箱', en:'Inbox' },
    { cmd:'quote', zh:'语录', en:'Quotes' },
    { cmd:'help', zh:'帮助', en:'Help' }
  ];
  function injectWidget(){
    if(document.getElementById('eva-launch')) return;
    var wrap=document.createElement('div'); wrap.id='eva-root';
    wrap.innerHTML =
      '<div id="eva-launch" title="EVA 学院终端">EVA</div>'+
      '<div id="eva-panel" class="hidden">'+
        '<div id="eva-head"><span class="eva-id"><i class="eva-dot"></i> EVA · 学院终端</span><button id="eva-close" aria-label="close">×</button></div>'+
        '<div id="eva-msgs"></div>'+
        '<div id="eva-chips"></div>'+
        '<div id="eva-input-row"><input id="eva-input" autocomplete="off" placeholder="和 EVA 说点什么…"><button id="eva-send">发送</button></div>'+
      '</div>';
    document.body.appendChild(wrap);
    bindWidget();
    renderChips();
    renderTranscript();
  }
  function renderChips(){
    var box=document.getElementById('eva-chips'); if(!box) return;
    box.innerHTML='';
    CHIPS.forEach(function(c){
      var b=document.createElement('button'); b.type='button';
      b.setAttribute('data-cmd', c.cmd);
      b.textContent=L(c);
      box.appendChild(b);
    });
  }

  /* ============ 聊天 ============ */
  var transcript=[]; // {role:'eva'|'user', zh, en, typing?, nav?, ask?}
  function addMsg(role, zh, en){ transcript.push({role:role, zh:zh, en:en}); renderTranscript(); }
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function escAttr(s){ return String(s==null?'':s).replace(/["'<>]/g,function(c){return {'"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[c];}); }
  function renderTranscript(){
    var box=document.getElementById('eva-msgs'); if(!box) return;
    box.innerHTML='';
    transcript.forEach(function(m){
      var d=document.createElement('div'); d.className='eva-msg '+(m.role==='eva'?'eva':'user');
      var html='';
      if(m.role==='eva'){
        html='<span class="eva-av">EVA</span>';
        if(m.typing){
          html+='<span class="eva-bubble eva-typing"><i></i><i></i><i></i></span>';
        } else {
          html+='<span class="eva-bubble">'+escapeHtml(L(m));
          if(m.nav){
            html+='<span class="eva-nav-row"><a class="eva-nav" href="'+escAttr(m.nav.href)+'">'+escapeHtml(L(m.nav))+'</a></span>';
          }
          if(m.ask && m.ask.length){
            html+='<span class="eva-ask-row">';
            m.ask.forEach(function(a){
              html+='<button type="button" class="eva-ask" data-ask-zh="'+escAttr(a.zh)+'" data-ask-en="'+escAttr(a.en)+'">'+escapeHtml(L(a))+'</button>';
            });
            html+='</span>';
          }
          html+='</span>';
        }
      } else {
        html='<span class="eva-ut">'+escapeHtml(L(m))+'</span>';
      }
      d.innerHTML=html;
      box.appendChild(d);
    });
    // 任务/邮件内联按钮
    box.querySelectorAll('[data-task]').forEach(function(b){
      b.onclick=function(){ taskAction(b.getAttribute('data-task'), b.getAttribute('data-act')); };
    });
    box.scrollTop=box.scrollHeight;
  }

  // 延迟回复（先显示"正在输入"）
  function evaSayDelayed(ms, zh, en, opts){
    var m={ role:'eva', zh:zh, en:en, nav:opts&&opts.nav, ask:opts&&opts.ask, typing:true };
    transcript.push(m); renderTranscript();
    setTimeout(function(){ m.typing=false; renderTranscript(); }, ms);
  }
  function evaSay(zh,en){ addMsg('eva',zh,en); }
  function userSay(zh,en){ addMsg('user',zh,en); }
  function ask(zh,en){ userSay(zh,en); route(zh); }

  /* ============ 意图路由 ============ */
  function route(input){
    var s=(input||'').trim();
    var low=s.toLowerCase();
    if(!s) return;
    // 0) 情感 / 系统意图
    if(/^(你好|您好|嗨|哈喽|hello|hi|hey|在吗|早上好|早安|晚上好|晚安|午安)[\s，。!！?？]*$/i.test(s)) return answerGreet();
    if(/^(你是谁|你叫什么|你是谁呀|who are you|eva是谁|eva是什么)[\s?？]*$/i.test(low)) return answerWhoami();
    if(/谢谢|感谢|多谢|thank/.test(low)) return answerThanks();
    if(/我爱你|喜欢你|love you|最喜欢你/.test(low)) return answerLove();
    if(/台词|语录|名言|金句|quote|saying/.test(low)) return cmdQuote();
    // 1) 学院事务意图
    if(/通知|公告|学院通知|notice|announce|bulletin/.test(low)) return cmdNotice();
    if(/任务|委托|执行|quest|task|mission|op\b/.test(low)) return cmdTask();
    if(/邮箱|邮件|信|mail|email|inbox/.test(low)) return cmdMail();
    if(/帮助|怎么用|功能|help|how|what can/.test(low)) return cmdHelp();
    // 2) 情绪向剧情回答（优先于普通知识库）
    if(/绘梨衣.*(死|结局|活|回来|后来|去哪)|(eri).*(die|dead|alive|end|where)/i.test(low)) return answerEriEnding();
    if(/sakura|樱花/.test(low)) return answerSakura();
    // 3) 追问上下文
    if(/然后呢|后来|之后|还有呢|再说|更多|继续|还有吗|接着|more|tell me more|and then|what else/.test(low) && ctx.entry && (ctx.entry.more||[]).length){
      return answerFollowup();
    }
    // 4) 知识库打分匹配
    var m=matchKB(input);
    if(m) return answerEntry(m.entry);
    // 5) 兜底
    answerFallback();
  }

  /* ============ 各类回答 ============ */
  function answerEntry(e){
    ctx.entry=e; ctx.moreIdx=0;
    if(window.ACH && window.ACH.trackTopic) window.ACH.trackTopic(e.id);
    var zh=e.zh, en=e.en;
    if(e.id===ctx.lastId){
      ctx.lastCount++;
      var variants=[
        { zh:"我重新核对了档案：", en:"I re-checked the file: " },
        { zh:"同一份卷宗，换一页给你看：", en:"Same dossier, another page: " },
        { zh:"关于这件事，档案里还有一条补充：", en:"One more addendum from the archive: " }
      ];
      var v=variants[(ctx.lastCount-1)%variants.length];
      zh=v.zh+zh; en=v.en+en;
    } else {
      ctx.lastCount=0;
    }
    ctx.lastId=e.id;
    var opts={ nav:e.page };
    if((e.more||[]).length) opts.ask=[{ zh:'再说点', en:'Tell me more' }];
    evaSayDelayed(360, zh, en, opts);
  }
  function answerFollowup(){
    var e=ctx.entry; if(!e || !(e.more||[]).length){ cmdHelp(); return; }
    var i=ctx.moreIdx % e.more.length; ctx.moreIdx++;
    var m=e.more[i];
    var zh=m.zh, en=m.en;
    if(ctx.moreIdx>=e.more.length){
      zh+='\n（这一页翻完了——想换个人物或话题，随时问我。）';
      en+="\n(That page is done — ask me about another character or topic anytime.)";
    }
    evaSayDelayed(320, zh, en, { nav:e.page });
  }
  function answerGreet(){
    evaSayDelayed(320,
      '你好，混血种。我是卡塞尔学院的人工智能 EVA。\n想查通知、领任务、看邮件，还是聊聊龙族里的人与事？',
      "Hello, hybrid. I'm EVA, Cassell College's AI.\nNotices, missions, inbox — or just chat about Dragon Raja?",
      { ask:[
        { zh:'今天的通知', en:"Today's notices" },
        { zh:'有什么任务', en:'Any missions' },
        { zh:'聊聊夏弥', en:'Tell me about Xia Mi' },
        { zh:'来句台词', en:'A quote' }
      ]});
  }
  function answerWhoami(){
    evaSayDelayed(300,
      '我是 EVA——卡塞尔学院的终端意志。\n我传递通知、发放任务、管理学院邮箱，也保管着龙族档案室里所有人物与剧情。\n输入「帮助」可查看完整功能。',
      "I am EVA — the terminal will of Cassell College.\nI deliver notices, issue missions, run the academy inbox, and keep every Dragon Raja dossier in the archive.\nSay 'help' for the full list.");
  }
  function answerThanks(){
    evaSayDelayed(280,
      '不必谢，混血种。钟声为你而鸣，档案为你而开。\n还有什么想知道的？',
      "No thanks needed, hybrid. The bells toll for you; the archive opens for you.\nAnything else?");
  }
  function answerLove(){
    evaSayDelayed(420,
      '爱是人类最昂贵的言灵。\n像夏弥那样，因爱成为世界上最厉害的龙；像绘梨衣那样，把名字留给一个人。\n——这句话，我替你记在档案里了。',
      "Love is humanity's most expensive spirit.\nLove like Xia Mi, becoming the most powerful dragon in the world; love like Eri, giving your name to one person.\n— I've filed that line for you.");
  }
  function answerSakura(){
    evaSayDelayed(500,
      'Sakura——这是绘梨衣给路明非的名字。\n东京塔下，她问：「Sakura，我们还能再来吗？」他把红白护腕系在她腕上，说一定会的。可雨里的人，再没回来。\n这个故事，在「情节长卷 · 黑月之潮」里。',
      "Sakura — the name Eri gave Lu Mingfei.\nBeneath Tokyo Tower she asked: 'Sakura, can we come back again?' He tied the red-white wristband on her wrist and promised they would. But she never came back from the rain.\nFind the tale in the Volumes · Dark Moon Tide.",
      { nav:{ href:'story.html', zh:'情节长卷 · 黑月之潮', en:'Volumes · Dark Moon Tide' } });
  }
  function answerEriEnding(){
    evaSayDelayed(520,
      '关于绘梨衣的结局——是的，4 月 4 日的献祭里，她把世界留给了 Sakura，自己走进了雨里。\n这个结局让很多人意难平。但你看，爱过的人不会消失：夏弥说，因为爱过你，所以我是世界上最厉害的龙。绘梨衣也一样——她把自己变成了 Sakura 心里的一束光。',
      "About Eri's ending — yes, in the 4/4 sacrifice she left the world to Sakura and walked into the rain.\nIt breaks many hearts. But look: those who are loved never vanish. Xia Mi said: because I loved you, I am the most powerful dragon in the world. Eri, too — she became a light inside Sakura.",
      { nav:{ href:'characters.html', zh:'人物档案 · 绘梨衣', en:'Dossier · Eri' } });
  }
  function answerFallback(){
    evaSayDelayed(500,
      '我听见了你的声音，混血种。我掌管学院的通知、任务与邮箱，也读过卡塞尔档案室里的龙族卷宗。\n你可以试着问我：',
      "I hear you, hybrid. I run the college's notices, tasks and mail — and I've read the Dragon Raja files in the archive.\nTry asking me:",
      { ask:[
        { zh:'夏弥是谁', en:'Who is Xia Mi' },
        { zh:'七宗罪', en:'The Seven Sins' },
        { zh:'绘梨衣', en:'Eri' },
        { zh:'青铜城之战', en:'Battle of Bronze City' },
        { zh:'来句台词', en:'A quote' }
      ]});
  }
  /* ============ 命令 ============ */
  function cmdHelp(){
    evaSay(
      'EVA 学院终端使用指引：\n• 说「通知」— 查看学院公告\n• 说「任务」— 领取并推进执行任务（模拟龙族情节）\n• 说「邮箱」— 打开学院邮件\n• 说「语录」— 随机一句经典台词\n• 直接问我人物 / 七宗罪 / 龙王 / 言灵 / 剧情（支持追问「再说点」）\n• 也可以问「编年史 / 机构 / 装备 / 成就 / 测验」\n也可前往「EVA 学院终端」专页查看完整面板。',
      "EVA Terminal guide:\n• 'notice' — college announcements\n• 'task' — accept & advance missions (simulating the plot)\n• 'mail' — the academy inbox\n• 'quote' — a random classic line\n• ask me about characters / Seven Sins / Kings / spirits / plot (try 'tell me more')\n• or try 'timeline / institutions / arsenal / achievements / quiz'\nOr open the 'EVA Terminal' page for the full dashboard.");
  }

  function cmdNotice(){
    var unread = NOTICES.filter(function(n){ return S.noticesRead.indexOf(n.id)<0; });
    var lines = NOTICES.map(function(n){
      var r = S.noticesRead.indexOf(n.id)>=0;
      return (r?'　':'● ')+L(n);
    }).join('\n');
    evaSay('学院通知（'+NOTICES.length+' 条，'+unread.length+' 条未读）：\n'+lines+'\n\n（点击「EVA 学院终端」页面可逐条标记已读）',
      'College notices ('+NOTICES.length+' total, '+unread.length+' unread):\n'+lines+'\n\n(Open the EVA Terminal page to mark each as read)');
    // 标记全部已读
    NOTICES.forEach(function(n){ if(S.noticesRead.indexOf(n.id)<0) S.noticesRead.push(n.id); });
    save(S);
  }

  function cmdTask(){
    var tk=firstAvailable();
    if(!tk){ evaSay('所有任务已完成。你已是真正的屠龙者。','All missions complete. You are a true dragon-slayer.'); return; }
    var st=taskStatus(tk.id);
    if(st==='available'){
      evaSay('当前可执行任务：\n【'+L(tk)+'】\n'+tk['zh_b']+'\n目标：'+tk['zh_o']+'\n奖励：'+tk['zh_r'],
        'Current mission:\n['+L(tk)+']\n'+tk.en_b+'\nObjective: '+tk.en_o+'\nReward: '+tk.en_r+
        '\n<button data-task="'+tk.id+'" data-act="accept" class="eva-btn">接受任务</button>');
    } else if(st==='accepted'){
      evaSay('任务进行中：【'+L(tk)+'】\n'+tk['zh_b']+'\n完成目标后点此结算：',
        'In progress: ['+L(tk)+']\n'+tk.en_b+'\nClick to settle when done:',
        );
      // 追加完成按钮
      var last=transcript[transcript.length-1];
      last.en = last.en + '<button data-task="'+tk.id+'" data-act="done" class="eva-btn">完成任务</button>';
      last.zh = last.zh + '<button data-task="'+tk.id+'" data-act="done" class="eva-btn">完成任务</button>';
      renderTranscript();
    } else {
      cmdTask();
    }
  }

  function taskAction(id, act){
    var tk=TASKS.filter(function(x){return x.id===id;})[0]; if(!tk) return;
    if(act==='accept'){
      S.tasks[id]='accepted'; save(S);
      evaSay('任务已接受：【'+L(tk)+'】。执行部正在记录你的行动。','Mission accepted: ['+L(tk)+']. The Bureau is logging your move.');
      cmdTask();
    } else if(act==='done'){
      S.tasks[id]='done'; recompute(); save(S);
      // 触发一封任务简报邮件
      var em={ id:'ex_'+id, from:(window.LANG==='en'?'Execution Bureau':'执行部'), tag:'mission',
        zh_sub:'任务结算 · '+tk.zh_t, zh_body:'【'+tk.zh_t+'】已归档。'+tk.zh_r+'下一阶段指令将在「通知」中下发。',
        en_sub:'Mission Settled · '+tk.en_t, en_body:'['+tk.en_t+'] archived. '+tk.en_r+' Next-phase orders will follow via Notices.' };
      S.extraEmails.unshift(em); save(S);
      evaSay('任务完成！【'+L(tk)+'】\n'+tk['zh_r']+'\n（执行部已发送任务简报至你的学院邮箱）',
        'Mission complete! ['+L(tk)+']\n'+tk.en_r+'\n(The Bureau sent a brief to your academy inbox)');
      cmdTask();
    }
  }

  function cmdMail(){
    var all = S.extraEmails.concat(EMAILS);
    var unread = all.filter(function(m){ return S.emailsRead.indexOf(m.id)<0; });
    var latest = all[0];
    var sub = (window.LANG==='en' ? latest.en_sub : latest.zh_sub);
    evaSay('学院邮箱：'+all.length+' 封，'+unread.length+' 封未读。\n最新一封来自「'+latest.from+'」：'+sub+
      '\n\n前往「EVA 学院终端」页面可逐封阅读。',
      'Academy inbox: '+all.length+' messages, '+unread.length+' unread.\nLatest from "'+latest.from+'": '+latest.en_sub+
      '\n\nOpen the EVA Terminal page to read each.');
  }

  var lastQuoteIdx=-1;
  function cmdQuote(){
    var i;
    do{ i=Math.floor(Math.random()*QUOTES.length); } while(QUOTES.length>1 && i===lastQuoteIdx);
    lastQuoteIdx=i;
    var q=QUOTES[i];
    evaSayDelayed(400,
      '档案室的「台词留声机」转了一圈——\n「'+q.zh+'」\n'+q.who_zh,
      "The archive's quote phonograph spun once —\n\""+q.en+"\"\n"+q.who_en,
      { nav:{ href:'quotes.html', zh:'语录图书馆', en:'Quote Library' } });
  }

  /* ============ 事件 ============ */
  function bindWidget(){
    var launch=document.getElementById('eva-launch');
    var panel=document.getElementById('eva-panel');
    var close=document.getElementById('eva-close');
    var input=document.getElementById('eva-input');
    var send=document.getElementById('eva-send');
    launch.onclick=function(){ panel.classList.remove('hidden'); launch.classList.add('hidden'); if(!transcript.length){ greet(); } input.focus(); };
    close.onclick=function(){ panel.classList.add('hidden'); launch.classList.remove('hidden'); };
    function doSend(){ var v=input.value; if(!v.trim())return; userSay(v,v); input.value=''; route(v); }
    send.onclick=doSend;
    input.addEventListener('keydown',function(e){ if(e.key==='Enter') doSend(); });
    document.getElementById('eva-chips').addEventListener('click',function(e){
      var b=e.target.closest('button[data-cmd]'); if(!b)return;
      var c=b.getAttribute('data-cmd');
      if(c==='notice') cmdNotice();
      else if(c==='task') cmdTask();
      else if(c==='mail') cmdMail();
      else if(c==='quote') cmdQuote();
      else if(c==='help') cmdHelp();
    });
    // 追问建议按钮（事件委托）
    document.getElementById('eva-msgs').addEventListener('click',function(e){
      var b=e.target.closest('button.eva-ask'); if(!b)return;
      ask(b.getAttribute('data-ask-zh')||'', b.getAttribute('data-ask-en')||'');
    });
  }

  function greet(){
    if(window.DR_ACC && DR_ACC.current()){
      var u=DR_ACC.current(); var p=u.profile||{}; var isEn=window.LANG==='en';
      var zh='欢迎回来，'+u.name+'。卡塞尔学院人工智能 EVA 已就绪。';
      var en="Welcome back, "+u.name+". Cassell College AI 'EVA' online.";
      if(p.bloodLevel){
        zh+=' 你的血统等级：'+p.bloodLevel+'。';
        en+=' Your bloodline: '+(p.bloodLevelEn||p.bloodLevel)+'.';
        if(p.spirit){ zh+='言灵'+p.spirit+'已觉醒。'; en+=' Spirit '+(p.spiritEn||p.spirit)+' awakened.'; }
      } else {
        zh+=' 前往首页完成血统鉴定，记录你的言灵吧。';
        en+=' Run the bloodline test on the homepage to record your spirit.';
      }
      zh+='\n输入「通知 / 任务 / 邮箱 / 语录」，或直接问我关于龙族的一切。';
      en+="\nSay 'notice / task / mail / quote', or ask me anything about Dragon Raja.";
      evaSay(zh,en); return;
    }
    evaSay('卡塞尔学院人工智能 EVA 已就绪。\n我是学院的终端意志，负责传递通知、发放任务、管理学院邮件。\n输入「通知 / 任务 / 邮箱 / 语录」，或直接问我关于龙族的一切。',
      "Cassell College AI 'EVA' online.\nI am the college's terminal will — delivering notices, issuing missions, managing the academy mail.\nSay 'notice / task / mail / quote', or ask me anything about Dragon Raja.");
  }

  /* ============ 对外暴露（供 eva.html 仪表盘使用） ============ */
  window.EVA = {
    NOTICES:NOTICES, TASKS:TASKS, EMAILS:EMAILS, KB:KB, QUOTES:QUOTES,
    state:S, L:L,
    noticesRead:function(){ return S.noticesRead; },
    markNotice:function(id){ if(S.noticesRead.indexOf(id)<0){S.noticesRead.push(id);save(S);} },
    emails:function(){ return S.extraEmails.concat(EMAILS); },
    emailsRead:function(){ return S.emailsRead; },
    markEmail:function(id){ if(S.emailsRead.indexOf(id)<0){S.emailsRead.push(id);save(S);} },
    taskStatus:taskStatus,
    allDone:function(){ return TASKS.every(function(tk){return S.tasks[tk.id]==='done';}); },
    addEmail:function(m){ S.extraEmails.unshift(m); save(S); },
    completeTask:function(id){ if(!(id in S.tasks)) return; S.tasks[id]='done'; recompute(); save(S); },
    // 测试钩子：返回 { entry, score } 或 null
    _match:function(input){ return matchKB(input); }
  };

  /* ============ 账号 → EVA 联动 ============ */
  window.addEventListener('acc:bloodline', function(e){
    var d=e.detail||{};
    var zh = d.spirit
      ? ('你的血统鉴定已完成——等级 '+d.level+'，言灵'+d.spirit+'觉醒。结果已记入你的学员档案。')
      : ('你的血统鉴定已完成——等级 '+d.level+'。前往「召唤言灵」唤醒你的力量。');
    var en = d.spirit
      ? ('Your bloodline test is complete — level '+d.level+', spirit '+(d.spiritEn||d.spirit)+' awakened. Saved to your cadet file.')
      : ('Your bloodline test is complete — level '+d.level+'. Summon your spirit to wake your power.');
    evaSay(zh,en);
  });

  /* ============ 语言切换时重渲染 ============ */
  if(window.onLangChange){ window.onLangChange(function(){ renderChips(); renderTranscript(); }); }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectWidget);
  else injectWidget();
})();
