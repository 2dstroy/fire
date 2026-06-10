// Default stubs so solo works even if Firebase is unconfigured
window._db = null;
window._firestoreOk = false;
window._fs = {};

// ══════════════════════════════════════════════════════════
//  CHARACTER CUSTOMIZATION
// ══════════════════════════════════════════════════════════
const BODY_COLORS = ['#5BA3F0','#00C896','#E05C4A','#C8A96E','#A855F7','#F97316','#EC4899','#FFFFFF'];
const ACCENT_COLORS = ['#2E86C1','#00956e','#C0392B','#8B6914','#7C3AED','#C2410C','#BE185D','#888888'];
const SHAPES = ['circle','square','diamond'];

let charCfg = {
  name: localStorage.getItem('ozh_name') || 'GHOST_7',
  body: localStorage.getItem('ozh_body') || '#5BA3F0',
  accent: localStorage.getItem('ozh_accent') || '#2E86C1',
  shape: localStorage.getItem('ozh_shape') || 'circle',
};

function saveChar() {
  localStorage.setItem('ozh_name', charCfg.name);
  localStorage.setItem('ozh_body', charCfg.body);
  localStorage.setItem('ozh_accent', charCfg.accent);
  localStorage.setItem('ozh_shape', charCfg.shape);
}

// Build swatch pickers
function buildSwatches(containerId, colors, key) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  colors.forEach(c => {
    const s = document.createElement('div');
    s.className = 'swatch' + (charCfg[key] === c ? ' selected' : '');
    s.style.background = c;
    s.addEventListener('click', () => {
      charCfg[key] = c;
      el.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'));
      s.classList.add('selected');
      // sync accent if body changed
      if (key === 'body') {
        const bi = BODY_COLORS.indexOf(c);
        if (bi >= 0) charCfg.accent = ACCENT_COLORS[bi];
        buildSwatches('accent-swatches', ACCENT_COLORS, 'accent');
      }
      saveChar();
      drawPreview();
    });
    el.appendChild(s);
  });
}

function buildShapes() {
  const el = document.getElementById('shape-opts');
  el.innerHTML = '';
  const svgs = {
    circle: `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg>`,
    square: `<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor"/></svg>`,
    diamond: `<svg viewBox="0 0 20 20"><polygon points="10,1 19,10 10,19 1,10" fill="currentColor"/></svg>`,
  };
  SHAPES.forEach(sh => {
    const d = document.createElement('div');
    d.className = 'shape-opt' + (charCfg.shape === sh ? ' selected' : '');
    d.style.color = charCfg.body;
    d.innerHTML = svgs[sh];
    d.title = sh;
    d.addEventListener('click', () => {
      charCfg.shape = sh;
      el.querySelectorAll('.shape-opt').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
      saveChar();
      drawPreview();
    });
    el.appendChild(d);
  });
}

function drawPreview() {
  const cv = document.getElementById('char-canvas-preview');
  const cx = cv.getContext('2d');
  cx.clearRect(0,0,100,100);
  cx.fillStyle = '#141820';
  cx.fillRect(0,0,100,100);
  drawCharacterShape(cx, 50, 50, 18, charCfg.body, charCfg.accent, charCfg.shape, 0);
  cx.fillStyle = charCfg.body;
  cx.font = 'bold 8px Share Tech Mono';
  cx.textAlign = 'center';
  cx.fillText(charCfg.name || '—', 50, 85);
}

document.getElementById('char-name').value = charCfg.name;
document.getElementById('char-name').addEventListener('input', e => {
  charCfg.name = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g,'').slice(0,12);
  e.target.value = charCfg.name;
  saveChar();
  drawPreview();
});

buildSwatches('body-swatches', BODY_COLORS, 'body');
buildSwatches('accent-swatches', ACCENT_COLORS, 'accent');
buildShapes();
drawPreview();

// Expose charCfg globally
window._charCfg = charCfg;

// ══════════════════════════════════════════════════════════
//  MULTIPLAYER LOBBY (Firestore)
// ══════════════════════════════════════════════════════════
let myEmail = '';
let myRoomId = '';
let lobbyUnsub = null;

function mpStatus(msg, color='#8a9199') {
  const el = document.getElementById('mp-status');
  el.textContent = msg;
  el.style.color = color;
}

function randRoomId() {
  const words = ['ALPHA','BRAVO','DELTA','ECHO','FOXTROT','GHOST','NOVA','SIGMA','TANGO','ZERO'];
  return words[Math.floor(Math.random()*words.length)] + '-' + Math.floor(Math.random()*90+10);
}

