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
  glock:  {name:'GLOCK-17',dmg:22,rof:180,reload:1.5,mag:15,reserve:45,spread:0.08,auto:false,cost:200,type:'Pistol'},
  usp:    {name:'USP-S',   dmg:25,rof:250,reload:2.0,mag:12,reserve:36,spread:0.05,auto:false,cost:300,type:'Pistol'},
  deagle: {name:'DEAGLE', dmg:98,rof:700,reload:2.2,mag:7, reserve:35,spread:0.06,auto:false,cost:700,type:'Pistol'},
  mp5:    {name:'MP5-SD', dmg:28,rof:120,reload:2.0,mag:30,reserve:120,spread:0.06,auto:true, cost:1500,type:'SMG'},
  ak47:   {name:'AK-47',  dmg:86,rof:600,reload:2.5,mag:30,reserve:90, spread:0.10,auto:true, cost:2700,type:'Rifle'},
  m4a1:   {name:'M4A1-S', dmg:74,rof:500,reload:3.1,mag:20,reserve:80, spread:0.05,auto:true, cost:2900,type:'Rifle'},
  awp:    {name:'AWP',    dmg:999,rof:1300,reload:3.7,mag:5,reserve:30,spread:0.01,auto:false,cost:4750,type:'Sniper'},
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
  bomb={planted:false,x:0,y:0,timer:BOMB_TIME,defusing:false,defuseProgress:0,planting:false,plantProgress:0,siteLabel:'A'};
  round.phase='buy'; round.phaseTimer=BUY_TIME; round.timer=ROUND_TIME;
  gameState='buyphase';
  document.getElementById('buy-phase-banner').style.display='block';
  isBuyOpen=false;
  document.getElementById('dead-msg').style.display='none';
  updatePips();
}

document.addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(gameState==='menu') return;
  if(e.key==='b'||e.key==='B') toggleBuyMenu();
  if(e.key==='r'||e.key==='R') startReload();
  if(e.key==='1') switchWeapon(0);
  if(e.key==='2') switchWeapon(1);
  if(e.key==='3') switchWeapon(2);
  if(e.key==='Escape'){isBuyOpen=false;document.getElementById('buy-menu').style.display='none';}
});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});
canvas.addEventListener('mousedown',e=>{if(e.button===0){mouseDown=true;const w=player.weapons[player.activeWeapon];if(w&&!w.auto)tryShoot();}});
canvas.addEventListener('mouseup',e=>{if(e.button===0)mouseDown=false;});
document.addEventListener('contextmenu',e=>e.preventDefault());

function tryShoot(){
  if(!player.alive||isBuyOpen) return;
  const w=player.weapons[player.activeWeapon];
  if(!w||player.reloading) return;
  const now=Date.now();
  if(now-player.lastShot<w.rof) return;
  if(w.ammo<=0){startReload();return;}
  player.lastShot=now; w.ammo--;
  const da=(Math.random()-0.5)*w.spread*2;
  const angle=player.angle+da;
  bullets.push({x:player.x,y:player.y,vx:Math.cos(angle)*BULLET_SPEED,vy:Math.sin(angle)*BULLET_SPEED,owner:'player',dmg:w.dmg,life:60});
  effects.push({type:'muzzle',x:player.x,y:player.y,life:3,maxLife:3,angle:player.angle});
  updateHUD();
}

function startReload(){
  if(!player.alive) return;
  const w=player.weapons[player.activeWeapon];
  if(!w||player.reloading||w.ammo===w.mag||w.reserve===0) return;
  player.reloading=true;
  const rt=w.reload*1000;
  player.reloadEnd=Date.now()+rt;
  document.getElementById('reload-bar').style.display='block';
  const fill=document.getElementById('reload-fill');
  fill.style.transition=`width ${w.reload}s linear`; fill.style.width='0%';
  setTimeout(()=>fill.style.width='100%',10);
  setTimeout(()=>{
    if(!player.alive) return;
    const needed=w.mag-w.ammo, take=Math.min(needed,w.reserve);
    w.ammo+=take; w.reserve-=take;
    player.reloading=false;
    document.getElementById('reload-bar').style.display='none';
    fill.style.width='0%'; fill.style.transition='none';
    updateHUD();
  },rt);
}

