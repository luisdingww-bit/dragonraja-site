/* 龙族 · 混血种档案 · 共享脚本（余烬 / 回顶 / 双轨音乐播放器） */
(function(){
  /* ---- 余烬粒子 ---- */
  const embers=document.createElement('div');embers.id='embers';document.body.appendChild(embers);
  const palette=['#bcd8ff','#8fb6e6','#d8b575','#f4cf68','#e17685'];
  for(let i=0;i<46;i++){
    const e=document.createElement('span');e.className='ember';
    const s=Math.random()*2.4+1.4;e.style.width=e.style.height=s+'px';
    e.style.left=Math.random()*100+'vw';
    const c=palette[Math.floor(Math.random()*palette.length)];
    e.style.background='radial-gradient(circle,'+c+','+c+'00)';
    e.style.boxShadow='0 0 6px '+c;
    e.style.animationDuration=(Math.random()*9+7)+'s';
    e.style.animationDelay=(Math.random()*10)+'s';
    embers.appendChild(e);
  }
  const r1=document.createElement('div');r1.className='bg-ring';const r2=document.createElement('div');r2.className='bg-ring two';
  document.body.appendChild(r1);document.body.appendChild(r2);

  /* ---- 回到顶部 ---- */
  const t=document.createElement('a');t.id='toTop';t.href='#';t.textContent='▲ 回到顶端';document.body.appendChild(t);
  window.addEventListener('scroll',()=>{if(window.scrollY>500)t.classList.add('show');else t.classList.remove('show');});
  t.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});

  /* ---- 双轨音乐播放器（双 <audio> + 音量交叉淡入，可靠即时播放） ---- */
  const TRACKS=[
    {name:"最好的旅行",name_en:"Best Travel",src:"travel.mp3"},
    {name:"龙族 · 主题",name_en:"Dragon Raja · Theme",src:"bgm.mp3"}
  ];
  const host=document.createElement('div');host.id='ap';
  host.innerHTML=`<button id="apPrev" title="上一首">◂</button>
    <button id="apPlay" title="播放/暂停">▶</button>
    <button id="apNext" title="下一首">▸</button>
    <span class="ap-info"><span class="ap-eq"><i></i><i></i><i></i></span><span class="ap-name" id="apName">—</span></span>`;
  document.body.appendChild(host);
  const apPlay=host.querySelector('#apPlay'),apName=host.querySelector('#apName');

  const a1=new Audio(),a2=new Audio();
  a1.preload='auto';a2.preload='auto';
  a1.src=TRACKS[0].src;a2.src=TRACKS[1].src;
  a1.volume=0;a2.volume=0;
  let active=a1,idx=0,started=false,playing=false;

  /* 跨页面持久化：记住曲目 / 播放位置 / 是否播放中，整页跳转后自动续播 */
  const STKEY='dr_player_v1';
  let _pendingSeek=null,_lastSave=0;
  function saveState(){
    try{ localStorage.setItem(STKEY, JSON.stringify({idx:idx, time:active&&active.currentTime?active.currentTime:0, playing:playing})); }catch(e){}
  }
  function loadState(){
    try{ return JSON.parse(localStorage.getItem(STKEY)||'null'); }catch(e){ return null; }
  }
  function applySeek(el,t){
    if(el&&isFinite(el.duration)&&el.duration>0){ try{el.currentTime=Math.min(t,el.duration);}catch(e){} }
    else _pendingSeek={el:el,t:t};
  }

  function setName(){apName.textContent=tr(TRACKS[idx],'name');}
  function setPlayingUI(on){
    host.classList.toggle('playing',on);
    apPlay.textContent=on?'❚❚':'▶';
    const bm=document.querySelector('.boot-music');
    if(bm){bm.classList.toggle('on',on);bm.title=on?'暂停音乐':'播放音乐';}
  }
  function elFor(i){return i===0?a1:a2;}
  function fade(el,from,to,ms,cb){
    const steps=30,st=ms/steps;let v=from;
    const iv=setInterval(()=>{
      v+=(to-from)/steps;
      if((to-from>0&&v>=to)||(to-from<0&&v<=to)){v=to;clearInterval(iv);el.volume=to;cb&&cb();}
      else el.volume=v;
    },st);
  }
  function startPlayback(el,fromTime){
    idx=(el===a1)?0:1;setName();
    applySeek(el,fromTime||0);
    el.volume=0;
    const p=el.play();if(p&&p.catch)p.catch(()=>{
      const g=()=>{resume();};  /* 自动播放被拦截：等下次手势再续 */
      document.addEventListener('click',g,{once:true});
      document.addEventListener('keydown',g,{once:true});
    });
    active=el;playing=true;started=true;setPlayingUI(true);
    fade(el,0,1,900);saveState();
  }
  function playTrack(i){
    idx=((i%TRACKS.length)+TRACKS.length)%TRACKS.length;
    setName();
    const next=elFor(idx),prev=active;
    next.currentTime=0;
    const p=next.play();if(p&&p.catch)p.catch(()=>{});
    if(next===prev){fade(next,next.volume,1,1400);}
    else{fade(next,0,1,1400);if(prev)fade(prev,prev.volume,0,1400,()=>{try{prev.pause();}catch(e){}});}
    active=next;playing=true;started=true;setPlayingUI(true);saveState();
  }
  [a1,a2].forEach(el=>{
    el.addEventListener('ended',()=>{if(active===el)playTrack((idx+1)%TRACKS.length);});
    el.addEventListener('loadedmetadata',()=>{ if(_pendingSeek&&_pendingSeek.el===el){ try{el.currentTime=Math.min(_pendingSeek.t,el.duration);}catch(e){} _pendingSeek=null; } });
    el.addEventListener('timeupdate',()=>{ if(playing){ const n=Date.now(); if(n-_lastSave>800){_lastSave=n;saveState();} } });
    el.addEventListener('waiting',()=>host.classList.add('buffering'));
    el.addEventListener('stalled',()=>host.classList.add('buffering'));
    el.addEventListener('playing',()=>host.classList.remove('buffering'));
    el.addEventListener('canplay',()=>host.classList.remove('buffering'));
  });
  function pause(){try{active.pause();}catch(e){}playing=false;setPlayingUI(false);saveState();}
  function resume(){active.volume=1;const p=active.play();if(p&&p.catch)p.catch(()=>{});playing=true;setPlayingUI(true);saveState();}

  apPlay.addEventListener('click',()=>{if(!started){playTrack(0);return;}playing?pause():resume();});
  host.querySelector('#apNext').addEventListener('click',()=>{if(!started){playTrack(1);return;}playTrack((idx+1)%TRACKS.length);});
  host.querySelector('#apPrev').addEventListener('click',()=>{if(!started){playTrack(0);return;}playTrack((idx-1+TRACKS.length)%TRACKS.length);});

  window.AP={
    play:()=>{if(!started){playTrack(0);}else if(!playing){resume();}},
    toggle:()=>{if(!started){playTrack(0);return;}playing?pause():resume();},
    playTrack,
    isPlaying:()=>playing
  };

  /* 进入新页面：若之前在播放则自动续播；若已暂停则恢复位置待播（不再中断） */
  (function restore(){
    const s=loadState(); if(!s) return;
    idx=(s.idx===0)?0:1; active=elFor(idx); setName();
    applySeek(active, s.time||0);
    if(s.playing){ startPlayback(active, s.time||0); }
    else { started=true; setPlayingUI(false); }
  })();
  window.addEventListener('beforeunload',saveState);
  window.addEventListener('pagehide',saveState);

  if(window.onLangChange) window.onLangChange(()=>{ if(started) setName(); });
})();