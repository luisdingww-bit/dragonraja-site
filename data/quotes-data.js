/* 语录图书馆 · 数据（中/EN 双语）
 * 字段：text 正文 / who 说话人 / theme 主题 / vol 卷次 / source 出处
 */
window.QUOTES_DATA = [
  { id:'q01', zh:"凡王之血，必以剑终。", en:"The blood of kings ends by the sword.",
    who:'jiangnan', theme:'chunibyou', vol:'all', source:"《龙族》卷首", source_en:"Dragon Raja" },
  { id:'q02', zh:"每个人心里都有一条龙。", en:"A dragon lives in every heart.",
    who:'jiangnan', theme:'gentle', vol:'all', source:"《龙族》", source_en:"Dragon Raja" },
  { id:'q03', zh:"我们都是小怪兽，总有一天会被正义的奥特曼杀死。", en:"We are all little monsters; one day the righteous Ultraman will come to kill us.",
    who:'mingfei', theme:'gentle', vol:'v1', source:"龙族Ⅰ · 路明非", source_en:"Vol.1 · Lu Mingfei" },
  { id:'q04', zh:"因为我爱过你……所以我是世界上最厉害的龙。", en:"Because I loved you… I am the most powerful dragon in the world.",
    who:'xiami', theme:'sacrifice', vol:'v2', source:"龙族Ⅱ · 夏弥", source_en:"Vol.2 · Xia Mi" },
  { id:'q05', zh:"Sakura，你说我们还能再来这里吗？", en:"Sakura, do you think we can come back here again?",
    who:'eri', theme:'parting', vol:'v3', source:"龙族Ⅲ · 上杉绘梨衣", source_en:"Vol.3 · Uesugi Eri" },
  { id:'q06', zh:"哥哥……我们都要死了。", en:"Brother… we're both going to die.",
    who:'constantine', theme:'parting', vol:'v1', source:"龙族Ⅰ · 康斯坦丁", source_en:"Vol.1 · Constantine" },
  { id:'q07', zh:"孩子，往前走，别回头。", en:"Son, walk forward. Don't look back.",
    who:'chutianjiao', theme:'parting', vol:'v4', source:"龙族Ⅳ · 楚天骄", source_en:"Vol.4 · Chu Tianjiao" },
  { id:'q08', zh:"如果命运选择了我，那我也可以选择，为谁而活。", en:"If fate chose me, then I can also choose — for whom to live.",
    who:'mingfei', theme:'hope', vol:'v5', source:"龙族Ⅴ · 路明非", source_en:"Vol.5 · Lu Mingfei" },
  { id:'q09', zh:"哥哥，我们又见面了。", en:"Brother, we meet again.",
    who:'mingze', theme:'chunibyou', vol:'v1', source:"龙族Ⅰ · 路鸣泽", source_en:"Vol.1 · Lu Mingze" },
  { id:'q10', zh:"你太笨了，所以我要一直看着你。", en:"You're too clumsy, so I have to keep watching you.",
    who:'zihang', theme:'love', vol:'v2', source:"龙族Ⅱ · 楚子航", source_en:"Vol.2 · Chu Zihang" },
  { id:'q11', zh:"世界上有一种生命，它的每一次死亡，都是为了归来。", en:"There is a kind of life whose every death is for the sake of return.",
    who:'jiangnan', theme:'hope', vol:'all', source:"江南 · 龙族", source_en:"Jiang Nan · Dragon Raja" },
  { id:'q12', zh:"如果全世界都背叛了你，我会站在你身后背叛全世界。", en:"If the whole world betrays you, I will stand behind you and betray the world.",
    who:'jiangnan', theme:'love', vol:'all', source:"江南 · 龙族", source_en:"Jiang Nan · Dragon Raja" },
  { id:'q13', zh:"我是来取回我的人生的。", en:"I've come to take back my life.",
    who:'angers', theme:'chunibyou', vol:'v4', source:"龙族Ⅳ · 昂热", source_en:"Vol.4 · Angers" },
  { id:'q14', zh:"我们每个人心里都有一头野兽，只是有人用一辈子去关住它。", en:"Every one of us has a beast inside; some spend a lifetime caging it.",
    who:'angers', theme:'gentle', vol:'all', source:"龙族 · 昂热", source_en:"Dragon Raja · Angers" },
  { id:'q15', zh:"我陈墨瞳想做的事，没人能拦。", en:"Whatever I, Chen Motong, decide to do — no one stops me.",
    who:'nono', theme:'chunibyou', vol:'v1', source:"龙族Ⅰ · 诺诺", source_en:"Vol.1 · Nono" },
  { id:'q16', zh:"比屠龙更难的是温柔。", en:"Gentler than slaying dragons is being gentle.",
    who:'zihang', theme:'gentle', vol:'v2', source:"龙族Ⅱ · 楚子航", source_en:"Vol.2 · Chu Zihang" },
  { id:'q17', zh:"我只是……想做一个普通的女孩子。", en:"I just… wanted to be an ordinary girl.",
    who:'xiami', theme:'gentle', vol:'v2', source:"龙族Ⅱ · 夏弥", source_en:"Vol.2 · Xia Mi" },
  { id:'q18', zh:"东京的雨，下了很久很久。", en:"The rain in Tokyo fell for a very, very long time.",
    who:'jiangnan', theme:'parting', vol:'v3', source:"龙族Ⅲ · 东京雨夜", source_en:"Vol.3 · Tokyo Rain" },
  { id:'q19', zh:"Sakura，最好了。", en:"Sakura is the best.",
    who:'eri', theme:'love', vol:'v3', source:"龙族Ⅲ · 上杉绘梨衣", source_en:"Vol.3 · Uesugi Eri" },
  { id:'q20', zh:"如果世界忘了你，那我替世界记得你。", en:"If the world forgets you, I will remember you in its place.",
    who:'mingfei', theme:'love', vol:'v3', source:"龙族Ⅲ · 路明非", source_en:"Vol.3 · Lu Mingfei" },
  { id:'q21', zh:"四分之一条命，很便宜的，哥哥。", en:"A quarter of a life — cheap, brother.",
    who:'mingze', theme:'chunibyou', vol:'v1', source:"龙族Ⅰ · 路鸣泽", source_en:"Vol.1 · Lu Mingze" },
  { id:'q22', zh:"从今天起，你的名字叫 Sakura。", en:"From today, your name is Sakura.",
    who:'eri', theme:'love', vol:'v3', source:"龙族Ⅲ · 上杉绘梨衣", source_en:"Vol.3 · Uesugi Eri" },
  { id:'q23', zh:"我只是个衰小孩，衰了二十年。", en:"I'm just a loser — twenty years of it.",
    who:'mingfei', theme:'chunibyou', vol:'v1', source:"龙族Ⅰ · 路明非", source_en:"Vol.1 · Lu Mingfei" },
  { id:'q24', zh:"零度以下，是冰海王女的温度。", en:"Below zero — that is the temperature of the ice-sea princess.",
    who:'zero', theme:'chunibyou', vol:'v2', source:"龙族Ⅱ · 零", source_en:"Vol.2 · Zero" },
  { id:'q25', zh:"姐姐……我的姐姐。", en:"Sister… my sister.",
    who:'fenrir', theme:'sacrifice', vol:'v2', source:"龙族Ⅱ · 芬里厄", source_en:"Vol.2 · Fenrir" },
  { id:'q26', zh:"你是龙王，我是混血种，但我们都是小怪兽。", en:"You are a King, I'm a hybrid — but we're both little monsters.",
    who:'mingfei', theme:'gentle', vol:'v2', source:"龙族Ⅱ · 路明非", source_en:"Vol.2 · Lu Mingfei" },
  { id:'q27', zh:"记得买可乐，Sakura。", en:"Remember to buy cola, Sakura.",
    who:'eri', theme:'love', vol:'v3', source:"龙族Ⅲ · 上杉绘梨衣", source_en:"Vol.3 · Uesugi Eri" },
  { id:'q28', zh:"凡走过的路，都算数。", en:"Every road you have walked counts.",
    who:'jiangnan', theme:'hope', vol:'all', source:"江南 · 龙族", source_en:"Jiang Nan · Dragon Raja" },
  { id:'q29', zh:"世界上没有完美的悲剧，只有不愿醒来的梦。", en:"There is no perfect tragedy — only dreams we refuse to wake from.",
    who:'jiangnan', theme:'hope', vol:'all', source:"江南 · 龙族", source_en:"Jiang Nan · Dragon Raja" },
  { id:'q30', zh:"你见过龙吗？它们骄傲、孤独、高贵。", en:"Have you ever seen dragons? Proud, lonely, noble.",
    who:'jiangnan', theme:'gentle', vol:'all', source:"江南 · 龙族", source_en:"Jiang Nan · Dragon Raja" },
  { id:'q31', zh:"我的人生，从来不是你的故事。", en:"My life has never been your story.",
    who:'nono', theme:'love', vol:'v1', source:"龙族Ⅰ · 诺诺", source_en:"Vol.1 · Nono" },
  { id:'q32', zh:"我要一个家。", en:"I want a home.",
    who:'eri', theme:'hope', vol:'v3', source:"龙族Ⅲ · 上杉绘梨衣", source_en:"Vol.3 · Uesugi Eri" }
];