function switchWeapon(idx){
  if(idx<player.weapons.length){
    player.activeWeapon=idx; player.reloading=false;
    document.getElementById('reload-bar').style.display='none';
    updateHUD();
  }
}

function toggleBuyMenu(){
  if(gameState!=='buyphase'&&gameState!=='playing') return;
  if(gameState==='playing'&&round.timer<ROUND_TIME-BUY_TIME) return;
  isBuyOpen=!isBuyOpen;
  const menu=document.getElementById('buy-menu');
  if(isBuyOpen){menu.style.display='flex';buildBuyMenu();}
  else menu.style.display='none';
}

function buildBuyMenu(){
  const items=document.getElementById('buy-items');
  items.innerHTML='';
  document.getElementById('buy-money').textContent=`FUNDS: $${player.money}`;
  const shopItems=[
    {key:'m4a1',w:WEAPONS.m4a1},{key:'awp',w:WEAPONS.awp},{key:'deagle',w:WEAPONS.deagle},
    {key:'mp5',w:WEAPONS.mp5},{key:'armor',w:WEAPONS.armor},{key:'helmet',w:WEAPONS.helmet},
    {key:'he',w:WEAPONS.he},{key:'usp',w:WEAPONS.usp}
  ];
  shopItems.forEach(({key,w})=>{
    const div=document.createElement('div');
    div.className='buy-item'+(player.money<w.cost?' cant-afford':'');
    div.innerHTML=`<div class="bi-type">${w.type}</div><div class="bi-name">${w.name}</div><div class="bi-cost">$${w.cost}</div>`;
    if(player.money>=w.cost) div.addEventListener('click',()=>buyItem(key,w));
    items.appendChild(div);
  });
}

function buyItem(key,w){
  if(player.money<w.cost) return;
  player.money-=w.cost;
  if(key==='armor'){player.armor=100;}
  else if(key==='helmet'){player.hasHelmet=true;}
  else if(key==='he'){/* future */}
  else{
    const existing=player.weapons.find(pw=>pw.key===key);
    if(existing){existing.reserve=Math.min(existing.reserve+existing.mag,existing.mag*3);}
    else{player.weapons.push({...w,ammo:w.mag,reserve:w.reserve,key});}
  }
  addKillfeed('YOU',`BOUGHT ${w.name}`,'','ct');
  buildBuyMenu(); updateHUD();
}

function updateHUD(){
  document.getElementById('money').textContent=`$${player.money}`;
  document.getElementById('health-num').textContent=player.alive?player.hp:0;
  document.getElementById('hp-fill').style.width=(player.alive?player.hp:0)+'%';
  document.getElementById('armor-num').textContent=`♦ ${player.armor}`;
  const w=player.weapons[player.activeWeapon];
  if(w){document.getElementById('weapon-info').textContent=w.name;document.getElementById('ammo-info').textContent=`${w.ammo}/${w.reserve}`;}
  document.getElementById('score-ct').textContent=round.ctScore;
  document.getElementById('score-t').textContent=round.tScore;
}

function updateTimer(){
  const t=Math.ceil(round.timer),m=Math.floor(t/60),s=t%60;
  document.getElementById('round-timer').textContent=`${m}:${s.toString().padStart(2,'0')}`;
  document.getElementById('round-info').textContent=`ROUND ${round.num} OF 30`;
}

function updatePips(){
  const ctPips=document.getElementById('ct-pips'),tPips=document.getElementById('t-pips');
  ctPips.innerHTML=''; tPips.innerHTML='';
  const cpip=document.createElement('div'); cpip.className='pip ct'+(player.alive?'':' dead'); ctPips.appendChild(cpip);
  enemies.forEach(e=>{const p=document.createElement('div');p.className='pip t'+(e.alive?'':' dead');tPips.appendChild(p);});
}