function renderLobby(data) {
  const box = document.getElementById('lobby-box');
  box.innerHTML = '';
  const players = data.players || {};
  Object.entries(players).forEach(([email, info]) => {
    const row = document.createElement('div');
    row.className = 'lobby-player-row';
    const dot = document.createElement('div');
    dot.className = 'lobby-color-dot';
    dot.style.background = info.body || '#5BA3F0';
    const name = document.createElement('span');
    name.className = 'lobby-name';
    name.textContent = info.name || email.split('@')[0];
    row.appendChild(dot);
    row.appendChild(name);
    if (email === myEmail) {
      const you = document.createElement('span');
      you.className = 'lobby-you';
      you.textContent = '(YOU)';
      row.appendChild(you);
    }
    box.appendChild(row);
  });
  // Show start if host and 2+ players
  const isHost = data.host === myEmail;
  const count = Object.keys(players).length;
  const startBtn = document.getElementById('lobby-start-btn');
  startBtn.style.display = (isHost && count >= 1) ? 'block' : 'none';
}

async function joinOrCreate() {
  if (!window._firestoreOk) { mpStatus('⚠ Firebase not configured. Edit firebaseConfig in the HTML.', '#e05c4a'); return; }
  const { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField, serverTimestamp } = window._fs;
  const db = window._db;
  const email = document.getElementById('mp-email').value.trim().toLowerCase();
  if (!email || !email.includes('@')) { mpStatus('ENTER A VALID EMAIL', '#e05c4a'); return; }
  myEmail = email;

  let room = document.getElementById('mp-room').value.trim().toUpperCase().replace(/\s+/g,'-') || randRoomId();
  myRoomId = room;
  document.getElementById('lobby-room-code').textContent = room;
  mpStatus('CONNECTING…', '#c8a96e');

  try {
    const roomRef = doc(db, 'ozh_rooms', room);
    const snap = await getDoc(roomRef);
    const playerData = {
      name: charCfg.name || email.split('@')[0].toUpperCase(),
      body: charCfg.body,
      accent: charCfg.accent,
      shape: charCfg.shape,
      joinedAt: serverTimestamp(),
    };

    if (!snap.exists()) {
      // Create room
      await setDoc(roomRef, {
        host: email,
        created: serverTimestamp(),
        status: 'lobby',
        players: { [email]: playerData },
      });
    } else {
      // Join room
      const existing = snap.data();
      if (existing.status === 'playing') { mpStatus('MATCH IN PROGRESS — TRY ANOTHER ROOM', '#e05c4a'); return; }
      await updateDoc(roomRef, { [`players.${email.replace(/\./g,'_')}`]: playerData });
    }

    // Show lobby UI
    document.getElementById('lobby-section').style.display = 'block';
    document.getElementById('mp-join-btn').style.display = 'none';
    mpStatus('CONNECTED ✓', '#00ff88');

    // Subscribe to room
    if (lobbyUnsub) lobbyUnsub();
    lobbyUnsub = onSnapshot(roomRef, (s) => {
      if (!s.exists()) return;
      const data = s.data();
      // Normalize players key (dots replaced with underscores in Firestore)
      renderLobby(data);
      if (data.status === 'playing' && data.startedBy) {
        // Game started by host
        startGameFromLobby(data);
      }
    });

  } catch(err) {
    mpStatus('ERROR: ' + err.message, '#e05c4a');
  }
}

async function leaveRoom() {
  if (!myRoomId || !myEmail) return;
  if (lobbyUnsub) { lobbyUnsub(); lobbyUnsub = null; }
  try {
    const { doc, updateDoc, deleteField } = window._fs;
    const db = window._db;
    const roomRef = doc(db, 'ozh_rooms', myRoomId);
    const emailKey = myEmail.replace(/\./g,'_');
    await updateDoc(roomRef, { [`players.${emailKey}`]: deleteField() });
  } catch(e){}
  myRoomId = '';
  document.getElementById('lobby-section').style.display = 'none';
  document.getElementById('mp-join-btn').style.display = 'block';
  document.getElementById('mp-room').value = '';
  mpStatus('ENTER EMAIL TO JOIN OR CREATE A ROOM');
}

async function startMatchAsHost() {
  if (!myRoomId) return;
  const { doc, updateDoc } = window._fs;
  const db = window._db;
  const roomRef = doc(db, 'ozh_rooms', myRoomId);
  await updateDoc(roomRef, { status: 'playing', startedBy: myEmail });
}

function startGameFromLobby(data) {
  // Build online player list for in-game panel
  window._onlinePlayers = data.players || {};
  window._myEmail = myEmail;
  if (lobbyUnsub) { lobbyUnsub(); lobbyUnsub = null; }
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  document.getElementById('online-panel').style.display = 'flex';
  updateOnlinePanel(data.players);
  initRound();
  loop();
}

function updateOnlinePanel(players) {
  const list = document.getElementById('online-list');
  list.innerHTML = '';
  Object.entries(players || {}).forEach(([email, info]) => {
    const row = document.createElement('div');
    row.className = 'online-player';
    const dot = document.createElement('div');
    dot.className = 'online-dot';
    dot.style.background = info.body || '#5BA3F0';
    const name = document.createElement('span');
    name.style.color = email === myEmail ? '#c8a96e' : '#8a9199';
    name.textContent = info.name || email.split('@')[0];
    row.appendChild(dot);
    row.appendChild(name);
    list.appendChild(row);
  });
}