/* 人物索引（筛选用） */
window.QUOTES_PEOPLE = {
  mingfei:   { zh:"路明非",  en:"Lu Mingfei" },
  eri:       { zh:"绘梨衣",  en:"Eri" },
  xiami:     { zh:"夏弥",    en:"Xia Mi" },
  zihang:    { zh:"楚子航",  en:"Chu Zihang" },
  angers:    { zh:"昂热",    en:"Angers" },
  mingze:    { zh:"路鸣泽",  en:"Lu Mingze" },
  nono:      { zh:"诺诺",    en:"Nono" },
  zero:      { zh:"零",      en:"Zero" },
  jiangnan:  { zh:"江南 · 卷首", en:"Jiang Nan" },
  constantine:{ zh:"康斯坦丁", en:"Constantine" },
  fenrir:    { zh:"芬里厄",  en:"Fenrir" },
  chutianjiao:{ zh:"楚天骄", en:"Chu Tianjiao" }
};

/* 主题索引 */
window.QUOTES_THEMES = {
  parting:   { zh:"离别",   en:"Parting" },
  sacrifice: { zh:"牺牲",   en:"Sacrifice" },
  gentle:    { zh:"温柔",   en:"Tenderness" },
  love:      { zh:"爱情",   en:"Love" },
  hope:      { zh:"希望",   en:"Hope" },
  chunibyou: { zh:"中二",   en:"Chuunibyou" }
};

/* 卷次索引 */
window.QUOTES_VOLUMES = {
  v1: { zh:"龙族Ⅰ · 火之晨曦", en:"Vol.1 · Dawn of Fire" },
  v2: { zh:"龙族Ⅱ · 悼亡者之瞳", en:"Vol.2 · Mourner's Eyes" },
  v3: { zh:"龙族Ⅲ · 黑月之潮", en:"Vol.3 · Dark Moon Tide" },
  v4: { zh:"龙族Ⅳ · 奥丁之渊", en:"Vol.4 · Odin's Abyss" },
  v5: { zh:"龙族Ⅴ · 悼亡者的归来", en:"Vol.5 · Return of the Mourner" },
  all:{ zh:"全卷 · 卷首", en:"All · Prologue" }
};