function addKillfeed(killer,weapon,victim,side){
  const kf=document.getElementById('killfeed');
  const div=document.createElement('div');
  div.className=`kf-entry kf-${side}`;
  div.innerHTML=`<span class="kf-killer">${killer}</span><span class="kf-weapon">✦${weapon}✦</span><span class="kf-victim">${victim}</span>`;
  kf.insertBefore(div,kf.firstChild);
  killfeed.push(div);
  if(killfeed.length>4){const old=killfeed.shift();old.remove();}
  setTimeout(()=>{div.style.opacity='0';div.style.transition='opacity 1s';setTimeout(()=>{if(div.parentNode)div.remove();killfeed=killfeed.filter(x=>x!==div);},1000);},4000);
}

function updateEnemy(e,dt){
  if(!e.alive) return;
  const dx=player.x-e.x,dy=player.y-e.y,dist=Math.hypot(dx,dy);
  const canSee=dist<400&&hasLOS(e.x,e.y,player.x,player.y);
  if(canSee&&player.alive){e.seenPlayer=true;e.state='attack';e.targetX=player.x;e.targetY=player.y;}
  else if(e.seenPlayer&&e.state==='attack'){e.state='chase';e.patrolTimer=180;}
  if(e.hasBomb&&!bomb.planted&&!canSee){e.state='plant';e.targetX=bombsite.x;e.targetY=bombsite.y;}
  if(e.state==='patrol'){
    e.patrolTimer-=1;
    if(e.patrolTimer<=0){e.patrolTimer=120+Math.random()*180;const r2=200;e.targetX=e.x+(Math.random()-0.5)*r2;e.targetY=e.y+(Math.random()-0.5)*r2;}
    const pdx=e.targetX-e.x,pdy=e.targetY-e.y,pd=Math.hypot(pdx,pdy);
    if(pd>5){e.angle=Math.atan2(pdy,pdx);moveWithCollision(e,(pdx/pd)*ENEMY_SPEED*0.6,(pdy/pd)*ENEMY_SPEED*0.6);}
  } else if(e.state==='attack'){
    if(!player.alive){e.state='patrol';return;}
    e.angle=Math.atan2(dy,dx);
    if(dist>80) moveWithCollision(e,(dx/dist)*ENEMY_SPEED,(dy/dist)*ENEMY_SPEED);
    const now=Date.now();
    if(canSee&&now-e.lastShot>e.weapon.rof*1.5){
      e.lastShot=now;
      const da=(Math.random()-0.5)*e.weapon.spread*3;
      const ang=e.angle+da;
      bullets.push({x:e.x,y:e.y,vx:Math.cos(ang)*BULLET_SPEED,vy:Math.sin(ang)*BULLET_SPEED,owner:'enemy',dmg:e.weapon.dmg,life:60,eid:e.id});
      effects.push({type:'muzzle',x:e.x,y:e.y,life:3,maxLife:3,angle:e.angle});
    }
  } else if(e.state==='chase'){
    const pdx=e.targetX-e.x,pdy=e.targetY-e.y,pd=Math.hypot(pdx,pdy);
    e.angle=Math.atan2(pdy,pdx);
    if(pd>8) moveWithCollision(e,(pdx/pd)*ENEMY_SPEED,(pdy/pd)*ENEMY_SPEED);
    else{e.state='patrol';e.patrolTimer=60;}
  } else if(e.state==='plant'){
    const pdx=bombsite.x-e.x,pdy=bombsite.y-e.y,pd=Math.hypot(pdx,pdy);
    e.angle=Math.atan2(pdy,pdx);
    if(pd>20) moveWithCollision(e,(pdx/pd)*ENEMY_SPEED,(pdy/pd)*ENEMY_SPEED);
    else if(!bomb.planted&&e.hasBomb){
      bomb.planted=true;bomb.x=bombsite.x;bomb.y=bombsite.y;
      bomb.timer=BOMB_TIME;bomb.siteLabel='A';e.hasBomb=false;
      addKillfeed('PHANTOM','PLANTED','BOMB','t');
      document.getElementById('bomb-status').style.display='flex';
    }
    if(canSee&&player.alive) e.state='attack';
  }
}