// Wire buttons
document.getElementById('mp-join-btn').addEventListener('click', joinOrCreate);
document.getElementById('lobby-start-btn').addEventListener('click', startMatchAsHost);
document.getElementById('lobby-leave-btn').addEventListener('click', leaveRoom);

// Tab switching
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'character') drawPreview();
  });
});

// Solo start
document.getElementById('mm-start').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  initRound();
  loop();
});

// ══════════════════════════════════════════════════════════
//  GAME ENGINE
// ══════════════════════════════════════════════════════════

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniCanvas = document.getElementById('minimap');
const mctx = miniCanvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 40, MAP_W = 30, MAP_H = 22, PLAYER_R = 10;
const BULLET_SPEED = 14, ENEMY_SPEED = 1.2;
const ROUND_TIME = 115, BUY_TIME = 20, BOMB_TIME = 40;
const DEFUSE_TIME = 5, PLANT_TIME = 3;

const WEAPONS = {
  glock:  {name:'GLOCK-17',dmg:22,rof:100,reload:1.5,mag:15,reserve:45,spread:0.08,auto:false,cost:200,type:'Pistol'},
  usp:    {name:'USP-S',   dmg:25,rof:120,reload:2.0,mag:12,reserve:36,spread:0.05,auto:false,cost:300,type:'Pistol'},
  deagle: {name:'DEAGLE', dmg:98,rof:200,reload:2.2,mag:7, reserve:35,spread:0.06,auto:false,cost:700,type:'Pistol'},
  mp5:    {name:'MP5-SD', dmg:28,rof:80,reload:2.0,mag:30,reserve:120,spread:0.06,auto:true, cost:1500,type:'SMG'},
  ak47:   {name:'AK-47',  dmg:86,rof:150,reload:2.5,mag:30,reserve:90, spread:0.10,auto:true, cost:2700,type:'Rifle'},
  m4a1:   {name:'M4A1-S', dmg:74,rof:160,reload:3.1,mag:20,reserve:80, spread:0.05,auto:true, cost:2900,type:'Rifle'},
  awp:    {name:'AWP',    dmg:999,rof:200,reload:3.7,mag:5,reserve:30,spread:0.01,auto:false,cost:4750,type:'Sniper'},
  helmet: {name:'HELMET', cost:350,type:'Equipment'},
  armor:  {name:'ARMOR',  cost:650,type:'Equipment'},
  he:     {name:'HE GREN',cost:300,type:'Grenade'},
};

const RAW_MAP = [
  '111111111111111111111111111111',
  '130000000001000000000010000031',
  '100011100001000000000010001001',
  '100011100001000011110010001001',
  '100000000001000011110010000001',
  '100000000001000000000010000001',
  '111001111001000000000001001111',
  '100001000001111001110001000001',
  '100001000000000000000000000001',
  '100001000000000000000000000001',
  '100000000001110001110001000001',
  '100000011100000000000111000001',
  '100000011100000000000111000001',
  '100000000001110001110001000001',
  '100001000000000000000000000001',
  '100001000000000000000000000001',
  '100001000001111001110001000001',
  '111001111001000000000001001111',
  '100000000001000000000010000001',
  '100011100001000022220010001001',
  '140000000001000022220010000041',
  '111111111111111111111111111111',
];
const MAP_DATA = RAW_MAP.map(r=>r.split('').map(Number));

let gameState='menu', camera={x:0,y:0};
let ctSpawns=[],tSpawns=[],bombsites=[];
MAP_DATA.forEach((row,r)=>row.forEach((cell,c)=>{
  if(cell===3) ctSpawns.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
  if(cell===4) tSpawns.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
  if(cell===2) bombsites.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
}));
let bombsite = bombsites[Math.floor(bombsites.length/2)];

const player = {
  x:0,y:0,angle:0,
  hp:100,armor:0,hasHelmet:false,
  money:800,
  weapons:[{...WEAPONS.usp,ammo:12,reserve:36,key:'usp'}],
  activeWeapon:0,
  hasBomb:false,
  lastShot:0,reloading:false,reloadEnd:0,
  alive:true,isT:false,
  get name(){ return window._charCfg?.name || 'GHOST_7'; },
  get bodyColor(){ return window._charCfg?.body || '#5BA3F0'; },
  get accentColor(){ return window._charCfg?.accent || '#2E86C1'; },
  get shape(){ return window._charCfg?.shape || 'circle'; },
};

let enemies=[],bullets=[],effects=[],killfeed=[];
let bomb={planted:false,x:0,y:0,timer:0,defusing:false,defuseProgress:0,planting:false,plantProgress:0,siteLabel:'A'};
let round={num:1,ctScore:0,tScore:0,timer:ROUND_TIME,phase:'buy',phaseTimer:BUY_TIME};
let nextRoundTimer=0, isBuyOpen=false;
let keys={}, mouseX=0, mouseY=0, mouseDown=false;

