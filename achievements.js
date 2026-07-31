/* 混血种档案 · 收藏与成就系统（纯 localStorage）
 * 徽章：血统鉴定 / 言灵觉醒 / 屠龙者试炼 / 三十六言灵 / 五卷编年 / EVA 之友 / 语录收藏家
 * 页面通过 data-ach-list / data-ach-bar / data-ach-pct 自动渲染。
 */
(function(){
  "use strict";
  var KEY='dr-ach';
  var ACH=[
    { id:'blood',   icon:'🩸', zh:'血统已鉴定', en:'Bloodline Tested',
      zh_d:'完成一次血统鉴定仪式', en_d:'Complete the bloodline test ritual' },
    { id:'spirit',  icon:'🌊', zh:'言灵觉醒', en:'Spirit Awakened',
      zh_d:'召唤出属于你的言灵', en_d:'Summon your own spirit' },
    { id:'tasks',   icon:'⚔️', zh:'屠龙者试炼', en:'Dragon-Slayer Trial',
      zh_d:'通关全部 7 个 EVA 任务', en_d:'Complete all 7 EVA missions' },
    { id:'codex',   icon:'📜', zh:'三十六言灵', en:'Codex Read',
      zh_d:'读完言灵图鉴全部 36 条', en_d:'Read all 36 spirit entries' },
    { id:'volumes', icon:'📖', zh:'五卷编年', en:'All Five Volumes',
      zh_d:'翻完情节长卷全部五卷', en_d:'Flip through all five volumes' },
    { id:'eva',     icon:'🤖', zh:'EVA 之友', en:"EVA's Friend",
      zh_d:'向 EVA 追问过 8 个不同话题', en_d:'Ask EVA about 8 different topics' },
    { id:'quotes',  icon:'💬', zh:'语录收藏家', en:'Quote Collector',
      zh_d:'在语录图书馆收藏 5 条语录', en_d:'Favorite 5 quotes in the library' }
  ];

  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  var st=load();
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} }

  function byId(id){ for(var i=0;i<ACH.length;i++){ if(ACH[i].id===id) return ACH[i]; } return null; }
  function earned(){ return ACH.filter(function(a){ return !!st[a.id]; }); }
  function pct(){ return ACH.length? Math.round(earned().length/ACH.length*100) : 0; }

  function toastMsg(a){
    return window.LANG==='en'
      ? 'Achievement unlocked: '+a.en+' — '+a.en_d
      : '成就解锁：'+a.zh+' —— '+a.zh_d;
  }
  function earn(id){
    if(!byId(id) || st[id]) return false;
    st[id]=Date.now(); save();
    try{
      window.dispatchEvent(new CustomEvent('dr:ach', { detail:{ id:id } }));
      if(window.DR_ACC && window.DR_ACC.toast) window.DR_ACC.toast(toastMsg(byId(id)));
    }catch(e){}
    return true;
  }

  /* EVA 话题追踪：回答过 8 个不同条目 → 解锁 */
  var topics=[];
  function trackTopic(id){
    if(!id || topics.indexOf(id)>=0) return;
    topics.push(id);
    try{ localStorage.setItem('dr-ach-topics', JSON.stringify(topics)); }catch(e){}
    if(topics.length>=8) earn('eva');
  }
  try{ topics=JSON.parse(localStorage.getItem('dr-ach-topics'))||[]; }catch(e){}

  /* 渲染 */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function render(){
    var isEn=window.LANG==='en';
    document.querySelectorAll('[data-ach-list]').forEach(function(box){
      box.innerHTML='';
      ACH.forEach(function(a){
        var got=!!st[a.id];
        var d=document.createElement('div');
        d.className='ach-badge'+(got?' got':'');
        d.title=(isEn?a.en:a.zh)+' — '+(isEn?a.en_d:a.zh_d);
        d.innerHTML='<span class="ach-icon">'+esc(a.icon)+'</span><span class="ach-name">'+esc(isEn?a.en:a.zh)+'</span><span class="ach-state">'+(got?(isEn?'✓':'✓'):(isEn?'LOCK':'未获得'))+'</span>';
        box.appendChild(d);
      });
    });
    document.querySelectorAll('[data-ach-pct]').forEach(function(el){ el.textContent=pct()+'%'; });
    document.querySelectorAll('[data-ach-bar]').forEach(function(el){ el.style.width=pct()+'%'; });
    document.querySelectorAll('[data-ach-count]').forEach(function(el){
      el.textContent=earned().length+' / '+ACH.length;
    });
    document.querySelectorAll('[data-ach-mini]').forEach(function(box){
      box.innerHTML='';
      ACH.forEach(function(a){
        var s=document.createElement('span');
        s.className='ach-mini'+(st[a.id]?' got':'');
        s.title=(isEn?a.en:a.zh)+' — '+(isEn?a.en_d:a.zh_d);
        s.textContent=a.icon;
        box.appendChild(s);
      });
    });
  }

  /* 自动检测钩子 */
  window.addEventListener('acc:bloodline', function(e){
    var d=e.detail||{};
    earn('blood');
    if(d.spirit) earn('spirit');
  });
  window.addEventListener('acc:login', function(){
    var p=(window.DR_ACC&&window.DR_ACC.current()&&window.DR_ACC.current().profile)||{};
    if(p.bloodLevel) earn('blood');
    if(p.spirit) earn('spirit');
  });
  function checkTasks(){
    try{ if(window.EVA && window.EVA.allDone && window.EVA.allDone()) earn('tasks'); }catch(e){}
  }
  checkTasks();
  setInterval(checkTasks, 4000);

  window.addEventListener('dr:ach', render);
  window.addEventListener('acc:login', render);
  window.addEventListener('acc:logout', render);
  if(window.onLangChange) window.onLangChange(render);
  render();

  window.ACH={
    ACH:ACH, earn:earn, isEarned:function(id){ return !!st[id]; },
    earned:earned, pct:pct, trackTopic:trackTopic, render:render
  };
})();