function endRound(ctWins,reason){
  if(gameState==='roundend') return;
  gameState='roundend';
  if(ctWins){round.ctScore++;player.money=Math.min(16000,player.money+3250);}
  else{round.tScore++;player.money=Math.min(16000,player.money+1400);}
  document.getElementById('bomb-status').style.display='none';
  document.getElementById('defuse-prompt').style.display='none';
  document.getElementById('plant-prompt').style.display='none';
  const re=document.getElementById('round-end');
  re.style.display='flex';
  document.getElementById('re-title').textContent=ctWins?'CT WIN':'T WIN';
  document.getElementById('re-title').style.color=ctWins?'#5ba3f0':'#e05c4a';
  document.getElementById('re-reason').textContent=reason.toUpperCase();
  document.getElementById('re-rewards').textContent=ctWins?'+$3,250 (CT WIN)':'+$1,400 (LOSS BONUS)';
  nextRoundTimer=5;
  updateHUD();
}

function endGame(){
  gameState='gameover';
  document.getElementById('round-end').style.display='flex';
  document.getElementById('re-title').textContent=round.ctScore>round.tScore?'VICTORY':'DEFEAT';
  document.getElementById('re-title').style.color=round.ctScore>round.tScore?'#00ff88':'#e05c4a';
  document.getElementById('re-reason').textContent=`FINAL SCORE: CT ${round.ctScore} — T ${round.tScore}`;
  document.getElementById('re-rewards').textContent='';
  document.getElementById('re-next').textContent='REFRESH TO PLAY AGAIN';
}