function isWall(x,y){
  const c=Math.floor(x/TILE),r=Math.floor(y/TILE);
  if(r<0||r>=MAP_H||c<0||c>=MAP_W) return true;
  return MAP_DATA[r][c]===1;
}
function moveWithCollision(obj,dx,dy){
  const r=PLAYER_R;
  let nx=obj.x+dx,ny=obj.y+dy;
  if(!isWall(nx-r,obj.y-r)&&!isWall(nx+r,obj.y-r)&&!isWall(nx-r,obj.y+r)&&!isWall(nx+r,obj.y+r)) obj.x=nx;
  nx=obj.x;
  if(!isWall(nx-r,ny-r)&&!isWall(nx+r,ny-r)&&!isWall(nx-r,ny+r)&&!isWall(nx+r,ny+r)) obj.y=ny;
}
function hasLOS(ax,ay,bx,by){
  const dist=Math.hypot(bx-ax,by-ay);
  const steps=Math.ceil(dist/8);
  for(let i=1;i<steps;i++){
    const tx=ax+(bx-ax)*i/steps,ty=ay+(by-ay)*i/steps;
    if(isWall(tx,ty)) return false;
  }
  return true;
}

// ── CHARACTER SHAPE DRAWING ──────────────────────
function drawCharacterShape(context, x, y, radius, bodyColor, accentColor, shape, angle, isPlayer=false, name='') {
  context.save();
  context.translate(x, y);
  context.rotate(angle);

  // Shadow
  context.fillStyle='rgba(0,0,0,0.3)';
  context.beginPath();
  if(shape==='square') context.rect(-radius+2,-radius*0.7+2,radius*2,radius*1.4);
  else context.ellipse(2,2,radius,radius*0.7,0,0,Math.PI*2);
  context.fill();

  // Body
  context.fillStyle=bodyColor;
  if(shape==='circle') {
    context.beginPath(); context.arc(0,0,radius,0,Math.PI*2); context.fill();
  } else if(shape==='square') {
    const s=radius*1.2;
    context.beginPath(); context.roundRect(-s,-s,s*2,s*2,3); context.fill();
  } else if(shape==='diamond') {
    context.beginPath();
    context.moveTo(0,-radius*1.2); context.lineTo(radius*1.2,0);
    context.lineTo(0,radius*1.2); context.lineTo(-radius*1.2,0);
    context.closePath(); context.fill();
  }

  // Outline
  context.strokeStyle=accentColor;
  context.lineWidth=isPlayer?2.5:1.5;
  context.stroke();

  // Gun barrel
  context.fillStyle=accentColor;
  context.fillRect(radius-2,-2,10,4);

  // Head dot
  context.fillStyle='rgba(255,255,255,0.35)';
  context.beginPath(); context.arc(3,0,4,0,Math.PI*2); context.fill();

  context.restore();

  // Name tag above
  if(name) {
    context.save();
    context.font='bold 8px Share Tech Mono';
    context.textAlign='center';
    context.fillStyle=bodyColor;
    context.fillText(name, x, y - radius - 6);
    context.restore();
  }
}

function spawnEnemy(spawn,id){
  const w=id===0?'ak47':id===1?'mp5':'glock';
  const wdata={...WEAPONS[w],ammo:WEAPONS[w].mag,reserve:WEAPONS[w].reserve,key:w};
  const names=['PHANTOM','KARAK','SLEDGE','WRAITH','IGNITION'];
  const eColors=['#E05C4A','#FF6B35','#C0392B','#E74C3C','#922B21'];
  return {
    x:spawn.x,y:spawn.y,angle:0,
    hp:100,armor:id<2?50:0,
    weapon:wdata,lastShot:0,
    alive:true,isT:true,
    hasBomb:id===0,id,
    name:names[id%names.length],
    bodyColor:eColors[id%eColors.length],
    accentColor:'#8B1A1A',
    shape:'circle',
    state:'patrol',targetX:spawn.x,targetY:spawn.y,
    patrolTimer:0,seenPlayer:false,
  };
}

function initRound(){
  const sp=ctSpawns[Math.floor(Math.random()*ctSpawns.length)];
  player.x=sp.x; player.y=sp.y; player.alive=true;
  player.hp=100; player.hasBomb=false;
  if(player.weapons.length===0) player.weapons=[{...WEAPONS.usp,ammo:WEAPONS.usp.mag,reserve:WEAPONS.usp.reserve,key:'usp'}];
  player.weapons.forEach(w=>{w.ammo=Math.min(w.ammo+Math.ceil(w.mag/2),w.mag);});
  player.reloading=false;
  player.activeWeapon=Math.min(player.activeWeapon,player.weapons.length-1);
  enemies=[];
  const numE=Math.min(3+Math.floor(round.num/3),5);
  for(let i=0;i<numE;i++){
    const sp2=tSpawns[i%tSpawns.length];
    enemies.push(spawnEnemy({x:sp2.x+(Math.random()-0.5)*20,y:sp2.y+(Math.random()-0.5)*20},i));
  }
  bullets=[]; effects=[];
  bomb.planted=false; bomb.timer=0; bomb.defusing=false; bomb.defuseProgress=0; bomb.planting=false; bomb.plantProgress=0;
  if(round.phase==='buy') document.getElementById('buy-phase-banner').style.display='block';
  round.timer=ROUND_TIME;
  round.phase='buy';
  round.phaseTimer=BUY_TIME;
  updateHUD();
}

