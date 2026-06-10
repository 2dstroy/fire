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