function update(dt){
  if(gameState==='buyphase'){
    round.phaseTimer-=dt/60;
    round.timer=ROUND_TIME;
    if(round.phaseTimer<=0){
      gameState='playing';
      document.getElementById('buy-phase-banner').style.display='none';
      document.getElementById('buy-menu').style.display='none';
      isBuyOpen=false;
    }
  }
  if(gameState==='roundend'){
    nextRoundTimer-=dt/60;
    const el=document.getElementById('re-next');
    if(el) el.textContent=`NEXT ROUND IN ${Math.ceil(Math.max(nextRoundTimer,0))}...`;
    if(nextRoundTimer<=0){
      document.getElementById('round-end').style.display='none';
      round.num++;
      if(round.ctScore>=16||round.tScore>=16||round.num>30){endGame();return;}
      initRound();
    }
    return;
  }
 if(gameState!=='playing'&&gameState!=='buyphase') return;

  if(player.alive&&!isBuyOpen){
    const spd=2.2;
    let dx=0,dy=0;
    if(keys['w']||keys['arrowup']) dy-=spd;
    if(keys['s']||keys['arrowdown']) dy+=spd;
    if(keys['a']||keys['arrowleft']) dx-=spd;
    if(keys['d']||keys['arrowright']) dx+=spd;
    if(dx&&dy){dx*=0.707;dy*=0.707;}
    if(dx||dy) moveWithCollision(player,dx,dy);
    const cx=canvas.width/2,cy=canvas.height/2;
    player.angle=Math.atan2(mouseY-cy,mouseX-cx);
    const w=player.weapons[player.activeWeapon];
    if(mouseDown&&w&&w.auto) tryShoot();
    if(w&&w.ammo===0&&!player.reloading) startReload();
   }

  if(gameState==='playing'){
    round.timer-=dt/60;
    updateTimer();
    if(round.timer<=0){endRound(false,'TIME EXPIRED');return;}
  }

  if(bomb.planted){
    bomb.timer-=dt/60;
    document.getElementById('bomb-bar').style.width=(bomb.timer/BOMB_TIME*100)+'%';
    if(bomb.timer<=0){endRound(false,'BOMB EXPLODED');return;}
    const ddx=player.x-bomb.x,ddy=player.y-bomb.y,dd=Math.hypot(ddx,ddy);
    if(dd<40&&player.alive&&!isBuyOpen){
      document.getElementById('defuse-prompt').style.display='block';
      if(keys['f']){
        bomb.defuseProgress+=dt/60/DEFUSE_TIME;
        if(bomb.defuseProgress>=1){endRound(true,'BOMB DEFUSED');return;}
      } else { bomb.defuseProgress=Math.max(0,bomb.defuseProgress-dt/60/2); }
    } else {
      document.getElementById('defuse-prompt').style.display='none';
      bomb.defuseProgress=Math.max(0,bomb.defuseProgress-dt/60/2);
    }
  }
  if(!bomb.planted) document.getElementById('plant-prompt').style.display='none';

  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx;b.y+=b.vy;b.life--;
    if(b.life<=0||isWall(b.x,b.y)){
      if(isWall(b.x,b.y)) effects.push({type:'impact',x:b.x,y:b.y,life:8,maxLife:8});
      bullets.splice(i,1);continue;
    }
    if(b.owner==='enemy'&&player.alive){
      if(Math.hypot(b.x-player.x,b.y-player.y)<PLAYER_R+3){
        let dmg=b.dmg;
        if(player.armor>0){const abs=Math.min(dmg*0.5,player.armor);player.armor-=abs;dmg-=abs;}
        player.hp-=dmg;player.hp=Math.max(0,player.hp);
        effects.push({type:'blood',x:player.x,y:player.y,life:15,maxLife:15});
        bullets.splice(i,1);updateHUD();
        if(player.hp<=0){player.alive=false;document.getElementById('dead-msg').style.display='block';updatePips();}
        continue;
      }
    }
    if(b.owner==='player'){
      for(let j=enemies.length-1;j>=0;j--){
        const e=enemies[j];
        if(!e.alive) continue;
        if(Math.hypot(b.x-e.x,b.y-e.y)<PLAYER_R+3){
          let dmg=b.dmg;
          if(e.armor>0){const a=Math.min(dmg*0.5,e.armor);e.armor-=a;dmg-=a;}
          e.hp-=dmg;e.hp=Math.max(0,e.hp);
          effects.push({type:'blood',x:e.x,y:e.y,life:15,maxLife:15});
          bullets.splice(i,1);
          if(e.hp<=0){
            e.alive=false;
            const w=player.weapons[player.activeWeapon];
            addKillfeed(player.name,w?w.name:'GUN',e.name,'ct');
            player.money=Math.min(16000,player.money+300);
            updateHUD();updatePips();
          }
          break;
        }
      }
    }
  }

  for(let i=effects.length-1;i>=0;i--){effects[i].life--;if(effects[i].life<=0)effects.splice(i,1);}
  enemies.forEach(e=>updateEnemy(e,dt));

  if(gameState==='playing'){
    if(enemies.every(e=>!e.alive)&&!bomb.planted){endRound(true,'ALL TERRORISTS ELIMINATED');return;}
  }
  camera.x=player.x-canvas.width/2;
  camera.y=player.y-canvas.height/2;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(-camera.x,-camera.y);

  for(let r=0;r<MAP_H;r++){
    for(let c=0;c<MAP_W;c++){
      const cell=MAP_DATA[r][c],x=c*TILE,y=r*TILE;
      if(cell===1){
        ctx.fillStyle='#1a2030';ctx.fillRect(x,y,TILE,TILE);
        ctx.strokeStyle='rgba(200,169,110,0.06)';ctx.lineWidth=1;ctx.strokeRect(x,y,TILE,TILE);
      } else if(cell===2){
        ctx.fillStyle='rgba(192,57,43,0.12)';ctx.fillRect(x,y,TILE,TILE);
        ctx.strokeStyle='rgba(192,57,43,0.3)';ctx.lineWidth=1;ctx.strokeRect(x,y,TILE,TILE);
        ctx.fillStyle='rgba(192,57,43,0.25)';ctx.font='bold 18px Barlow Condensed';
        ctx.textAlign='center';ctx.fillText('A',x+TILE/2,y+TILE/2+6);
      } else {
        ctx.fillStyle=(r+c)%2===0?'#141820':'#131720';
        ctx.fillRect(x,y,TILE,TILE);
      }
    }
  }

  effects.forEach(ef=>{
    const a=ef.life/ef.maxLife;
    if(ef.type==='blood'){
      ctx.save();ctx.globalAlpha=a*0.6;ctx.fillStyle='#8B1A1A';
      ctx.beginPath();ctx.arc(ef.x,ef.y,6,0,Math.PI*2);ctx.fill();ctx.restore();
    } else if(ef.type==='impact'){
      ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#FFB300';
      ctx.beginPath();ctx.arc(ef.x,ef.y,3,0,Math.PI*2);ctx.fill();ctx.restore();
    } else if(ef.type==='muzzle'){
      ctx.save();ctx.globalAlpha=a*0.9;ctx.fillStyle='#FFD700';
      const mx=ef.x+Math.cos(ef.angle)*18,my=ef.y+Math.sin(ef.angle)*18;
      ctx.beginPath();ctx.arc(mx,my,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,200,50,0.5)';ctx.beginPath();ctx.arc(mx,my,10,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  });

  if(bomb.planted){
    const pulse=Math.sin(Date.now()/200)*0.4+0.6;
    ctx.save();ctx.globalAlpha=pulse;ctx.fillStyle='#FFB300';
    ctx.beginPath();ctx.arc(bomb.x,bomb.y,7,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#FF6600';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    if(bomb.defuseProgress>0){
      ctx.save();ctx.strokeStyle='#00FF88';ctx.lineWidth=3;ctx.beginPath();
      ctx.arc(bomb.x,bomb.y,14,-Math.PI/2,-Math.PI/2+bomb.defuseProgress*Math.PI*2);
      ctx.stroke();ctx.restore();
    }
  }

  bullets.forEach(b=>{
    ctx.save();ctx.fillStyle=b.owner==='player'?'#FFD700':'#FF4444';
    ctx.beginPath();ctx.arc(b.x,b.y,2,0,Math.PI*2);ctx.fill();ctx.restore();
  });

  enemies.forEach(e=>{
    if(!e.alive) return;
    drawCharacterShape(ctx,e.x,e.y,PLAYER_R,e.bodyColor,e.accentColor,e.shape,e.angle,false,e.name);
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(e.x-16,e.y-28,32,4);
    ctx.fillStyle=e.hp>50?'#4caf50':'#e05c4a';ctx.fillRect(e.x-16,e.y-28,32*(e.hp/100),4);
    ctx.restore();
    if(e.hasBomb){
      ctx.save();ctx.fillStyle='#FFB300';ctx.font='bold 10px Share Tech Mono';
      ctx.textAlign='center';ctx.fillText('C4',e.x,e.y-32);ctx.restore();
    }
  });

  if(player.alive){
    drawCharacterShape(ctx,player.x,player.y,PLAYER_R,player.bodyColor,player.accentColor,player.shape,player.angle,true,player.name);
  }

  ctx.restore();
  drawMinimap();
}

function drawMinimap(){
  const mm=miniCanvas;
  mctx.clearRect(0,0,mm.width,mm.height);
  const tileW=mm.width/MAP_W,tileH=mm.height/MAP_H;
  for(let r=0;r<MAP_H;r++){
    for(let c=0;c<MAP_W;c++){
      const cell=MAP_DATA[r][c];
      mctx.fillStyle=cell===1?'#1a2030':cell===2?'rgba(192,57,43,0.4)':'#141820';
      mctx.fillRect(c*tileW,r*tileH,tileW,tileH);
    }
  }
  if(bomb.planted){
    const bx=bomb.x/TILE*tileW,by=bomb.y/TILE*tileH;
    const p=Math.sin(Date.now()/300)*0.5+0.5;
    mctx.fillStyle=`rgba(255,179,0,${p})`;mctx.fillRect(bx-2,by-2,4,4);
  }
  enemies.forEach(e=>{
    if(!e.alive) return;
    mctx.fillStyle=e.bodyColor;
    mctx.beginPath();mctx.arc(e.x/TILE*tileW,e.y/TILE*tileH,2.5,0,Math.PI*2);mctx.fill();
  });
  if(player.alive){
    const px=player.x/TILE*tileW,py=player.y/TILE*tileH;
    mctx.fillStyle=player.bodyColor;
    mctx.beginPath();mctx.arc(px,py,3,0,Math.PI*2);mctx.fill();
    mctx.strokeStyle=player.bodyColor+'aa';mctx.lineWidth=1;
    mctx.beginPath();mctx.moveTo(px,py);
    mctx.lineTo(px+Math.cos(player.angle)*7,py+Math.sin(player.angle)*7);mctx.stroke();
  }
  mctx.strokeStyle='rgba(200,169,110,0.3)';mctx.lineWidth=1;mctx.strokeRect(0,0,mm.width,mm.height);
}

window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});