function updateHUD(){
  const w=player.weapons[player.activeWeapon];
  if(w) {
    document.getElementById('weapon-info').textContent=w.name;
    document.getElementById('ammo-info').textContent=w.ammo+'/'+w.reserve;
  }
  document.getElementById('money').textContent='$'+player.money;
  document.getElementById('health-num').textContent=Math.max(0,player.hp);
  document.getElementById('hp-fill').style.width=(Math.max(0,player.hp)/100)*100+'%';
  document.getElementById('armor-num').textContent='♦ '+player.armor;

  // Team pips
  const ctPips=document.getElementById('ct-pips');
  const tPips=document.getElementById('t-pips');
  ctPips.innerHTML=''; tPips.innerHTML='';
  const ct=[player].concat(enemies.filter(e=>!e.isT));
  const t=enemies.filter(e=>e.isT);
  ct.forEach(e=>{
    const p=document.createElement('div');
    p.className='pip ct'+(e.alive?'':' dead');
    ctPips.appendChild(p);
  });
  t.forEach(e=>{
    const p=document.createElement('div');
    p.className='pip t'+(e.alive?'':' dead');
    tPips.appendChild(p);
  });

  // Scores
  document.getElementById('score-ct').textContent=round.ctScore;
  document.getElementById('score-t').textContent=round.tScore;

  // Timer
  const m=Math.floor(round.timer/60),s=(round.timer%60).toFixed(0).padStart(2,'0');
  document.getElementById('round-timer').textContent=m+':'+s;
}

document.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true; handleKeyDown(e);});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
document.addEventListener('mousemove',e=>{mouseX=e.clientX; mouseY=e.clientY;});
document.addEventListener('mousedown',()=>{mouseDown=true;});
document.addEventListener('mouseup',()=>{mouseDown=false;});

function handleKeyDown(e){
  if(e.key.toLowerCase()==='b'&&player.alive) {
    isBuyOpen=!isBuyOpen;
    if(isBuyOpen) openBuyMenu();
    else closeBuyMenu();
  }
  if(e.key.toLowerCase()==='r'&&player.alive&&!player.reloading) {
    startReload();
  }
  if(e.key==='f'||e.key==='F'){
    if(bomb.planted&&Math.hypot(player.x-bomb.x,player.y-bomb.y)<50&&!bomb.defusing) {
      bomb.defusing=true;
      bomb.defuseProgress=0;
    }
    if(round.phase==='buy'&&!bomb.planted&&Math.hypot(player.x-bombsite.x,player.y-bombsite.y)<50&&!bomb.planting) {
      bomb.planting=true;
      bomb.plantProgress=0;
    }
  }
  if(e.key==='1') switchWeapon(0);
  if(e.key==='2') switchWeapon(1);
  if(e.key==='3') switchWeapon(2);
}

function switchWeapon(idx){
  if(idx<player.weapons.length) player.activeWeapon=idx;
}

function startReload(){
  if(player.weapons.length===0) return;
  const w=player.weapons[player.activeWeapon];
  if(w.ammo===w.mag||w.reserve===0) return;
  player.reloading=true;
  player.reloadEnd=performance.now()+w.reload*1000;
  document.getElementById('reload-bar').style.display='block';
}

function openBuyMenu(){
  const menu=document.getElementById('buy-menu');
  menu.style.display='flex';
  const items=document.getElementById('buy-items');
  items.innerHTML='';
  Object.entries(WEAPONS).forEach(([key,weapon])=>{
    const canAfford=player.money>=weapon.cost;
    const item=document.createElement('div');
    item.className='buy-item'+(canAfford?'':' cant-afford');
    item.innerHTML=`<div class="bi-type">${weapon.type}</div><div class="bi-name">${weapon.name}</div><div class="bi-cost">$${weapon.cost}</div>`;
    if(canAfford) {
      item.addEventListener('click',()=>{
        if(weapon.type==='Pistol'||weapon.type==='SMG'||weapon.type==='Rifle'||weapon.type==='Sniper') {
          player.weapons=[{...weapon,ammo:weapon.mag,reserve:weapon.reserve,key}];
          player.activeWeapon=0;
          player.money-=weapon.cost;
        } else if(weapon.type==='Equipment') {
          if(key==='armor') player.armor=100;
          if(key==='helmet') player.hasHelmet=true;
          player.money-=weapon.cost;
        }
        closeBuyMenu();
        isBuyOpen=false;
        updateHUD();
      });
    }
    items.appendChild(item);
  });
}

