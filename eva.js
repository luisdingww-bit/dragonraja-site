/* 龙族 · 学院人工智能 EVA — 终端引擎 + 浮动聊天挂件
 * 静态站点无后端，EVA 为「基于剧情知识库的交互体」：
 *  - 识别 通知/任务/邮箱/人物/七宗罪 等意图
 *  - 发放可推进的任务链（模拟龙族情节）
 *  - 管理学院邮箱（localStorage 记住已读/新邮件）
 *  - 自由文本走剧情知识库应答
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

  // 自由文本知识库（关键词 → 回答）
  var KB = [
    { kw:['路明非','明非','mingfei'], zh:"路明非——卡塞尔学院 S 级混血种，自称「衰小孩」的普通少年，却在一次次屠龙中成为所有人的依靠。他最珍视的是绘梨衣，最深的羁绊是弟弟路鸣泽。",
      en:"Lu Mingfei — S-class hybrid at Cassell, a self-called 'loser' who becomes everyone's anchor through each dragon slaying. He treasures Eri most; his deepest bond is his brother Lu Mingze." },
    { kw:['楚子航','子航','zihang'], zh:"楚子航——狮心会会长，A 级，言灵·君焰。他追猎奥丁只为找回失踪的父亲，也在夏弥身上学会了「比屠龙更难的是温柔」。",
      en:"Chu Zihang — Lionheart president, A-class, Spirit · King's Inferno. He hunts Odin to find his lost father, and through Xia Mi learned that 'gentler than slaying is harder'." },
    { kw:['凯撒','caesar'], zh:"凯撒·加图索——学生会主席，骄傲的贵族之子，言灵·吸血镰。从把路明非当对手，到在东京与他、楚子航结为兄弟。",
      en:"Caesar Gattuso — Student Union president, proud noble heir, Spirit · Bloodsucking Scythe. From rival of Mingfei to brother-in-arms with him and Zihang in Tokyo." },
    { kw:['绘梨衣','eri','上杉'], zh:"上杉绘梨衣——白王容器「权天使」，源稚生/源稚女的妹妹。她不会说话，却把整本「东京爱情故事」画给 Sakura 看。东京塔下，她把红白护腕留给了路明非。",
      en:"Uesugi Eri — the White King vessel 'Power Angel', sister of Yubetsu and Minamoto. Unable to speak, she drew a whole 'Tokyo Love Story' for her Sakura. Beneath Tokyo Tower she left Mingfei her red-white wristband." },
    { kw:['昂热','校长','angers'], zh:"昂热——卡塞尔学院校长，初代狮心会唯一幸存者，千年屠龙者。他追猎四大龙王，也把最后的希望寄托在路明非身上。",
      en:"Angers — Cassell's headmaster, sole survivor of the first Lionheart, a millennial dragon-slayer. He hunts the Four Kings and pins his last hope on Mingfei." },
    { kw:['路鸣泽','mingze'], zh:"路鸣泽——路明非的「弟弟」，栖身在他体内的魔鬼。他锻造了七宗罪，以四分之一灵魂为租金，一次次把哥哥从绝境里拉回来。",
      en:"Lu Mingze — Mingfei's 'brother', a devil within him. He forged the Seven Sins and, for a quarter-soul rent, pulls his brother back from death again and again." },
    { kw:['诺诺','陈墨瞳','nono'], zh:"陈墨瞳（诺诺）——恺撒的妻子，红发巫女，言灵·先知。她总在路明非最狼狈时递来一只手。",
      en:"Chen Motong (Nono) — Caesar's wife, red-haired witch, Spirit · Prophet. She always lends a hand when Mingfei is at his lowest." },
    { kw:['七宗罪','七宗','seven','sins'], zh:"权与力之七宗罪——路鸣泽以龙王之骨锻造的七柄魔剑，各对应一罪：傲慢、妒忌、暴怒、懒惰、贪婪、饕餮、色欲。它们斩杀过四大龙王，也将在东京了结篡位者赫尔佐格。",
      en:"The Seven Deadly Sins — seven demonic swords Lu Mingze forged from dragon-king bones, each a sin: Pride, Envy, Wrath, Sloth, Greed, Gluttony, Lust. They slew the Four Kings and ended the usurper Herzog in Tokyo." },
    { kw:['四大龙王','龙王','kings','four'], zh:"四大龙王——青铜与火、白王·天空、大地与山、海洋与水。每一位都是双子相食的悲剧，而昂热追猎他们已逾千年。",
      en:"The Four Kings — Bronze & Fire, White King · Sky, Earth & Mountain, Sea & Water. Each is a tragedy of twin-devouring; Angers has hunted them for over a thousand years." },
    { kw:['白王','white'], zh:"白王——四王之首，掌天空与精神，被黑王亲手斩杀。其血引发千年权位之争，最终在绘梨衣与赫尔佐格身上迎来终局。",
      en:"The White King — first of the Four, master of sky and mind, slain by the Black King. Its blood drove a millennial struggle, ending with Eri and Herzog." },
    { kw:['黑王','nidhogg','black'], zh:"黑王尼德霍格——龙族之祖，所有龙血的来源。七宗罪本为弑黑王而生，却被路鸣泽先行借给了哥哥。",
      en:"The Black King Nidhogg — progenitor of all dragons, source of every dragon blood. The Seven Sins were forged to kill him, yet Mingze lent them to his brother first." },
    { kw:['言灵','spirit'], zh:"言灵——混血种觉醒后释放的先天能力，各有序列号，从「蛇」(22)到「烛龙」(114)。你的血统越高，能驾驭的言灵越危险。",
      en:"A Spirit (言灵) — the innate power a hybrid releases upon awakening, each with a sequence number, from 'Serpent' (22) to 'Zhulong' (114). Higher bloodline, deadlier spirit." },
    { kw:['卡塞尔','学院','cassell'], zh:"卡塞尔学院——藏在芝加哥的混血种学府，钟声为屠龙者而鸣。这里有狮心会与学生会的 rivalry，也有无数少年在龙类面前挡在同伴身前的故事。",
      en:"Cassell College — the hybrid academy hidden in Chicago, its bells tolling for dragon-slayers. Home to the Lionheart/Student-Union rivalry and countless stories of boys shielding friends from dragons." },
    { kw:['狮心会','lionheart'], zh:"狮心会——由昂热创立、楚子航执掌的精英社团，承袭初代屠龙者的荣光。与学生会的橄榄球赛是每年的固定节目。",
      en:"The Lionheart Society — elite club founded by Angers, led by Chu Zihang, heir to the first dragon-slayers' glory. Its rugby match vs the Student Union is annual." },
    { kw:['东京','tokyo','绘梨衣'], zh:"东京——龙族Ⅲ黑月之潮的舞台。源氏重工、东京塔、4 月 4 日的献祭，以及 Sakura 与绘梨衣的告别，都在这里的雨里发生。",
      en:"Tokyo — stage of Vol.3 Dark Moon Tide. Genji Heavy Industries, Tokyo Tower, the 4/4 sacrifice, and Sakura's farewell to Eri all happen in its rain." }
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

  /* ============ 挂件 DOM ============ */
  function injectWidget(){
    if(document.getElementById('eva-launch')) return;
    var wrap=document.createElement('div'); wrap.id='eva-root';
    wrap.innerHTML =
      '<div id="eva-launch" title="EVA 学院终端">EVA</div>'+
      '<div id="eva-panel" class="hidden">'+
        '<div id="eva-head"><span class="eva-id"><i class="eva-dot"></i> EVA · 学院终端</span><button id="eva-close" aria-label="close">×</button></div>'+
        '<div id="eva-msgs"></div>'+
        '<div id="eva-chips">'+
          '<button data-cmd="notice">通知</button>'+
          '<button data-cmd="task">任务</button>'+
          '<button data-cmd="mail">邮箱</button>'+
          '<button data-cmd="help">帮助</button>'+
        '</div>'+
        '<div id="eva-input-row"><input id="eva-input" autocomplete="off" placeholder="和 EVA 说点什么…"><button id="eva-send">发送</button></div>'+
      '</div>';
    document.body.appendChild(wrap);
    bindWidget();
    renderTranscript();
  }

  /* ============ 聊天 ============ */
  var transcript=[]; // {role:'eva'|'user', zh, en}
  function addMsg(role, zh, en){ transcript.push({role:role, zh:zh, en:en}); renderTranscript(); }
  function renderTranscript(){
    var box=document.getElementById('eva-msgs'); if(!box) return;
    box.innerHTML='';
    transcript.forEach(function(m){
      var d=document.createElement('div'); d.className='eva-msg '+(m.role==='eva'?'eva':'user');
      d.innerHTML = (m.role==='eva') ? ('<span class="eva-av">EVA</span>'+escapeHtml(L(m))) : '<span class="eva-ut">'+escapeHtml(L(m))+'</span>';
      box.appendChild(d);
    });
    // 任务/邮件内联按钮
    box.querySelectorAll('[data-task]').forEach(function(b){
      b.onclick=function(){ taskAction(b.getAttribute('data-task'), b.getAttribute('data-act')); };
    });
    box.scrollTop=box.scrollHeight;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

  function evaSay(zh,en){ addMsg('eva',zh,en); }
  function userSay(zh,en){ addMsg('user',zh,en); }

  function route(input){
    var s=(input||'').trim();
    var low=s.toLowerCase();
    if(!s){ return; }
    // 意图
    if(/通知|公告|学院通知|notice|announce|bulletin/.test(low)) return cmdNotice();
    if(/任务|委托|执行|quest|task|mission|op\b/.test(low)) return cmdTask();
    if(/邮箱|邮件|信|mail|email|inbox/.test(low)) return cmdMail();
    if(/帮助|怎么|功能|help|how|what can/.test(low)) return cmdHelp();
    // 知识库
    for(var i=0;i<KB.length;i++){
      for(var k=0;k<KB[i].kw.length;k++){
        if(low.indexOf(KB[i].kw[k].toLowerCase())>=0){ return evaSay(KB[i].zh, KB[i].en); }
      }
    }
    // 兜底
    evaSay(
      '我听见了你的声音，混血种。我掌管学院的通知、任务与邮件。试试对我说「通知」「任务」「邮箱」，或问我关于路明非、楚子航、绘梨衣、七宗罪的事。',
      "I hear you, hybrid. I govern the college's notices, tasks and mail. Try 'notice', 'task', 'mail', or ask me about Mingfei, Zihang, Eri, or the Seven Sins."
    );
  }

  function cmdHelp(){
    evaSay(
      'EVA 学院终端使用指引：\n• 说「通知」— 查看学院公告\n• 说「任务」— 领取并推进执行任务（模拟龙族情节）\n• 说「邮箱」— 打开学院邮件\n• 直接问我人物/七宗罪/龙王/言灵\n也可前往「EVA 学院终端」专页查看完整面板。',
      "EVA Terminal guide:\n• 'notice' — college announcements\n• 'task' — accept & advance missions (simulating the plot)\n• 'mail' — the academy inbox\n• ask me about characters / Seven Sins / Kings / spirits\nOr open the 'EVA Terminal' page for the full dashboard."
    );
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
      else if(c==='help') cmdHelp();
    });
  }

  function greet(){
    evaSay('卡塞尔学院人工智能 EVA 已就绪。\n我是学院的终端意志，负责传递通知、发放任务、管理学院邮件。\n输入「通知 / 任务 / 邮箱」，或直接问我关于龙族的一切。',
      "Cassell College AI 'EVA' online.\nI am the college's terminal will — delivering notices, issuing missions, managing the academy mail.\nSay 'notice / task / mail', or ask me anything about Dragon Raja.");
  }

  /* ============ 对外暴露（供 eva.html 仪表盘使用） ============ */
  window.EVA = {
    NOTICES:NOTICES, TASKS:TASKS, EMAILS:EMAILS, KB:KB,
    state:S, L:L,
    noticesRead:function(){ return S.noticesRead; },
    markNotice:function(id){ if(S.noticesRead.indexOf(id)<0){S.noticesRead.push(id);save(S);} },
    emails:function(){ return S.extraEmails.concat(EMAILS); },
    emailsRead:function(){ return S.emailsRead; },
    markEmail:function(id){ if(S.emailsRead.indexOf(id)<0){S.emailsRead.push(id);save(S);} },
    taskStatus:taskStatus,
    allDone:function(){ return TASKS.every(function(tk){return S.tasks[tk.id]==='done';}); }
  };

  /* ============ 语言切换时重渲染 ============ */
  if(window.onLangChange){ window.onLangChange(function(){ renderTranscript(); }); }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectWidget);
  else injectWidget();
})();