// ════════════════════════════════════════════════════
//  MOBILE JOYSTICK + TOUCH CONTROLS
// ════════════════════════════════════════════════════
(function initMobileControls(){
  const isTouchDevice = () => window.matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints > 0;
  if(!isTouchDevice()) return;

  // Show mobile UI
  document.getElementById('mobile-controls').style.display='block';

  // ── Joystick ──────────────────────────────────────
  const zone   = document.getElementById('joystick-zone');
  const base   = document.getElementById('joystick-base');
  const stick  = document.getElementById('joystick-stick');
  const RADIUS = 39; // max stick travel
  let joystickActive = false;
  let joystickId = null;
  let joyVec = {x:0,y:0};

  function getZoneCenter(){
    const r = base.getBoundingClientRect();
    return {x: r.left + r.width/2, y: r.top + r.height/2};
  }

  zone.addEventListener('touchstart', e=>{
    e.preventDefault();
    const t = e.changedTouches[0];
    joystickId = t.identifier;
    joystickActive = true;
    updateStick(t);
  },{passive:false});

  zone.addEventListener('touchmove', e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===joystickId) updateStick(t);
    }
  },{passive:false});

  zone.addEventListener('touchend', e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===joystickId){
        joystickActive=false; joystickId=null; joyVec={x:0,y:0};
        stick.style.transform='translate(0,0)';
        keys['w']=keys['s']=keys['a']=keys['d']=false;
      }
    }
  },{passive:false});

  function updateStick(touch){
    const c = getZoneCenter();
    let dx = touch.clientX - c.x;
    let dy = touch.clientY - c.y;
    const dist = Math.hypot(dx,dy);
    if(dist > RADIUS){ dx = dx/dist*RADIUS; dy = dy/dist*RADIUS; }
    stick.style.transform = `translate(${dx}px,${dy}px)`;
    joyVec.x = dx/RADIUS;
    joyVec.y = dy/RADIUS;
    // Map to keys (with dead zone 0.25)
    const DZ = 0.25;
    keys['w'] = joyVec.y < -DZ;
    keys['s'] = joyVec.y >  DZ;
    keys['a'] = joyVec.x < -DZ;
    keys['d'] = joyVec.x >  DZ;
  }

  // ── Right-side aim / shoot touch ─────────────────
  // The right half of the screen is a draggable aim zone
  const aimRing = document.getElementById('aim-ring');
  let aimTouchId = null;
  let aimActive = false;
  let aimOrigin = {x:0,y:0};
  let aimCurrent = {x:0,y:0};

  // Shoot button
  const btnShoot = document.getElementById('btn-shoot');
  let shootInterval = null;
  btnShoot.addEventListener('touchstart', e=>{
    e.preventDefault(); e.stopPropagation();
    tryShoot();
    const w = player.weapons[player.activeWeapon];
    if(w && w.auto){
      shootInterval = setInterval(tryShoot, w ? w.rof : 100);
    }
    btnShoot.classList.add('firing');
  },{passive:false});
  btnShoot.addEventListener('touchend', e=>{
    e.preventDefault();
    clearInterval(shootInterval); shootInterval=null;
    mouseDown=false;
    btnShoot.classList.remove('firing');
  },{passive:false});

  // Reload button
  document.getElementById('btn-reload').addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation(); startReload();
  },{passive:false});

  // Action button (F key — defuse/plant)
  document.getElementById('btn-action').addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation(); keys['f']=true;
  },{passive:false});
  document.getElementById('btn-action').addEventListener('touchend',e=>{
    e.preventDefault(); keys['f']=false;
  },{passive:false});

  // Buy button
  document.getElementById('btn-buy').addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation(); toggleBuyMenu();
  },{passive:false});

  // Menu/back button
  document.getElementById('btn-menu').addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation();
    isBuyOpen=false; document.getElementById('buy-menu').style.display='none';
  },{passive:false});

  // Weapon switcher
  document.getElementById('weapon-switcher').querySelectorAll('.wpn-btn').forEach(btn=>{
    btn.addEventListener('touchstart',e=>{
      e.preventDefault(); e.stopPropagation();
      const slot = parseInt(btn.dataset.slot);
      switchWeapon(slot);
      updateWeaponSwitcher();
    },{passive:false});
  });
  function updateWeaponSwitcher(){
    const ws = document.getElementById('weapon-switcher');
    ws.style.display = 'flex';
    ws.querySelectorAll('.wpn-btn').forEach(b=>{
      const slot = parseInt(b.dataset.slot);
      b.classList.toggle('active', slot===player.activeWeapon);
      b.style.display = slot < player.weapons.length ? 'block' : 'none';
      if(slot < player.weapons.length){
        b.textContent = slot+1; // number label
      }
    });
  }
  // Patch switchWeapon to also refresh switcher
  const _origSwitch = switchWeapon;
  window.switchWeapon = function(idx){
    _origSwitch(idx);
    if(isTouchDevice()) updateWeaponSwitcher();
  };
  // Patch initRound to refresh switcher
  const _origInitRound = window.initRound;
  window.initRound = function(){
    _origInitRound();
    if(isTouchDevice()) setTimeout(updateWeaponSwitcher, 50);
  };

  // ── Canvas touch → aim ───────────────────────────
  // Right half of screen for aiming (excluding control buttons)
  canvas.addEventListener('touchstart',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      // Only track if it's on right half and not already joystick
      if(t.identifier !== joystickId && t.clientX > window.innerWidth*0.42){
        aimTouchId = t.identifier;
        aimOrigin = {x:t.clientX, y:t.clientY};
        aimCurrent = {x:t.clientX, y:t.clientY};
        aimActive = true;
        aimRing.style.display='block';
        aimRing.style.left = t.clientX+'px';
        aimRing.style.top  = t.clientY+'px';
      }
    }
  },{passive:false});

  canvas.addEventListener('touchmove',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===aimTouchId){
        aimCurrent = {x:t.clientX, y:t.clientY};
        // Move ring to current touch
        aimRing.style.left = t.clientX+'px';
        aimRing.style.top  = t.clientY+'px';
        // Compute angle from screen center
        const cx=canvas.width/2, cy=canvas.height/2;
        // Use delta from origin as aim direction, centered on canvas center
        const dx = t.clientX - cx;
        const dy = t.clientY - cy;
        mouseX = cx + dx;
        mouseY = cy + dy;
        player.angle = Math.atan2(mouseY - cy, mouseX - cx);
      }
    }
  },{passive:false});

  canvas.addEventListener('touchend',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===aimTouchId){
        aimTouchId=null; aimActive=false;
        aimRing.style.display='none';
      }
    }
  },{passive:false});

  // Initial draw of weapon switcher once game starts
  document.getElementById('mm-start').addEventListener('click',()=>{
    setTimeout(updateWeaponSwitcher,200);
  });

  // Also update HUD buttons position when buy menu uses pointer-events
  const _origBuildBuy = buildBuyMenu;
  window.buildBuyMenu = function(){
    _origBuildBuy();
    // Make buy items touchable
    document.querySelectorAll('.buy-item').forEach(item=>{
      item.style.minHeight='44px';
    });
  };

  // Prevent default touch on UI to avoid scroll
  document.getElementById('ui').addEventListener('touchmove',e=>{
    if(e.target.closest('#buy-menu') || e.target.closest('.menu-panel')) return;
    e.preventDefault();
  },{passive:false});

})();


let lastTime=0;
function loop(ts=0){
  requestAnimationFrame(loop);
  const dt=Math.min((ts-lastTime)/16.67,3);
  lastTime=ts;
  if(gameState==='menu') return;
  update(dt);draw();
}

window.initRound=initRound;
window.loop=loop;

// ── CanvasRenderingContext2D.roundRect polyfill for older browsers ──
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    this.beginPath();this.moveTo(x+r,y);this.lineTo(x+w-r,y);
    this.quadraticCurveTo(x+w,y,x+w,y+r);this.lineTo(x+w,y+h-r);
    this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);this.lineTo(x+r,y+h);
    this.quadraticCurveTo(x,y+h,x,y+h-r);this.lineTo(x,y+r);
    this.quadraticCurveTo(x,y,x+r,y);this.closePath();
  };
}