function closeBuyMenu(){
  document.getElementById('buy-menu').style.display='none';
}

function playerShoot(){
  if(player.weapons.length===0||!player.alive) return;
  const w=player.weapons[player.activeWeapon];
  const now=performance.now();
  if(w.ammo===0||now-player.lastShot<(1000/w.rof)) return;
  player.lastShot=now;
  w.ammo--;

  const spread=w.spread;
  const angle=player.angle+(Math.random()-0.5)*spread;
  const bx=player.x+Math.cos(angle)*10;
  const by=player.y+Math.sin(angle)*10;
  bullets.push({x:bx,y:by,vx:Math.cos(angle)*BULLET_SPEED,vy:Math.sin(angle)*BULLET_SPEED,owner:'player',dmg:w.dmg,life:2.0});

  effects.push({x:bx,y:by,type:'muzzle',life:0.1});
  updateHUD();
}

function enemyShoot(enemy){
  if(!enemy.alive||enemy.weapon.ammo===0) return;
  const now=performance.now();
  if(now-enemy.lastShot<(1000/enemy.weapon.rof)) return;
  enemy.lastShot=now;
  enemy.weapon.ammo--;

  const spread=enemy.weapon.spread*2;
  const angle=enemy.angle+(Math.random()-0.5)*spread;
  const bx=enemy.x+Math.cos(angle)*10;
  const by=enemy.y+Math.sin(angle)*10;
  bullets.push({x:bx,y:by,vx:Math.cos(angle)*BULLET_SPEED,vy:Math.sin(angle)*BULLET_SPEED,owner:'enemy',dmg:enemy.weapon.dmg,life:2.0});
}

function updateBullets(){
  bullets=bullets.filter(b=>{
    b.x+=b.vx; b.y+=b.vy; b.life-=1/60;
    if(b.life<=0) return false;
    if(isWall(b.x,b.y)) return false;

    // Check collision with player
    if(b.owner==='enemy'&&player.alive&&Math.hypot(b.x-player.x,b.y-player.y)<PLAYER_R) {
      let dmg=b.dmg;
      if(player.armor>0) dmg*=0.5;
      player.armor-=dmg*0.25;
      player.hp-=dmg;
      if(player.hp<=0) {
        player.alive=false;
        document.getElementById('dead-msg').style.display='block';
      }
      return false;
    }

    // Check collision with enemies
    if(b.owner==='player') {
      enemies.forEach(e=>{
        if(e.alive&&Math.hypot(b.x-e.x,b.y-e.y)<PLAYER_R) {
          let dmg=b.dmg;
          if(e.armor>0) dmg*=0.5;
          e.armor-=dmg*0.25;
          e.hp-=dmg;
          if(e.hp<=0) {
            e.alive=false;
            addKillFeed(player.name,e.name,'bullet');
          }
        }
      });
    }
    return true;
  });
}

function addKillFeed(killer,victim,weapon){
  const entry=document.createElement('div');
  entry.className='kf-entry kf-ct';
  entry.innerHTML=`<span class="kf-killer">${killer}</span> <span class="kf-weapon">${weapon}</span> <span class="kf-victim">${victim}</span>`;
  document.getElementById('killfeed').appendChild(entry);
  setTimeout(()=>entry.remove(),5000);
}

function updateEnemyAI(){
  enemies.forEach(enemy=>{
    if(!enemy.alive) return;
    const dx=player.x-enemy.x,dy=player.y-enemy.y,dist=Math.hypot(dx,dy);
    enemy.angle=Math.atan2(dy,dx);

    // Can they see player?
    if(hasLOS(enemy.x,enemy.y,player.x,player.y)&&dist<300) {
      enemy.seenPlayer=true;
      if(dist<200) {
        enemyShoot(enemy);
      }
      enemy.state='chase';
      enemy.targetX=player.x;
      enemy.targetY=player.y;
    } else {
      enemy.seenPlayer=false;
      if(enemy.state==='chase'&&Math.hypot(dx,dy)>400) {
        enemy.state='patrol';
        const site=bombsites[Math.floor(Math.random()*bombsites.length)];
        enemy.targetX=site.x+(Math.random()-0.5)*100;
        enemy.targetY=site.y+(Math.random()-0.5)*100;
      }
    }

    // Move
    const tdx=enemy.targetX-enemy.x,tdy=enemy.targetY-enemy.y,tdist=Math.hypot(tdx,tdy);
    if(tdist>10) {
      moveWithCollision(enemy,tdx/tdist*ENEMY_SPEED,tdy/tdist*ENEMY_SPEED);
    }

    // Patrol timer
    if(enemy.state==='patrol') {
      enemy.patrolTimer++;
      if(enemy.patrolTimer>300) {
        const site=bombsites[Math.floor(Math.random()*bombsites.length)];
        enemy.targetX=site.x+(Math.random()-0.5)*100;
        enemy.targetY=site.y+(Math.random()-0.5)*100;
        enemy.patrolTimer=0;
      }
    }
  });
}

