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
