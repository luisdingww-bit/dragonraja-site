/* 龙族 · 混血种档案 · 多语言引擎 (中 / EN) */
(function(){
  "use strict";
  window.LANG = (function(){ try{ return localStorage.getItem('dr-lang') || 'zh'; }catch(e){ return 'zh'; } })();

  /* ---- 静态文案字典 ---- */
  window.I18N = {
    zh: {
      boot_kicker: "卡塞尔学院 · 招生委员会",
      boot_rule: "每个人心里都有一条龙",
      boot_enter: "启 程",
      boot_notice_title: "录 取 通 知",
      boot_seal_no: "档案编号 · DR-0001",
      boot_music_label: "背景音乐",
      boot_eva_disp: "由 EVA 智能终端派送",
      boot_form_title: "新生注册登记",
      boot_form_hint: "填写注册信息并设置密码后方可启程",
      boot_enroll_btn: "录取登记",
      boot_form_submit: "生成录取通知书",
      boot_ready: "准备启程",
      adm_sign_pres: "校长签名",
      adm_sign_sec: "首席秘书签名",
      ph_name: "姓名 / Name",
      ph_age: "年龄 / Age",
      ph_email: "邮箱 / Email",
      ph_password: "密码 / Password",
      boot_login_btn: "登 录",
      login_title: "学 员 登 录",
      login_to_enroll: "还没有账号？去登记",
      login_hint: "请输入邮箱与密码",
      nav_tag: "混血种档案",
      nav_story: "情节长卷",
      nav_codex: "言灵图鉴",
      nav_kings: "四大龙王",
      nav_ritual: "血统鉴定",
      nav_elegy: "绘梨衣",
      story_video_cap: "全 卷 引 子 · 龙 族 章 节 混 编",
      story_video_kick: "全 卷 引 子",
      hero_kicker: "卡塞尔学院 · 混血种档案",
      hero_quote: "凡王之血，必以剑终",
      hero_lead: "世界上有一种生命，逆着时光的洪流而生。他们流淌着古老的龙血，在卡塞尔学院的钟声里，等待属于自己的言灵苏醒。",
      scroll_hint: "▼ 下滑，开启你的混血种鉴定",
      s01_h2: "世 界 观",
      s01_sub: "当龙血逆着时光流淌",
      world_p1: "《龙族》是作家江南创作的奇幻小说系列。故事里，一群被称为“混血种”的少年在卡塞尔学院（Cassell College）的庇护下，与沉眠于世界各处的龙族后裔战斗。他们既背负人类的身份，又流淌着龙的血——是异类，也是屠龙者中最后的希望。",
      world_quote: "“每个人心里都有一条龙，有的人终其一生都在驯服它，而有的人，成了它的奴隶。”",
      world_p3: "在这个世界里，“言灵”是混血种觉醒后能够释放的先天能力，每种言灵都有专属序列号：从最普通的“蛇”（序列号22），到灭世级的“烛龙”（序列号114）。而你，究竟是第几代混血种，又能否听见血脉深处的那一句言灵？",
      crest_line: "✦ 混血种名录 · 待你登记 ✦",
      s02_h2: "路 明 非 与 绘 梨 衣",
      s02_sub: "龙族Ⅲ · 黑月之潮 · 东京塔下的告别",
      elegy_badge: "同 人 创 作",
      elegy_subtitle: "致 路 明 非 与 上 杉 绘 梨 衣",
      elegy_signoff: "—— 谨以此页，致每一个被这世界伤害过的孩子。",
      s03_h2: "混血种资质鉴定仪式",
      s03_sub: "踏入卡塞尔学院的第一道门槛",
      btn_check: "启动血统检测",
      btn_summon: "召唤言灵",
      scan_tip: "正在解析你的基因序列……",
      result_h2: "鉴 定 结 果",
      blood_label: "你的血统等级：",
      spirit_label: "觉醒言灵：",
      s04_h2: "言 灵 图 鉴",
      s04_sub: "血脉深处的咒语 · 此处仅列六条",
      more_codex: "进入完整图鉴（共 36 条）",
      s05_h2: "龙 族 1 — 5 · 精 彩 情 节",
      s05_sub: "五卷血与火的编年",
      h1_vol: "情 节 长 卷",
      more_story: "进入情节长卷（互动版）",
      s06_h2: "四 大 龙 王",
      s06_sub: "大地与山川的统治者 · 点击查看双生关系",
      more_kings: "查看四大龙王详情（双生关系）",
      footer_copy: "© 龙族同人个人站 · Ding.LDCrew-MADE · 禁止商用",
      ph_volumes: "情节长卷",
      ph_spirit: "言灵图鉴",
      ph_fourkings: "四大龙王",
      sec_vol_sub: "点击分卷标签切换 · 点场景展开详叙",
      rand_btn: "随机一句经典台词",
      rand_hint: "— 点一下，听见血脉里的那句话 —",
      sec_spirit_h2: "三 十 六 言 灵",
      sec_spirit_sub: "按序列号排列 · 可筛选与搜索",
      codex_info: "本图鉴含原著登场言灵与同人扩展条目，序列号仅供模拟参考。",
      ftab_all: "全部",
      ftab_high: "高危",
      ftab_normal: "常规",
      search_ph: "搜索言灵 / 序列号…",
      count_tmpl: "显示 {{n}} / {{t}} 条",
      empty_tmpl: "— 未找到匹配的言灵 —",
      sec_kings_h2: "四 大 龙 王 · 双 生 与 加 冕",
      sec_kings_sub: "每一位龙王，都是一场双子相食的悲剧",
      k_domain: "领域与能力",
      k_twin: "双生关系",
      k_story: "小说情节",
      king_fire: "青铜与火之王",
      king_white: "白王 · 天空与风",
      king_earth: "大地与山之王",
      king_sea: "海洋与水之王",
      navk_fire: "🜂 青铜与火",
      navk_white: "🜄 白王·天空",
      navk_earth: "🜃 大地与山",
      navk_sea: "🜁 海洋与水",
      kings_more: "前往情节长卷，看这些王座如何卷入少年们的命运",
      go_read: "阅读 →",
      high_badge: "高危",
      v1_t: "火之晨曦", v1_d: "芝加哥的红发女孩、言灵·镰鼬觉醒、青铜城之战、康斯坦丁之死。",
      v2_t: "悼亡者之瞳", v2_d: "夏弥与楚子航、耶梦加得、夏弥之死、冰海王女零。",
      v3_t: "黑月之潮", v3_d: "绘梨衣登场、东京塔、4/4 献祭召唤路鸣泽、Sakura。",
      v4_t: "奥丁之渊", v4_d: "楚子航的梦境、奥丁之枪、父亲的背影、走入暴风雨。",
      v5_t: "悼亡者的归来", v5_d: "重返日本、赫尔佐格终局、世界树、诺诺与命运。",
      kf_t: "青铜与火", kf_d: "执掌“青铜御座”与赤红烈焰，镇守青铜城深处。",
      kw_t: "白王·天空", kw_d: "掌控风与精神，被黑王斩杀，留下千年权位之争。",
      ke_t: "大地与山", ke_d: "操纵大地与重力，沉眠于极北冰原之下。",
      ks_t: "海洋与水", ks_d: "执掌“归墟”，能掀起灭世海啸与无尽水压。",
      nav_eva: "EVA 终端",
      nav_sins: "七宗罪",
      nav_chars: "人物",
      eva_h1: "EVA · 学 院 终 端",
      eva_kick: "人工智能 · 终端意志",
      eva_sub: "通 知 · 任 务 · 学 院 邮 箱",
      eva_hint: "我是学院的终端意志，负责传递通知、发放任务、管理学院邮件",
      eva_tab_notice: "通知板",
      eva_tab_task: "任务中心",
      eva_tab_mail: "学院邮箱",
      eva_obj: "目标",
      eva_reward: "奖励",
      eva_locked: "完成前置任务后解锁",
      eva_accept: "接受任务",
      eva_finish: "完成任务",
      eva_done_badge: "✓ 已完成",
      eva_mail_back: "← 返回收件箱",
      eva_back: "返回首页",
      sins_h1: "七 宗 罪",
      sins_kick: "权与力 · 弑王之刃",
      sins_sub: "七 柄 魔 剑 · 各 应 一 罪",
      sins_hint: "路鸣泽以龙王之骨锻造，专司斩杀四大龙王",
      sins_origin_t: "锻造起源",
      sins_used: "已斩王",
      sins_spare: "备用",
      sins_type: "形制",
      sins_target: "斩杀目标",
      sins_owner: "持有者",
      ch_h1: "人 物 交 织",
      ch_kick: "命运的网络",
      ch_sub: "点 击 人 物 · 看 他 们 如 何 纠 缠",
      ch_hint: "路明非 · 楚子航 · 恺撒 · 绘梨衣 · 零 · 昂热",
      ch_ev_title: "交 织 事 件 · 多 视 角",
      ch_spirit: "言灵",
      ch_rel_title: "与他人的羁绊",
      ch_el_kick: "挽 歌",
      ch_el_h2: "绘 梨 衣",
      ch_el_sub: "白王容器 · 权天使 · 东京塔下的告别",
      ch_net_kick: "交织之网",
      ch_net_sub: "人 物 交 织 网",
      ch_net_hint: "点击任意节点，展开他与所有人的羁绊",
      ch_net_tip: "◇ 点击节点查看羁绊 · 点击空白处复位"
    },
    en: {
      boot_kicker: "CASSELL COLLEGE · ADMISSION OFFICE",
      boot_rule: "A dragon sleeps within every heart",
      boot_enter: "ENTER",
      boot_notice_title: "ADMISSION NOTICE",
      boot_seal_no: "FILE NO. · DR-0001",
      boot_music_label: "BGM",
      boot_eva_disp: "DISPATCHED BY EVA TERMINAL",
      boot_form_title: "NEW-STUDENT REGISTRATION",
      boot_form_hint: "Complete info and set a password to enter",
      boot_enroll_btn: "REGISTER",
      boot_form_submit: "GENERATE NOTICE",
      boot_ready: "PROCEED",
      adm_sign_pres: "President",
      adm_sign_sec: "Chief Secretary",
      ph_name: "Name",
      ph_age: "Age",
      ph_email: "Email",
      ph_password: "Password",
      boot_login_btn: "LOGIN",
      login_title: "STUDENT LOGIN",
      login_to_enroll: "No account? Register",
      login_hint: "Enter email and password",
      nav_tag: "HYBRID ARCHIVE",
      nav_story: "Volumes",
      nav_codex: "Spirit Codex",
      nav_kings: "Four Kings",
      nav_ritual: "Blood Test",
      nav_elegy: "Eri",
      story_video_cap: "DRAGON RAJA · CHAPTER MONTAGE",
      story_video_kick: "PROLOGUE",
      hero_kicker: "CASSELL COLLEGE · HYBRID ARCHIVE",
      hero_quote: "The blood of kings ends by the sword",
      hero_lead: "In this world there is a kind of life that swims against the torrent of time. Ancient dragon blood runs in their veins, and within the bells of Cassell College they wait for their own spirit to awaken.",
      scroll_hint: "▼ Scroll to begin your bloodline test",
      s01_h2: "WORLDVIEW",
      s01_sub: "Where dragon blood flows against the tide of time",
      world_p1: "Dragon Raja is a fantasy novel series by author Jiang Nan. In its story, a group of youths called 'hybrids' fight — under the protection of Cassell College — the dragon descendants slumbering across the world. They bear human identities yet carry dragon blood: outcasts, and the last hope among those who slay dragons.",
      world_quote: "“A dragon lives in every heart. Some spend their whole lives taming it; others become its slave.”",
      world_p3: "In this world, a 'spirit' (言灵) is the innate power a hybrid can release after awakening. Each has its own sequence number — from the most ordinary 'Serpent' (Seq. 22) to the world-ending 'Zhulong' (Seq. 114). And you — what generation of hybrid are you, and can you hear the spirit whispering in your blood?",
      crest_line: "✦ Hybrid Registry · Awaiting Your Entry ✦",
      s02_h2: "LU MINGFEI & ERI",
      s02_sub: "Dragon Raja III · Dark Moon Tide · Farewell Beneath Tokyo Tower",
      elegy_badge: "FAN FICTION",
      elegy_subtitle: "To Lu Mingfei & Uesugi Eri",
      elegy_signoff: "— For every child this world has ever hurt.",
      s03_h2: "HYBRID BLOODLINE TEST RITUAL",
      s03_sub: "The first threshold of Cassell College",
      btn_check: "START SCAN",
      btn_summon: "SUMMON SPIRIT",
      scan_tip: "Analyzing your genetic sequence…",
      result_h2: "RESULT",
      blood_label: "Your bloodline: ",
      spirit_label: "Awakened spirit: ",
      s04_h2: "SPIRIT CODEX",
      s04_sub: "Whispers in the blood · six shown here",
      more_codex: "Enter the full codex (36 entries)",
      s05_h2: "DRAGON RAJA VOL.1—5 · HIGHLIGHTS",
      s05_sub: "Five chronicles of blood and fire",
      h1_vol: "VOLUMES",
      more_story: "Enter the interactive volumes",
      s06_h2: "THE FOUR KINGS",
      s06_sub: "Rulers of earth and mountain · twin bonds within",
      more_kings: "View the Four Kings (twin bonds)",
      footer_copy: "© Dragon Raja Fan Site · Ding.LDCrew-MADE · No Commercial Use",
      ph_volumes: "Volumes",
      ph_spirit: "Spirit Codex",
      ph_fourkings: "Four Kings",
      sec_vol_sub: "Click a volume tab · expand scenes for details",
      rand_btn: "Random iconic line",
      rand_hint: "— Tap to hear the words in your blood —",
      sec_spirit_h2: "THIRTY-SIX SPIRITS",
      sec_spirit_sub: "Sorted by sequence · filter & search",
      codex_info: "This codex includes spirits from the original work and fan-made expansions; sequence numbers are for simulation reference only.",
      ftab_all: "All",
      ftab_high: "High Risk",
      ftab_normal: "Normal",
      search_ph: "Search spirit / seq…",
      count_tmpl: "Showing {{n}} / {{t}}",
      empty_tmpl: "— No matching spirit —",
      sec_kings_h2: "THE FOUR KINGS · TWINS & CORONATION",
      sec_kings_sub: "Every King is a tragedy of twin-devouring",
      k_domain: "Domain & Power",
      k_twin: "Twin Bond",
      k_story: "In the Story",
      king_fire: "King of Bronze & Fire",
      king_white: "White King · Sky & Wind",
      king_earth: "King of Earth & Mountain",
      king_sea: "King of Sea & Water",
      navk_fire: "🜂 Bronze & Fire",
      navk_white: "🜄 White King",
      navk_earth: "🜃 Earth & Mountain",
      navk_sea: "🜁 Sea & Water",
      kings_more: "Go to the volumes, and see how these thrones entangled the boys' fates",
      go_read: "Read →",
      high_badge: "HIGH RISK",
      v1_t: "Dawn of Fire", v1_d: "The red-haired girl in Chicago, awakening of the Kamaitachi spirit, the Battle of Bronze City, Constantine's death.",
      v2_t: "Mourner's Eyes", v2_d: "Xia Mi & Chu Zihang, Jörmungandr, Xia Mi's death, the ice-sea princess Zero.",
      v3_t: "Dark Moon Tide", v3_d: "Eri appears, Tokyo Tower, the 4/4 sacrifice summoning Lu Mingze, Sakura.",
      v4_t: "Abyss of Odin", v4_d: "Chu Zihang's dream, Odin's spear, his father's receding figure, walking into the storm.",
      v5_t: "Return of the Mourner", v5_d: "Return to Japan, Herzog's end, the World Tree, Nono and fate.",
      kf_t: "Bronze & Fire", kf_d: "Wields the Bronze Throne and crimson flame, guarding Bronze City's depths.",
      kw_t: "White King · Sky", kw_d: "Master of wind and mind, slain by the Black King, leaving a millennial struggle.",
      ke_t: "Earth & Mountain", ke_d: "Commands earth and gravity, slumbering beneath the northern ice.",
      ks_t: "Sea & Water", ks_d: "Wields 'Guixu', raising apocalyptic tsunamis and endless pressure.",
      nav_eva: "EVA Terminal",
      nav_sins: "Seven Sins",
      nav_chars: "Characters",
      eva_h1: "EVA · COLLEGE TERMINAL",
      eva_kick: "AI · Terminal Will",
      eva_sub: "NOTICES · MISSIONS · ACADEMY MAIL",
      eva_hint: "I am the college's terminal will — delivering notices, issuing missions, managing the academy mail.",
      eva_tab_notice: "Notices",
      eva_tab_task: "Missions",
      eva_tab_mail: "Academy Mail",
      eva_obj: "Objective",
      eva_reward: "Reward",
      eva_locked: "Unlocks after the prior mission",
      eva_accept: "Accept Mission",
      eva_finish: "Complete Mission",
      eva_done_badge: "✓ Done",
      eva_mail_back: "← Back to inbox",
      eva_back: "Back to Home",
      sins_h1: "THE SEVEN SINS",
      sins_kick: "Power & Dominion · King-Slayers",
      sins_sub: "SEVEN DEMONIC SWORDS · ONE SIN EACH",
      sins_hint: "Forged by Lu Mingze from dragon-king bones, to slay the Four Kings",
      sins_origin_t: "Forging Origin",
      sins_used: "King Slain",
      sins_spare: "Spare",
      sins_type: "Form",
      sins_target: "Target Slain",
      sins_owner: "Wielded By",
      ch_h1: "INTERTWINED FATES",
      ch_kick: "A Web of Destiny",
      ch_sub: "CLICK A CHARACTER · SEE HOW THEY ENTANGLE",
      ch_hint: "Lu Mingfei · Chu Zihang · Caesar · Eri · Zero · Angers",
      ch_ev_title: "ENTANGLED EVENTS · MULTI-PERSPECTIVE",
      ch_spirit: "Spirit",
      ch_rel_title: "Bonds With Others",
      ch_el_kick: "ELEGY",
      ch_el_h2: "ERI",
      ch_el_sub: "White King Vessel · Power Angel · Farewell Beneath Tokyo Tower",
      ch_net_kick: "THE WEB",
      ch_net_sub: "CHARACTER WEB",
      ch_net_hint: "Click any node to reveal his bonds",
      ch_net_tip: "◇ Click a node to see its bonds · click empty space to reset"
    }
  };

  /* ---- 富文本（含高亮 span）HTML 字典 ---- */
  window.I18N_HTML = {
    footer_disc:{
      zh:"本页面为《龙族》读者自发制作的<b>非官方同人向个人志</b>，所有世界观、设定、人物与“言灵”名称均版权归属原作者江南及原著出版方，本页无任何商用、二次售卖行为。鉴定结果纯属随机模拟，与现实无关。",
      en:"This page is a <b>non-official fan-made zine</b> created by readers of Dragon Raja. All worldview, settings, characters and 'spirit' names belong to the original author Jiang Nan and the publisher. This page is not for commercial use or resale. Test results are randomly simulated and unrelated to reality."
    },
    boot_letter:{
      zh:"<span class=\"bl-salut\">致 未来的屠龙者：</span><br>经卡塞尔学院血统鉴定委员会裁定，你体内流淌着古老的龙血。现正式通知——<br><span class=\"bl-emph\">你已被录取为本届混血种学员。</span><br>钟声即将为你敲响。踏入此门，便再无回头。",
      en:"<span class=\"bl-salut\">To the future dragon-slayer:</span><br>By ruling of the Cassell College Bloodline Committee, ancient dragon blood runs in your veins. You are hereby notified —<br><span class=\"bl-emph\">You have been admitted as a hybrid cadet of this class.</span><br>The bells are about to toll for you. Step through this gate, and there is no turning back."
    },
    elegy_text: {
      zh: "东京的雨一直没停。\n绘梨衣靠在路明非肩头，浅色外套被雨水打湿了大半。她没有伞，也没有力气再撑起那把黑伞。她只是偏过头，用那双琥珀色的眼睛望着他：\n<span class=\"line-sakura\">“Sakura，你说……我们还能再来这里吗？”</span>\n路明非没有说话。他把伞倾向她那一边，自己的半边肩膀暴露在雨里。\n这一刻，<span class=\"line-emph\">路鸣泽在他脑海里轻笑</span>：“哥哥，你又要开始你的英雄梦了吗？”\n但他没有召唤路鸣泽。他只是轻声回答：\n<span class=\"line-emph\">“会的，一定会的。”</span>\n绘梨衣的眼睛亮了一下，像东京塔顶那盏不灭的灯。",
      en: "The rain in Tokyo never stopped.\nEri leaned against Mingfei's shoulder, her pale coat soaked through. She had no umbrella, no strength left to hold the black one up. She only turned, and with those amber eyes looked at him:\n<span class=\"line-sakura\">“Sakura… do you think we can come back here again?”</span>\nMingfei said nothing. He tilted the umbrella toward her, leaving his own shoulder in the rain.\nAt that moment, <span class=\"line-emph\">Lu Mingze laughed softly in his mind</span>: “Brother, are you starting your hero dream again?”\nBut he did not summon Mingze. He only answered, quietly:\n<span class=\"line-emph\">“Yes. We will.”</span>\nEri's eyes lit up — like the eternal light atop Tokyo Tower."
    },
    kp_fire1:{en:"One of the First Generation, guarding the depths of Bronze City. It wields crimson flame and the <span class=\"em\">'Bronze Throne'</span> (Spirit · Seq. 13) — hardening the body and surging power, the most primal and domineering ability of the Bronze & Fire King. Where it passes, metal melts and cities turn to ash."},
    kp_fire2:{en:"The Bronze & Fire King and his brother <span class=\"blood\">Constantine</span> were twins. By the ancient dragon law of coronation, one twin must devour the other to become a true, complete King. Constantine was slain by Cassell's execution team in Volume 1 before the devouring was complete — and with his last breath he still called Lu Mingfei 'brother'."},
    kp_fire3:{en:"Volume 1 'Dawn of Fire', the Battle of Bronze City. For the first time Lu Mingfei stood on the battlefield as a dragon-slayer, and watched a little dragon who called him 'brother' die before his eyes. Constantine's death was the first time Mingfei wept for a kill — and the first time he understood that slaying dragons costs more than a dragon's life."},
    kp_white1:{en:"The highest of the four First-Generation Kings, mastering wind and the power of the mind. Beneath its throne, storms swallow cities and spirits command the masses. The White King's blood is said to be the key to resurrection and coronation — coveted by countless souls for a thousand years."},
    kp_white2:{en:"The White King was slain by the <span class=\"blood\">Black King</span> himself — the bloodiest succession war in dragon history. Though the White King died, the strife over its blood and throne endured for millennia. Its opposition to the Black King is the deepest fracture in the dragon world."},
    kp_white3:{en:"The central thread of Volume 3 'Dark Moon Tide' and Volume 5 'Return of the Mourner'. Herzog drained Uesugi Eri's dragon blood to resurrect the White King and claim a god-defying coronation. Beneath the World Tree, this millennial struggle will finally end."},
    kp_earth1:{en:"It commands the earth and gravity, slumbering beneath the northern ice fields. In its wrath mountains crumble; where gravity multiplies, all things are crushed to dust. Its inherited eye is called the <span class=\"em\">'Mourner's Eyes'</span>."},
    kp_earth2:{en:"<span class=\"blood\">Xia Mi</span> and her brother were the twins of the Earth & Mountain King. The coronation demands one devour the other. Xia Mi learned love in the human world; she would not devour her brother — and so chose another ending: taking a fatal blow for Chu Zihang, dissolving into the wind as a human form."},
    kp_earth3:{en:"Volume 2 'Mourner's Eyes'. Xia Mi pretended amnesia and moved next to Chu Zihang, clumsily learning to be human. Her death is among the most heartbreaking scenes in the series — 'Because I loved you… I am the most powerful dragon in the world.' Chu Zihang held her, weeping on the battlefield for the first time."},
    kp_sea1:{en:"It wields <span class=\"em\">'Guixu'</span> (Spirit · Seq. 113) — raising boundless tsunamis and endless water pressure, the ultimate ocean spirit. It sleeps in the ten-thousand-meter deep sea; when it wakes, the whole ocean boils."},
    kp_sea2:{en:"Like the other three First-Generation Kings, the Sea & Water King is crowned by twin-devouring. The two sleep at the bottom of the deep abyss; on the day they wake, a devouring war is certain — the victor becomes King, the loser the deepest sacrifice beneath the throne."},
    kp_sea3:{en:"Its power manifests as 'Guixu'. In Volume 3 'Dark Moon Tide', the dark tides off Japan's coast and the blood-colored waters of the Genji Heavy Industries basement are echoes of this ancient oceanic force. Herzog's conspiracy is also bound to the throne slumbering in the deep."},
    sins_origin:{zh:"<span class=\"em\">七宗罪</span>——傲慢、妒忌、暴怒、懒惰、贪婪、饕餮、色欲——由<span class=\"blood\">路鸣泽</span>以初代龙王之骨锻造，一剑对应一罪。它们本为弑四大龙王、终而弑黑王尼德霍格而生。龙族Ⅲ《黑月之潮》中，路鸣泽以「四分之一条命」为租金将七宗罪租给哥哥；在源氏重工地底，路明非挥动七剑了结篡位的赫尔佐格。其中贪婪、饕餮、色欲三柄始终为空置备用，静默见证一场未竟的加冕。",
      en:"The <span class=\"em\">Seven Deadly Sins</span> — Pride, Envy, Wrath, Sloth, Greed, Gluttony, Lust — were forged by <span class=\"blood\">Lu Mingze</span> from the bones of the First-Generation dragons, one blade for each sin. They were made to slay the Four Kings and, ultimately, the Black King Nidhogg. In Volume 3 'Dark Moon Tide', Mingze leased them to his brother at the price of a quarter of his life; in the Genji Heavy Industries basement, Mingfei swung all seven to end the usurper Herzog. Three remained spare — Greed, Gluttony, Lust — silent witnesses to a coronation never finished."}
  };

  /* ---- 动态消息（JS 注入的文案） ---- */
  window.MSG = {
    zh: {
      noSpirit: "无言灵",
      noDragon: "你体内未检测到龙血，无法觉醒任何言灵。",
      promptSummon: "点击召唤言灵，尝试唤醒血脉深处的力量",
      notYet: "尚未觉醒",
      scanning: "正在解析你的基因序列……",
      sim_p1: "在卡塞尔学院的钟声里，你的血脉正在苏醒……"
    },
    en: {
      noSpirit: "No Spirit",
      noDragon: "No dragon blood detected. You cannot awaken any spirit.",
      promptSummon: "Click to summon your spirit and wake the power in your blood.",
      notYet: "Not Yet Awakened",
      scanning: "Analyzing your genetic sequence…",
      sim_p1: "Within the bells of Cassell College, your bloodline is awakening…"
    }
  };

  function t(k){
    var d = window.I18N[window.LANG];
    if(d && d[k]!==undefined) return d[k];
    return (window.I18N.zh[k]!==undefined) ? window.I18N.zh[k] : k;
  }
  function tr(o, f){
    if(window.LANG==='en' && o[f+'_en']!==undefined) return o[f+'_en'];
    return o[f];
  }
  window.t = t;
  window.tr = tr;

  window._langSubs = [];
  window.onLangChange = function(fn){ window._langSubs.push(fn); };

  function applyStatic(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var k = el.getAttribute('data-i18n-html');
      var d = window.I18N_HTML[k];
      if(!d) return;
      if(window.LANG==='en' && d.en!==undefined){ el.innerHTML = d.en; }
      else if(d.zh!==undefined){ el.innerHTML = d.zh; }
      // 否则保持原内容不动
    });
    // 高危角标（CSS ::before content 无法 i18n，改用 data 属性）
    document.querySelectorAll('.codex-card.high').forEach(function(el){
      el.setAttribute('data-high', t('high_badge'));
    });
    // placeholder 国际化
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
  }

  window.initLang = function(){
    document.documentElement.lang = (window.LANG==='en') ? 'en' : 'zh-CN';
    applyStatic();
    window._langSubs.forEach(function(fn){ try{ fn(); }catch(e){ console.error(e); } });
    document.querySelectorAll('.lang-switch').forEach(function(sw){ sw.textContent = (window.LANG==='en') ? '中' : 'EN'; });
  };

  window.setLang = function(l){
    window.LANG = l;
    try{ localStorage.setItem('dr-lang', l); }catch(e){}
    window.initLang();
  };

  document.addEventListener('DOMContentLoaded', window.initLang);
  // 开关按钮（事件委托，兼容动态插入）
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest ? e.target.closest('.lang-switch') : null;
    if(b){ window.setLang(window.LANG==='en' ? 'zh' : 'en'); }
  });
})();