function updateRound(){
  round.timer-=1/60;
  round.phaseTimer-=1/60;

  if(round.phase==='buy'&&round.phaseTimer<=0) {
    round.phase='action';
    round.phaseTimer=0;
    document.getElementById('buy-phase-banner').style.display='none';
    isBuyOpen=false;
    closeBuyMenu();
  }

  // Check bomb plant
  if(bomb.planting&&player.alive) {
    bomb.plantProgress+=1/60;
    if(bomb.plantProgress>=PLANT_TIME) {
      bomb.planted=true;
      bomb.planting=false;
      bomb.x=bombsite.x;
      bomb.y=bombsite.y;
      bomb.timer=BOMB_TIME;
      bomb.siteLabel='A';
      document.getElementById('bomb-status').style.display='flex';
    }
  }

  // Check bomb defuse
  if(bomb.defusing&&player.alive&&Math.hypot(player.x-bomb.x,player.y-bomb.y)<50) {
    bomb.defuseProgress+=1/60;
    if(bomb.defuseProgress>=DEFUSE_TIME) {
      bomb.planted=false;
      bomb.defusing=false;
      bomb.timer=0;
      document.getElementById('bomb-status').style.display='none';
      endRound('ct','BOMB DEFUSED',0);
    }
  } else {
    bomb.defusing=false;
    bomb.defuseProgress=0;
  }

  // Check bomb timer
  if(bomb.planted) {
    bomb.timer-=1/60;
    if(bomb.timer<=0) {
      endRound('t','BOMB EXPLODED',3250);
    }
  }

  // Check round end conditions
  const aliveEnemies=enemies.filter(e=>e.alive).length;
  const alivePlayer=player.alive?1:0;
  if(aliveEnemies===0&&bomb.planted===false) {
    endRound('ct','ALL TERRORISTS ELIMINATED',3250);
  }
  if(alivePlayer===0&&!bomb.planted) {
    endRound('t','ALL CTS ELIMINATED',0);
  }
  if(round.timer<=0&&bomb.planted===false) {
    if(aliveEnemies>0) endRound('t','TIME EXPIRED',0);
    else endRound('ct','TIME EXPIRED',3250);
  }

  updateHUD();
}

function endRound(winner,reason,reward){
  if(winner==='ct') round.ctScore++;
  else round.tScore++;
  player.money+=reward;

  const el=document.getElementById('round-end');
  el.querySelector('#re-title').textContent=winner.toUpperCase()+' WIN';
  el.querySelector('#re-reason').textContent=reason;
  el.querySelector('#re-rewards').textContent='+$'+reward;
  el.style.display='flex';
  nextRoundTimer=4;
}

function updateEffects(){
  effects=effects.filter(e=>{
    e.life-=1/60;
    return e.life>0;
  });
}

function drawGame(){
  ctx.fillStyle='#0a0f14';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // World camera
  camera.x=player.x-canvas.width/2;
  camera.y=player.y-canvas.height/2;

  ctx.save();
  ctx.translate(-camera.x,-camera.y);

  // Draw map
  for(let r=0;r<MAP_H;r++) {
    for(let c=0;c<MAP_W;c++) {
      const cell=MAP_DATA[r][c];
      const x=c*TILE,y=r*TILE;
      if(cell===1) {
        ctx.fillStyle='#1a2332';
        ctx.fillRect(x,y,TILE,TILE);
        ctx.strokeStyle='#3a4a5a';
        ctx.lineWidth=2;
        ctx.strokeRect(x,y,TILE,TILE);
      }
      if(cell===2) {
        ctx.fillStyle='rgba(200,169,110,0.1)';
        ctx.fillRect(x,y,TILE,TILE);
        ctx.strokeStyle='rgba(200,169,110,0.4)';
        ctx.lineWidth=2;
        ctx.strokeRect(x,y,TILE,TILE);
        ctx.fillStyle='#c8a96e';
        ctx.font='bold 12px Share Tech Mono';
        ctx.textAlign='center';
        ctx.fillText('A',x+TILE/2,y+TILE/2+4);
      }
    }
  }

  // Draw bomb
  if(bomb.planted) {
    ctx.fillStyle='#c0392b';
    ctx.beginPath();
    ctx.arc(bomb.x,bomb.y,8,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='#ff0000';
    ctx.lineWidth=2;
    ctx.stroke();
  }

  // Draw bullets
  bullets.forEach(b=>{
    ctx.fillStyle='#ffff00';
    ctx.beginPath();
    ctx.arc(b.x,b.y,2,0,Math.PI*2);
    ctx.fill();
  });

  // Draw player
  drawCharacterShape(ctx,player.x,player.y,PLAYER_R,player.bodyColor,player.accentColor,player.shape,player.angle,true,player.name);

  // Draw enemies
  enemies.forEach(e=>{
    drawCharacterShape(ctx,e.x,e.y,PLAYER_R,e.bodyColor,e.accentColor,e.shape,e.angle,false,e.name);
  });

  ctx.restore();

  // Draw UI on canvas
  if(player.hp<=0) {
    document.getElementById('dead-msg').style.display='block';
  }

  // Update reload bar
  if(player.reloading) {
    const elapsed=performance.now()-player.reloadEnd+player.weapons[player.activeWeapon].reload*1000;
    const progress=Math.min(1,elapsed/(player.weapons[player.activeWeapon].reload*1000));
    document.getElementById('reload-fill').style.width=(progress*100)+'%';
    if(progress>=1) {
      player.reloading=false;
      document.getElementById('reload-bar').style.display='none';
      const w=player.weapons[player.activeWeapon];
      const toReload=Math.min(w.reserve,w.mag-w.ammo);
      w.reserve-=toReload;
      w.ammo+=toReload;
      updateHUD();
    }
  }

  // Draw minimap
  mctx.fillStyle='#0a0f14';
  mctx.fillRect(0,0,110,110);
  const scale=110/(TILE*MAP_W);
  for(let r=0;r<MAP_H;r++) {
    for(let c=0;c<MAP_W;c++) {
      if(MAP_DATA[r][c]===1) {
        mctx.fillStyle='#1a2332';
        mctx.fillRect(c*scale,r*scale,scale,scale);
      }
    }
  }
  mctx.fillStyle='#5ba3f0';
  mctx.beginPath();
  mctx.arc(player.x*scale,player.y*scale,2,0,Math.PI*2);
  mctx.fill();
  enemies.forEach(e=>{
    mctx.fillStyle=e.isT?'#e05c4a':'#00ff88';
    mctx.beginPath();
    mctx.arc(e.x*scale,e.y*scale,2,0,Math.PI*2);
    mctx.fill();
  });

  // Crosshair already in HTML
}

function updatePlayerMovement(){
  if(!player.alive) return;
  let vx=0,vy=0;
  if(keys['w']) vy-=3;
  if(keys['s']) vy+=3;
  if(keys['a']) vx-=3;
  if(keys['d']) vx+=3;
  moveWithCollision(player,vx,vy);
  player.angle=Math.atan2(mouseY-canvas.height/2,mouseX-canvas.width/2);
}

function loop(){
  if(document.getElementById('main-menu').style.display!=='none') {
    requestAnimationFrame(loop);
    return;
  }

  if(nextRoundTimer>0) {
    nextRoundTimer-=1/60;
    if(nextRoundTimer<=0) {
      document.getElementById('round-end').style.display='none';
      if(round.num<30) {
        round.num++;
        initRound();
      }
    }
  }

  updatePlayerMovement();
  if(mouseDown&&round.phase==='action'&&!isBuyOpen) playerShoot();
  updateBullets();
  updateEnemyAI();
  updateRound();
  updateEffects();
  drawGame();

  requestAnimationFrame(loop);
}

// Mobile controls setup
let touchStartX=0,touchStartY=0,joystickActive=false;
document.getElementById('joystick-zone').addEventListener('touchstart',e=>{
  touchStartX=e.touches[0].clientX;
  touchStartY=e.touches[0].clientY;
  joystickActive=true;
},false);
document.getElementById('joystick-zone').addEventListener('touchmove',e=>{
  if(!joystickActive) return;
  const dx=e.touches[0].clientX-touchStartX;
  const dy=e.touches[0].clientY-touchStartY;
  const dist=Math.hypot(dx,dy);
  const stick=document.getElementById('joystick-stick');
  const maxDist=65;
  const actualDist=Math.min(dist,maxDist);
  const ratio=dist>0?actualDist/dist:0;
  stick.style.transform=`translate(${dx*ratio}px,${dy*ratio}px)`;
  if(dist>20) {
    player.angle=Math.atan2(dy,dx);
  }
},false);
document.getElementById('joystick-zone').addEventListener('touchend',()=>{
  joystickActive=false;
  document.getElementById('joystick-stick').style.transform='translate(0,0)';
},false);

document.getElementById('btn-shoot').addEventListener('touchstart',()=>{
  document.getElementById('btn-shoot').classList.add('firing');
  if(player.alive&&round.phase==='action') playerShoot();
});
document.getElementById('btn-shoot').addEventListener('touchend',()=>{
  document.getElementById('btn-shoot').classList.remove('firing');
});

document.getElementById('btn-reload').addEventListener('touchstart',startReload);
document.getElementById('btn-action').addEventListener('touchstart',()=>{
  if(bomb.planted&&Math.hypot(player.x-bomb.x,player.y-bomb.y)<50&&!bomb.defusing) {
    bomb.defusing=true;
    bomb.defuseProgress=0;
  }
});
document.getElementById('btn-buy').addEventListener('touchstart',()=>{
  if(round.phase==='buy') {
    isBuyOpen=!isBuyOpen;
    if(isBuyOpen) openBuyMenu();
    else closeBuyMenu();
  }
});

// Handle window resize
window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
