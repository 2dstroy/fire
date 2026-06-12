<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Operation Zero Hour — PvP</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Share+Tech+Mono&family=Barlow:wght@300;400;500&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}
body{background:#0a0f14;color:#e8dfc8;font-family:'Barlow',sans-serif;overflow:hidden;width:100vw;height:100vh;}
#gameCanvas{display:block;background:#0a0f14;}
#ui{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;}

/* HUD */
#hud{position:absolute;bottom:0;left:0;right:0;padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-end;}
#hud-left{display:flex;flex-direction:column;gap:4px;}
#money{font-family:'Share Tech Mono',monospace;font-size:18px;color:#00ff88;text-shadow:0 0 8px rgba(0,255,136,0.4);letter-spacing:1px;}
#health-row{display:flex;align-items:center;gap:8px;}
#health-num{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:700;color:#fff;line-height:1;}
#hp-bar{width:100px;height:4px;background:rgba(255,255,255,0.1);}
#hp-fill{height:100%;background:#4caf50;transition:width 0.2s;}
#armor-num{font-family:'Share Tech Mono',monospace;font-size:12px;color:#8a9199;}
#weapon-info{font-family:'Barlow Condensed',sans-serif;font-size:20px;letter-spacing:2px;color:#fff;}
#ammo-info{font-family:'Share Tech Mono',monospace;font-size:14px;color:#ffb300;}
#hud-center{display:flex;flex-direction:column;align-items:center;gap:4px;position:absolute;top:10px;left:50%;transform:translateX(-50%);}
#score-bar{display:flex;align-items:center;background:rgba(0,0,0,0.75);border:1px solid rgba(255,255,255,0.1);}
#score-ct{padding:6px 16px;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:#5ba3f0;border-right:1px solid rgba(255,255,255,0.1);}
#score-sep{padding:6px 10px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:2px;}
#score-t{padding:6px 16px;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:#e05c4a;border-left:1px solid rgba(255,255,255,0.1);}
#round-timer{font-family:'Share Tech Mono',monospace;font-size:28px;color:#fff;letter-spacing:4px;text-shadow:0 0 20px rgba(255,255,255,0.2);}
#round-info{font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:3px;}
#team-lives{display:flex;gap:16px;}
.team-pip-row{display:flex;gap:4px;align-items:center;}
.pip{width:10px;height:10px;border-radius:1px;}
.pip.ct{background:#5ba3f0;}.pip.ct.dead{background:rgba(91,163,240,0.15);}
.pip.t{background:#e05c4a;}.pip.t.dead{background:rgba(224,92,74,0.15);}
#hud-right{position:absolute;bottom:12px;right:16px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
#minimap-container{width:110px;height:110px;background:rgba(0,0,0,0.75);border:1px solid rgba(200,169,110,0.3);}
#minimap{width:100%;height:100%;}
#killfeed{position:absolute;top:55px;right:16px;display:flex;flex-direction:column;gap:3px;align-items:flex-end;}
.kf-entry{font-family:'Share Tech Mono',monospace;font-size:10px;background:rgba(0,0,0,0.7);padding:3px 8px;display:flex;gap:6px;border-left:2px solid;}
.kf-ct{border-color:#5ba3f0;}.kf-t{border-color:#e05c4a;}
.kf-killer{color:#5ba3f0;}.kf-victim{color:#e05c4a;}.kf-weapon{color:#8a9199;}
#bomb-status{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;flex-direction:column;align-items:center;background:rgba(0,0,0,0.85);border:2px solid #c0392b;padding:10px 24px;}
#bomb-text{font-family:'Share Tech Mono',monospace;font-size:11px;color:#c0392b;letter-spacing:3px;animation:blink 0.6s ease-in-out infinite;}
#bomb-bar-wrap{width:160px;height:4px;background:rgba(192,57,43,0.2);margin-top:6px;}
#bomb-bar{height:100%;background:#c0392b;transition:width 0.1s linear;}
#defuse-prompt{position:absolute;bottom:240px;left:50%;transform:translateX(-50%);display:none;font-family:'Share Tech Mono',monospace;font-size:11px;color:#00ff88;letter-spacing:2px;background:rgba(0,0,0,0.7);padding:6px 14px;border:1px solid rgba(0,255,136,0.3);animation:pulse 1s ease-in-out infinite;}
#plant-prompt{position:absolute;bottom:240px;left:50%;transform:translateX(-50%);display:none;font-family:'Share Tech Mono',monospace;font-size:11px;color:#ffb300;letter-spacing:2px;background:rgba(0,0,0,0.7);padding:6px 14px;border:1px solid rgba(255,179,0,0.3);animation:pulse 1s ease-in-out infinite;}
#round-end{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;flex-direction:column;align-items:center;gap:8px;background:rgba(0,0,0,0.9);border:1px solid rgba(200,169,110,0.3);padding:30px 50px;}
#re-title{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:900;letter-spacing:4px;text-transform:uppercase;}
#re-reason{font-family:'Share Tech Mono',monospace;font-size:11px;color:#8a9199;letter-spacing:3px;}
#re-rewards{font-family:'Share Tech Mono',monospace;font-size:13px;color:#00ff88;margin-top:4px;}
#re-next{font-family:'Share Tech Mono',monospace;font-size:10px;color:#8a9199;margin-top:8px;letter-spacing:2px;}
#buy-menu{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;flex-direction:column;gap:12px;background:rgba(5,10,16,0.97);border:1px solid rgba(200,169,110,0.25);padding:24px 28px;min-width:360px;pointer-events:all;}
#buy-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#c8a96e;}
#buy-money{font-family:'Share Tech Mono',monospace;font-size:12px;color:#00ff88;letter-spacing:2px;margin-bottom:4px;}
#buy-items{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.buy-item{background:rgba(255,255,255,0.03);border:1px solid rgba(200,169,110,0.15);padding:10px 12px;cursor:pointer;transition:all 0.1s;}
.buy-item:hover{background:rgba(200,169,110,0.08);border-color:rgba(200,169,110,0.4);}
.buy-item.cant-afford{opacity:0.35;cursor:not-allowed;}
.bi-name{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:600;letter-spacing:2px;}
.bi-cost{font-family:'Share Tech Mono',monospace;font-size:10px;color:#00ff88;}
.bi-type{font-family:'Share Tech Mono',monospace;font-size:8px;color:#8a9199;letter-spacing:2px;margin-bottom:4px;}
#buy-close{font-family:'Share Tech Mono',monospace;font-size:10px;color:#8a9199;letter-spacing:2px;margin-top:8px;text-align:center;}
#reload-bar{position:absolute;bottom:230px;left:50%;transform:translateX(-50%);display:none;width:120px;}
#reload-label{font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:2px;text-align:center;margin-bottom:3px;}
#reload-track{height:3px;background:rgba(255,255,255,0.1);}
#reload-fill{height:100%;background:#c8a96e;width:0%;transition:width linear;}
#crosshair{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;pointer-events:none;}
#crosshair::before,#crosshair::after{content:'';position:absolute;background:rgba(255,255,255,0.9);}
#crosshair::before{width:2px;height:7px;left:9px;top:0;}
#crosshair::after{width:2px;height:7px;left:9px;bottom:0;}
.ch-side{position:absolute;width:7px;height:2px;top:9px;background:rgba(255,255,255,0.9);}
#ch-l{left:0;}#ch-r{right:0;}
#buy-phase-banner{position:absolute;top:55px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:10px;color:#c8a96e;letter-spacing:3px;background:rgba(0,0,0,0.7);padding:4px 14px;border:1px solid rgba(200,169,110,0.2);display:none;}
#dead-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:700;letter-spacing:4px;color:rgba(224,92,74,0.9);text-transform:uppercase;text-align:center;}

/* Online players panel */
#online-panel{position:absolute;top:55px;left:16px;display:none;flex-direction:column;gap:4px;background:rgba(0,0,0,0.7);border:1px solid rgba(200,169,110,0.2);padding:8px 12px;min-width:130px;}
#online-title{font-family:'Share Tech Mono',monospace;font-size:8px;color:#c8a96e;letter-spacing:3px;margin-bottom:4px;}
.online-player{font-family:'Share Tech Mono',monospace;font-size:9px;display:flex;align-items:center;gap:6px;}
.online-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}

/* ═══════════════ MAIN MENU ═══════════════ */
#main-menu{position:absolute;inset:0;background:#08111a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;pointer-events:all;overflow:hidden;}
.menu-bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;}
#mm-logo{font-family:'Barlow Condensed',sans-serif;font-size:72px;font-weight:900;letter-spacing:-2px;text-transform:uppercase;line-height:0.9;text-align:center;position:relative;z-index:1;}
#mm-logo span{display:block;font-size:52px;letter-spacing:8px;color:#c8a96e;}
#mm-sub{font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:4px;color:#8a9199;text-transform:uppercase;margin-top:12px;margin-bottom:24px;position:relative;z-index:1;}
#menu-tabs{display:flex;gap:0;margin-bottom:20px;position:relative;z-index:1;}
.menu-tab{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:3px;padding:8px 20px;border:1px solid rgba(200,169,110,0.2);color:#8a9199;cursor:pointer;transition:all 0.2s;background:transparent;}
.menu-tab.active{background:rgba(200,169,110,0.1);border-color:rgba(200,169,110,0.5);color:#c8a96e;}
.menu-tab:hover:not(.active){border-color:rgba(200,169,110,0.3);color:#c8a96e;}
.menu-panel{display:none;flex-direction:column;gap:12px;position:relative;z-index:1;width:400px;}
.menu-panel.active{display:flex;}

/* Character panel */
#char-panel{border:1px solid rgba(200,169,110,0.15);padding:16px;display:flex;flex-direction:column;gap:12px;}
.char-preview{display:flex;justify-content:center;margin-bottom:4px;}
#char-canvas-preview{background:rgba(0,0,0,0.3);border:1px solid rgba(200,169,110,0.15);}
.char-row{display:flex;flex-direction:column;gap:6px;}
.char-row-label{font-family:'Share Tech Mono',monospace;font-size:8px;color:#c8a96e;letter-spacing:2px;}
.color-swatches{display:flex;gap:6px;flex-wrap:wrap;}
.swatch{width:24px;height:24px;border-radius:3px;cursor:pointer;border:2px solid transparent;transition:all 0.15s;flex-shrink:0;}
.swatch.selected{border-color:#c8a96e;transform:scale(1.15);}
.char-name-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(200,169,110,0.2);color:#e8dfc8;font-family:'Share Tech Mono',monospace;font-size:12px;padding:6px 10px;outline:none;letter-spacing:2px;text-transform:uppercase;}
.char-name-input:focus{border-color:rgba(200,169,110,0.5);}
.shape-opts{display:flex;gap:8px;}
.shape-opt{width:36px;height:36px;background:rgba(255,255,255,0.04);border:1px solid rgba(200,169,110,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;}
.shape-opt.selected{border-color:#c8a96e;background:rgba(200,169,110,0.08);}
.shape-opt svg{width:20px;height:20px;}

/* Multiplayer panel */
.mp-section{border:1px solid rgba(200,169,110,0.15);padding:16px;}
.mp-label{font-family:'Share Tech Mono',monospace;font-size:8px;color:#c8a96e;letter-spacing:3px;margin-bottom:8px;}
.mp-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(200,169,110,0.2);color:#e8dfc8;font-family:'Share Tech Mono',monospace;font-size:12px;padding:8px 12px;outline:none;letter-spacing:1px;}
.mp-input:focus{border-color:rgba(200,169,110,0.5);}
.mp-input::placeholder{color:#3a4050;}
.mp-btn{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:4px;text-transform:uppercase;background:rgba(91,163,240,0.1);border:1px solid rgba(91,163,240,0.3);color:#5ba3f0;padding:10px;cursor:pointer;transition:all 0.2s;width:100%;margin-top:8px;}
.mp-btn:hover{background:rgba(91,163,240,0.2);}
.mp-btn.green{background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.3);color:#00ff88;}
.mp-btn.green:hover{background:rgba(0,255,136,0.15);}
.mp-btn.red{background:rgba(224,92,74,0.08);border-color:rgba(224,92,74,0.3);color:#e05c4a;}
#mp-status{font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:2px;text-align:center;min-height:16px;}
#lobby-box{background:rgba(0,0,0,0.3);border:1px solid rgba(200,169,110,0.1);padding:12px;max-height:160px;overflow-y:auto;}
.lobby-player-row{font-family:'Share Tech Mono',monospace;font-size:10px;display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
.lobby-player-row:last-child{border-bottom:none;}
.lobby-color-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.lobby-name{color:#e8dfc8;}
.lobby-team{font-size:8px;padding:1px 5px;letter-spacing:1px;}
.lobby-team.ct{color:#5ba3f0;border:1px solid rgba(91,163,240,0.3);}
.lobby-team.t{color:#e05c4a;border:1px solid rgba(224,92,74,0.3);}
.lobby-you{color:#c8a96e;font-size:8px;}
#lobby-start-btn{display:none;}
#team-select{display:flex;gap:8px;margin-top:8px;}
.team-btn{flex:1;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;padding:8px;cursor:pointer;border:1px solid;transition:all 0.2s;background:transparent;}
.team-btn.ct{color:#5ba3f0;border-color:rgba(91,163,240,0.3);}
.team-btn.ct:hover,.team-btn.ct.selected{background:rgba(91,163,240,0.15);border-color:#5ba3f0;}
.team-btn.t{color:#e05c4a;border-color:rgba(224,92,74,0.3);}
.team-btn.t:hover,.team-btn.t.selected{background:rgba(224,92,74,0.15);border-color:#e05c4a;}

/* Waiting / matchmaking overlay */
#waiting-overlay{position:absolute;inset:0;background:rgba(8,17,26,0.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;pointer-events:all;z-index:20;}
#waiting-title{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;letter-spacing:6px;color:#c8a96e;}
#waiting-sub{font-family:'Share Tech Mono',monospace;font-size:10px;color:#8a9199;letter-spacing:3px;}
#waiting-players{display:flex;gap:24px;}
.wait-slot{display:flex;flex-direction:column;align-items:center;gap:8px;}
.wait-avatar{width:50px;height:50px;border-radius:50%;border:2px solid;}
.wait-name{font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:1px;}
.wait-team{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:2px;}
#waiting-cancel{font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:2px;cursor:pointer;border:1px solid rgba(138,145,153,0.2);padding:6px 16px;margin-top:8px;}
#waiting-cancel:hover{color:#e05c4a;border-color:rgba(224,92,74,0.3);}

/* Ping indicator */
#ping-badge{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:9px;color:#8a9199;letter-spacing:2px;}

/* Team label */
#team-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:3px;padding:3px 10px;display:none;}

@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* Mobile controls */
#mobile-controls{position:fixed;bottom:0;left:0;right:0;display:none;pointer-events:none;z-index:50;height:220px;}
@media (pointer:coarse),(max-width:768px){#mobile-controls{display:block;}#crosshair{display:none;}}
#joystick-zone{position:absolute;bottom:20px;left:20px;width:130px;height:130px;pointer-events:all;}
#joystick-base{width:130px;height:130px;border-radius:50%;background:rgba(200,169,110,0.08);border:2px solid rgba(200,169,110,0.25);position:absolute;top:0;left:0;}
#joystick-stick{width:52px;height:52px;border-radius:50%;background:rgba(200,169,110,0.3);border:2px solid rgba(200,169,110,0.6);position:absolute;top:39px;left:39px;transform:translate(0,0);transition:transform 0.05s;}
#action-btns{position:absolute;bottom:20px;right:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:all;}
#btn-row-top{display:flex;gap:10px;align-items:center;}
#btn-row-bot{display:flex;gap:10px;align-items:center;}
.act-btn{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;font-weight:700;letter-spacing:1px;border:2px solid;cursor:pointer;user-select:none;-webkit-user-select:none;flex-shrink:0;transition:transform 0.08s,opacity 0.08s;pointer-events:all;touch-action:manipulation;}
.act-btn:active{transform:scale(0.88);opacity:0.75;}
#btn-shoot{width:72px;height:72px;font-size:11px;background:rgba(224,92,74,0.25);border-color:rgba(224,92,74,0.7);color:#e05c4a;}
#btn-shoot.firing{background:rgba(224,92,74,0.5);}
#btn-reload{width:50px;height:50px;font-size:9px;background:rgba(255,179,0,0.15);border-color:rgba(255,179,0,0.5);color:#ffb300;}
#btn-aim{width:50px;height:50px;font-size:9px;background:rgba(91,163,240,0.15);border-color:rgba(91,163,240,0.5);color:#5ba3f0;}
#btn-action{width:50px;height:50px;font-size:9px;background:rgba(0,255,136,0.12);border-color:rgba(0,255,136,0.4);color:#00ff88;}
#btn-buy{width:44px;height:44px;font-size:8px;background:rgba(200,169,110,0.12);border-color:rgba(200,169,110,0.4);color:#c8a96e;}
#btn-menu{width:38px;height:38px;font-size:7px;background:rgba(138,145,153,0.12);border-color:rgba(138,145,153,0.3);color:#8a9199;}
#weapon-switcher{position:absolute;bottom:165px;right:16px;display:flex;gap:6px;pointer-events:all;}
.wpn-btn{font-family:'Share Tech Mono',monospace;font-size:8px;background:rgba(0,0,0,0.65);border:1px solid rgba(200,169,110,0.25);color:#8a9199;padding:5px 9px;border-radius:3px;cursor:pointer;letter-spacing:1px;touch-action:manipulation;transition:all 0.1s;pointer-events:all;}
.wpn-btn.active{border-color:#c8a96e;color:#c8a96e;background:rgba(200,169,110,0.12);}
#aim-ring{position:fixed;width:60px;height:60px;border-radius:50%;border:2px solid rgba(255,255,255,0.35);pointer-events:none;display:none;transform:translate(-50%,-50%);z-index:55;}
#aim-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.8);}
</style>
</head>
<body>
<canvas id="gameCanvas"></canvas>
<div id="ui">

  <!-- ═══════════════ MAIN MENU ═══════════════ -->
  <div id="main-menu">
    <div class="menu-bg-grid"></div>
    <div id="mm-logo">Operation<span>Zero Hour</span></div>
    <div id="mm-sub">// player vs player · round-based · tactical</div>

    <div id="menu-tabs">
      <div class="menu-tab active" data-tab="multiplayer">MULTIPLAYER</div>
      <div class="menu-tab" data-tab="character">CHARACTER</div>
    </div>

    <!-- MULTIPLAYER TAB -->
    <div class="menu-panel active" id="tab-multiplayer">
      <div class="mp-section">
        <div class="mp-label">YOUR CALLSIGN / EMAIL</div>
        <input class="mp-input" id="mp-email" type="email" placeholder="you@example.com">
        <div class="mp-label" style="margin-top:10px;">ROOM CODE (leave blank to create)</div>
        <input class="mp-input" id="mp-room" type="text" placeholder="e.g. ALPHA-7" style="text-transform:uppercase;">
        <div id="team-select">
          <button class="team-btn ct selected" id="btn-team-ct">◈ CT SIDE</button>
          <button class="team-btn t" id="btn-team-t">◉ T SIDE</button>
        </div>
        <button class="mp-btn" id="mp-join-btn">JOIN / CREATE ROOM</button>
        <div id="mp-status">CHOOSE TEAM &amp; ENTER EMAIL</div>
      </div>

      <div class="mp-section" id="lobby-section" style="display:none;">
        <div class="mp-label">LOBBY — <span id="lobby-room-code"></span></div>
        <div id="lobby-box"></div>
        <button class="mp-btn green" id="lobby-start-btn" style="display:none;">▶ START MATCH</button>
        <button class="mp-btn red" id="lobby-leave-btn" style="margin-top:4px;">LEAVE ROOM</button>
      </div>
    </div>

    <!-- CHARACTER TAB -->
    <div class="menu-panel" id="tab-character">
      <div id="char-panel">
        <div class="char-preview"><canvas id="char-canvas-preview" width="100" height="100"></canvas></div>
        <div class="char-row">
          <div class="char-row-label">CALLSIGN</div>
          <input class="char-name-input" id="char-name" maxlength="12" placeholder="GHOST_7" value="GHOST_7">
        </div>
        <div class="char-row">
          <div class="char-row-label">BODY COLOR</div>
          <div class="color-swatches" id="body-swatches"></div>
        </div>
        <div class="char-row">
          <div class="char-row-label">ACCENT COLOR</div>
          <div class="color-swatches" id="accent-swatches"></div>
        </div>
        <div class="char-row">
          <div class="char-row-label">SHAPE</div>
          <div class="shape-opts" id="shape-opts"></div>
        </div>
      </div>
    </div>
  </div><!-- /main-menu -->

  <!-- Waiting overlay -->
  <div id="waiting-overlay">
    <div id="waiting-title">SEARCHING FOR MATCH</div>
    <div id="waiting-sub">WAITING FOR PLAYERS...</div>
    <div id="waiting-players"></div>
    <div id="waiting-cancel">CANCEL</div>
  </div>

  <!-- HUD -->
  <div id="hud" style="display:none;">
    <div id="hud-left">
      <div id="money">$800</div>
      <div id="health-row">
        <div id="health-num">100</div>
        <div style="display:flex;flex-direction:column;gap:3px;">
          <div id="hp-bar"><div id="hp-fill" style="width:100%"></div></div>
          <div id="armor-num">♦ 0</div>
        </div>
      </div>
      <div id="weapon-info">USP-S</div>
      <div id="ammo-info">12/36</div>
    </div>
  </div>

  <div id="hud-center">
    <div id="team-badge"></div>
    <div id="team-lives">
      <div class="team-pip-row" id="ct-pips"></div>
      <div class="team-pip-row" id="t-pips"></div>
    </div>
    <div id="score-bar">
      <div id="score-ct">0</div>
      <div id="score-sep">CT · T</div>
      <div id="score-t">0</div>
    </div>
    <div id="round-timer">1:55</div>
    <div id="round-info">ROUND 1 OF 30</div>
    <div id="buy-phase-banner">BUY PHASE — PRESS B</div>
  </div>

  <div id="killfeed"></div>
  <div id="online-panel">
    <div id="online-title">ONLINE</div>
    <div id="online-list"></div>
  </div>

  <div id="hud-right">
    <canvas id="minimap" width="110" height="110"></canvas>
  </div>

  <div id="bomb-status">
    <div id="bomb-text">● BOMB PLANTED — SITE A</div>
    <div id="bomb-bar-wrap"><div id="bomb-bar" style="width:100%"></div></div>
  </div>
  <div id="defuse-prompt">[F] DEFUSE BOMB</div>
  <div id="plant-prompt">[F] PLANT BOMB</div>
  <div id="dead-msg">YOU DIED<br><span style="font-size:16px;color:#8a9199">SPECTATING...</span></div>
  <div id="ping-badge">● 0MS</div>

  <div id="crosshair">
    <div class="ch-side" id="ch-l"></div>
    <div class="ch-side" id="ch-r"></div>
  </div>
  <div id="reload-bar">
    <div id="reload-label">RELOADING</div>
    <div id="reload-track"><div id="reload-fill"></div></div>
  </div>
  <div id="round-end">
    <div id="re-title">CT WIN</div>
    <div id="re-reason">ALL TERRORISTS ELIMINATED</div>
    <div id="re-rewards">+$3,250</div>
    <div id="re-next">NEXT ROUND IN 4...</div>
  </div>
  <div id="buy-menu">
    <div id="buy-title">BUY MENU</div>
    <div id="buy-money">FUNDS: $800</div>
    <div id="buy-items"></div>
    <div id="buy-close">ESC / B — CLOSE</div>
  </div>

  <!-- Mobile controls -->
  <div id="mobile-controls">
    <div id="joystick-zone">
      <div id="joystick-base"></div>
      <div id="joystick-stick"></div>
    </div>
    <div id="weapon-switcher" style="display:none;">
      <div class="wpn-btn active" data-slot="0">1</div>
      <div class="wpn-btn" data-slot="1">2</div>
      <div class="wpn-btn" data-slot="2">3</div>
    </div>
    <div id="action-btns">
      <div id="btn-row-top">
        <div class="act-btn" id="btn-buy">BUY</div>
        <div class="act-btn" id="btn-menu">≡</div>
      </div>
      <div id="btn-row-bot">
        <div class="act-btn" id="btn-action">ACT<br><span style="font-size:7px">F</span></div>
        <div class="act-btn" id="btn-reload">RLD<br><span style="font-size:7px">R</span></div>
        <div class="act-btn" id="btn-aim">AIM</div>
        <div class="act-btn" id="btn-shoot">FIRE</div>
      </div>
    </div>
  </div>
  <div id="aim-ring"><div id="aim-dot"></div></div>

</div><!-- /ui -->

<!-- Firebase SDK -->
<script type="module">
// ══════════════════════════════════════════
//  FIREBASE CONFIG — replace with your own
//  Firebase Console → Project Settings → Web App
// ══════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyBHMAZ9fJbqYx-14MAY5WwSFPfV5q6jXzs",
  authDomain: "fire-7eb23.firebaseapp.com",
  projectId: "fire-7eb23",
  storageBucket: "fire-7eb23.firebasestorage.app",
  messagingSenderId: "Y629103600698",
  appId: "1:629103600698:web:1e361a37cafbee53860103"
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc,
  deleteField, serverTimestamp, collection, increment, runTransaction
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

let db, firestoreOk = false;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firestoreOk = true;
  console.log('Firebase ready ✓');
} catch(e) {
  console.warn('Firebase not configured:', e.message);
}

// ═══════════════════════════════════════════════════════
//  CHARACTER CUSTOMIZATION
// ═══════════════════════════════════════════════════════
const BODY_COLORS   = ['#5BA3F0','#00C896','#E05C4A','#C8A96E','#A855F7','#F97316','#EC4899','#FFFFFF'];
const ACCENT_COLORS = ['#2E86C1','#00956e','#C0392B','#8B6914','#7C3AED','#C2410C','#BE185D','#888888'];
const SHAPES        = ['circle','square','diamond'];

let charCfg = {
  name:   localStorage.getItem('ozh_name')   || 'GHOST_7',
  body:   localStorage.getItem('ozh_body')   || '#5BA3F0',
  accent: localStorage.getItem('ozh_accent') || '#2E86C1',
  shape:  localStorage.getItem('ozh_shape')  || 'circle',
};
function saveChar() {
  localStorage.setItem('ozh_name',   charCfg.name);
  localStorage.setItem('ozh_body',   charCfg.body);
  localStorage.setItem('ozh_accent', charCfg.accent);
  localStorage.setItem('ozh_shape',  charCfg.shape);
}
function buildSwatches(containerId, colors, key) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  colors.forEach(c => {
    const s = document.createElement('div');
    s.className = 'swatch' + (charCfg[key]===c?' selected':'');
    s.style.background = c;
    s.addEventListener('click', () => {
      charCfg[key] = c;
      el.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));
      s.classList.add('selected');
      if(key==='body'){ const bi=BODY_COLORS.indexOf(c); if(bi>=0){charCfg.accent=ACCENT_COLORS[bi];buildSwatches('accent-swatches',ACCENT_COLORS,'accent');} }
      saveChar(); drawPreview();
    });
    el.appendChild(s);
  });
}
function buildShapes() {
  const el = document.getElementById('shape-opts');
  el.innerHTML = '';
  const svgs = {
    circle:  `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg>`,
    square:  `<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor"/></svg>`,
    diamond: `<svg viewBox="0 0 20 20"><polygon points="10,1 19,10 10,19 1,10" fill="currentColor"/></svg>`,
  };
  SHAPES.forEach(sh => {
    const d = document.createElement('div');
    d.className = 'shape-opt'+(charCfg.shape===sh?' selected':'');
    d.style.color = charCfg.body;
    d.innerHTML = svgs[sh];
    d.title = sh;
    d.addEventListener('click', ()=>{ charCfg.shape=sh; el.querySelectorAll('.shape-opt').forEach(x=>x.classList.remove('selected')); d.classList.add('selected'); saveChar(); drawPreview(); });
    el.appendChild(d);
  });
}
function drawPreview() {
  const cv = document.getElementById('char-canvas-preview');
  const cx = cv.getContext('2d');
  cx.clearRect(0,0,100,100);
  cx.fillStyle='#141820'; cx.fillRect(0,0,100,100);
  drawCharacterShape(cx,50,50,18,charCfg.body,charCfg.accent,charCfg.shape,0);
  cx.fillStyle=charCfg.body; cx.font='bold 8px Share Tech Mono'; cx.textAlign='center';
  cx.fillText(charCfg.name||'—',50,85);
}
document.getElementById('char-name').value = charCfg.name;
document.getElementById('char-name').addEventListener('input', e=>{
  charCfg.name = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g,'').slice(0,12);
  e.target.value = charCfg.name; saveChar(); drawPreview();
});
buildSwatches('body-swatches',BODY_COLORS,'body');
buildSwatches('accent-swatches',ACCENT_COLORS,'accent');
buildShapes();
drawPreview();

// ═══════════════════════════════════════════════════════
//  MULTIPLAYER STATE
// ═══════════════════════════════════════════════════════
let myEmail='', myRoomId='', myTeam='ct', lobbyUnsub=null, gameUnsub=null;
let pingStart=0, pingMs=0;

// Team select buttons
document.getElementById('btn-team-ct').addEventListener('click',()=>{
  myTeam='ct';
  document.getElementById('btn-team-ct').classList.add('selected');
  document.getElementById('btn-team-t').classList.remove('selected');
});
document.getElementById('btn-team-t').addEventListener('click',()=>{
  myTeam='t';
  document.getElementById('btn-team-t').classList.add('selected');
  document.getElementById('btn-team-ct').classList.remove('selected');
});

function mpStatus(msg,color='#8a9199'){ const el=document.getElementById('mp-status'); el.textContent=msg; el.style.color=color; }
function randRoomId(){ const w=['ALPHA','BRAVO','DELTA','ECHO','FOXTROT','GHOST','NOVA','SIGMA','TANGO','ZERO']; return w[Math.floor(Math.random()*w.length)]+'-'+Math.floor(Math.random()*90+10); }

function renderLobby(data) {
  const box=document.getElementById('lobby-box');
  box.innerHTML='';
  const players=data.players||{};
  Object.entries(players).forEach(([email,info])=>{
    const row=document.createElement('div'); row.className='lobby-player-row';
    const dot=document.createElement('div'); dot.className='lobby-color-dot'; dot.style.background=info.body||'#5BA3F0';
    const name=document.createElement('span'); name.className='lobby-name'; name.textContent=info.name||email.split('@')[0];
    const team=document.createElement('span'); team.className='lobby-team '+(info.team||'ct'); team.textContent=(info.team||'ct').toUpperCase();
    row.appendChild(dot); row.appendChild(name); row.appendChild(team);
    if(email===myEmail){ const you=document.createElement('span'); you.className='lobby-you'; you.textContent='(YOU)'; row.appendChild(you); }
    box.appendChild(row);
  });
  const isHost=data.host===myEmail;
  const count=Object.keys(players).length;
  document.getElementById('lobby-start-btn').style.display=(isHost&&count>=2)?'block':'none';
}

async function joinOrCreate() {
  if(!firestoreOk){ mpStatus('⚠ Firebase not configured!','#e05c4a'); return; }
  const email=document.getElementById('mp-email').value.trim().toLowerCase();
  if(!email||!email.includes('@')){ mpStatus('ENTER A VALID EMAIL','#e05c4a'); return; }
  myEmail=email;
  let room=document.getElementById('mp-room').value.trim().toUpperCase().replace(/\s+/g,'-')||randRoomId();
  myRoomId=room;
  document.getElementById('lobby-room-code').textContent=room;
  mpStatus('CONNECTING…','#c8a96e');
  try {
    const roomRef=doc(db,'ozh_pvp_rooms',room);
    const snap=await getDoc(roomRef);
    const emailKey=email.replace(/\./g,'_').replace(/@/g,'__at__');
    const playerData={
      name:charCfg.name||email.split('@')[0].toUpperCase(),
      body:charCfg.body, accent:charCfg.accent, shape:charCfg.shape,
      team:myTeam, joinedAt:serverTimestamp(), alive:true, hp:100, armor:0,
      x:0, y:0, angle:0, money:800, kills:0, deaths:0
    };
    if(!snap.exists()){
      await setDoc(roomRef,{ host:email, created:serverTimestamp(), status:'lobby', players:{[emailKey]:playerData}, ctScore:0, tScore:0, roundNum:1, bomb:{planted:false,x:0,y:0,timer:40}, roundPhase:'buy', roundTimer:115 });
    } else {
      const ex=snap.data();
      if(ex.status==='playing'){ mpStatus('MATCH IN PROGRESS — TRY ANOTHER ROOM','#e05c4a'); return; }
      await updateDoc(roomRef,{[`players.${emailKey}`]:playerData});
    }
    document.getElementById('lobby-section').style.display='block';
    document.getElementById('mp-join-btn').style.display='none';
    mpStatus('CONNECTED ✓','#00ff88');
    if(lobbyUnsub) lobbyUnsub();
    lobbyUnsub=onSnapshot(roomRef,s=>{
      if(!s.exists()) return;
      const data=s.data();
      renderLobby(data);
      if(data.status==='playing'){ startGame(data); }
    });
  } catch(err){ mpStatus('ERROR: '+err.message,'#e05c4a'); }
}

async function leaveRoom() {
  if(!myRoomId||!myEmail) return;
  if(lobbyUnsub){lobbyUnsub();lobbyUnsub=null;}
  if(gameUnsub){gameUnsub();gameUnsub=null;}
  try {
    const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
    const emailKey=myEmail.replace(/\./g,'_').replace(/@/g,'__at__');
    await updateDoc(roomRef,{[`players.${emailKey}`]:deleteField()});
  } catch(e){}
  myRoomId=''; myEmail='';
  document.getElementById('lobby-section').style.display='none';
  document.getElementById('mp-join-btn').style.display='block';
  document.getElementById('mp-room').value='';
  mpStatus('CHOOSE TEAM & ENTER EMAIL');
}

async function startMatchAsHost() {
  if(!myRoomId) return;
  const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
  await updateDoc(roomRef,{status:'playing',startedAt:serverTimestamp()});
}

document.getElementById('mp-join-btn').addEventListener('click', joinOrCreate);
document.getElementById('lobby-start-btn').addEventListener('click', startMatchAsHost);
document.getElementById('lobby-leave-btn').addEventListener('click', leaveRoom);
document.getElementById('waiting-cancel').addEventListener('click', ()=>{
  document.getElementById('waiting-overlay').style.display='none';
  leaveRoom();
});

// Tab switching
document.querySelectorAll('.menu-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.menu-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
    if(tab.dataset.tab==='character') drawPreview();
  });
});

// ═══════════════════════════════════════════════════════
//  GAME ENGINE
// ═══════════════════════════════════════════════════════
const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const miniCanvas = document.getElementById('minimap');
const mctx    = miniCanvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const TILE=40,MAP_W=30,MAP_H=22,PLAYER_R=10;
const BULLET_SPEED=14;
const ROUND_TIME=115,BUY_TIME=20,BOMB_TIME=40,DEFUSE_TIME=5,PLANT_TIME=3;

const WEAPONS={
  glock: {name:'GLOCK-17',dmg:22,rof:180,reload:1.5,mag:15,reserve:45,spread:0.08,auto:false,cost:200,type:'Pistol'},
  usp:   {name:'USP-S',   dmg:25,rof:250,reload:2.0,mag:12,reserve:36,spread:0.05,auto:false,cost:300,type:'Pistol'},
  deagle:{name:'DEAGLE',  dmg:98,rof:700,reload:2.2,mag:7, reserve:35,spread:0.06,auto:false,cost:700,type:'Pistol'},
  mp5:   {name:'MP5-SD',  dmg:28,rof:120,reload:2.0,mag:30,reserve:120,spread:0.06,auto:true, cost:1500,type:'SMG'},
  ak47:  {name:'AK-47',   dmg:86,rof:600,reload:2.5,mag:30,reserve:90, spread:0.10,auto:true, cost:2700,type:'Rifle'},
  m4a1:  {name:'M4A1-S',  dmg:74,rof:500,reload:3.1,mag:20,reserve:80, spread:0.05,auto:true, cost:2900,type:'Rifle'},
  awp:   {name:'AWP',     dmg:999,rof:1300,reload:3.7,mag:5,reserve:30,spread:0.01,auto:false,cost:4750,type:'Sniper'},
  helmet:{name:'HELMET',cost:350,type:'Equipment'},
  armor: {name:'ARMOR',  cost:650,type:'Equipment'},
  he:    {name:'HE GREN',cost:300,type:'Grenade'},
};

const RAW_MAP=[
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
const MAP_DATA=RAW_MAP.map(r=>r.split('').map(Number));

let ctSpawns=[],tSpawns=[],bombsites=[];
MAP_DATA.forEach((row,r)=>row.forEach((cell,c)=>{
  if(cell===3) ctSpawns.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
  if(cell===4) tSpawns.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
  if(cell===2) bombsites.push({x:c*TILE+TILE/2,y:r*TILE+TILE/2});
}));
let bombsite=bombsites[Math.floor(bombsites.length/2)];

let gameState='menu', camera={x:0,y:0};
let remotePlayers={};   // other PvP players by emailKey
let bullets=[], effects=[], killfeed=[];
let bomb={planted:false,x:0,y:0,timer:0,defusing:false,defuseProgress:0,planting:false,plantProgress:0,siteLabel:'A'};
let round={num:1,ctScore:0,tScore:0,timer:ROUND_TIME,phase:'buy',phaseTimer:BUY_TIME};
let nextRoundTimer=0, isBuyOpen=false;
let keys={},mouseX=0,mouseY=0,mouseDown=false;

const player={
  x:0,y:0,angle:0,
  hp:100,armor:0,hasHelmet:false,
  money:800,
  weapons:[{...WEAPONS.usp,ammo:12,reserve:36,key:'usp'}],
  activeWeapon:0,
  hasBomb:false,
  lastShot:0,reloading:false,reloadEnd:0,
  alive:true, isT:false,
  kills:0, deaths:0,
  get name(){ return charCfg.name||'GHOST_7'; },
  get bodyColor(){ return charCfg.body||'#5BA3F0'; },
  get accentColor(){ return charCfg.accent||'#2E86C1'; },
  get shape(){ return charCfg.shape||'circle'; },
};

// ── Wall / movement helpers ──────────────────────────
function isWall(x,y){ const c=Math.floor(x/TILE),r=Math.floor(y/TILE); if(r<0||r>=MAP_H||c<0||c>=MAP_W) return true; return MAP_DATA[r][c]===1; }
function moveWithCollision(obj,dx,dy){ const r=PLAYER_R; let nx=obj.x+dx,ny=obj.y+dy; if(!isWall(nx-r,obj.y-r)&&!isWall(nx+r,obj.y-r)&&!isWall(nx-r,obj.y+r)&&!isWall(nx+r,obj.y+r)) obj.x=nx; nx=obj.x; if(!isWall(nx-r,ny-r)&&!isWall(nx+r,ny-r)&&!isWall(nx-r,ny+r)&&!isWall(nx+r,ny+r)) obj.y=ny; }
function hasLOS(ax,ay,bx,by){ const dist=Math.hypot(bx-ax,by-ay),steps=Math.ceil(dist/8); for(let i=1;i<steps;i++){const tx=ax+(bx-ax)*i/steps,ty=ay+(by-ay)*i/steps;if(isWall(tx,ty))return false;} return true; }

// ── Character drawing ────────────────────────────────
function drawCharacterShape(context,x,y,radius,bodyColor,accentColor,shape,angle,isPlayer=false,name=''){
  context.save(); context.translate(x,y); context.rotate(angle);
  context.fillStyle='rgba(0,0,0,0.3)'; context.beginPath();
  if(shape==='square') context.rect(-radius+2,-radius*0.7+2,radius*2,radius*1.4);
  else context.ellipse(2,2,radius,radius*0.7,0,0,Math.PI*2);
  context.fill();
  context.fillStyle=bodyColor;
  if(shape==='circle'){context.beginPath();context.arc(0,0,radius,0,Math.PI*2);context.fill();}
  else if(shape==='square'){const s=radius*1.2;context.beginPath();context.roundRect(-s,-s,s*2,s*2,3);context.fill();}
  else if(shape==='diamond'){context.beginPath();context.moveTo(0,-radius*1.2);context.lineTo(radius*1.2,0);context.lineTo(0,radius*1.2);context.lineTo(-radius*1.2,0);context.closePath();context.fill();}
  context.strokeStyle=accentColor; context.lineWidth=isPlayer?2.5:1.5; context.stroke();
  context.fillStyle=accentColor; context.fillRect(radius-2,-2,10,4);
  context.fillStyle='rgba(255,255,255,0.35)'; context.beginPath(); context.arc(3,0,4,0,Math.PI*2); context.fill();
  context.restore();
  if(name){ context.save(); context.font='bold 8px Share Tech Mono'; context.textAlign='center'; context.fillStyle=bodyColor; context.fillText(name,x,y-radius-6); context.restore(); }
}

// ── Round init ───────────────────────────────────────
function initRound(){
  const spawns = player.isT ? tSpawns : ctSpawns;
  const sp=spawns[Math.floor(Math.random()*spawns.length)];
  player.x=sp.x; player.y=sp.y; player.alive=true;
  player.hp=100; player.hasBomb=false; player.reloading=false;
  if(player.weapons.length===0) player.weapons=[{...WEAPONS.usp,ammo:WEAPONS.usp.mag,reserve:WEAPONS.usp.reserve,key:'usp'}];
  player.weapons.forEach(w=>{const wt=WEAPONS[w.key]||w;w.ammo=wt.mag;});
  bullets=[]; effects=[];
  bomb={planted:false,x:0,y:0,timer:0,defusing:false,defuseProgress:0,planting:false,plantProgress:0,siteLabel:'A'};
  round.timer=ROUND_TIME; round.phase='buy'; round.phaseTimer=BUY_TIME;
  gameState='buyphase';
  document.getElementById('buy-phase-banner').style.display='block';
  document.getElementById('bomb-status').style.display='none';
  document.getElementById('dead-msg').style.display='none';
  document.getElementById('round-end').style.display='none';
  updateHUD(); updatePips();
  pushMyState(); // tell Firebase our spawn position
}

// ── Firebase: push my state every frame (throttled) ──
let lastPush=0;
async function pushMyState(){
  if(!firestoreOk||!myRoomId||!myEmail) return;
  const now=Date.now();
  if(now-lastPush<50) return; // 20 fps max
  lastPush=now;
  const emailKey=myEmail.replace(/\./g,'_').replace(/@/g,'__at__');
  const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
  try {
    await updateDoc(roomRef,{
      [`players.${emailKey}.x`]:Math.round(player.x),
      [`players.${emailKey}.y`]:Math.round(player.y),
      [`players.${emailKey}.angle`]:+player.angle.toFixed(3),
      [`players.${emailKey}.hp`]:player.hp,
      [`players.${emailKey}.alive`]:player.alive,
      [`players.${emailKey}.hasBomb`]:player.hasBomb,
      [`players.${emailKey}.kills`]:player.kills,
      [`players.${emailKey}.deaths`]:player.deaths,
      [`players.${emailKey}.ping`]:pingMs,
    });
  } catch(e){}
}

// ── Firebase: push game events (host only) ───────────
let isHost=false;
async function pushRoundState(){
  if(!isHost||!firestoreOk||!myRoomId) return;
  const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
  try {
    await updateDoc(roomRef,{
      ctScore:round.ctScore, tScore:round.tScore, roundNum:round.num,
      roundPhase:round.phase, roundTimer:+round.timer.toFixed(1),
      'bomb.planted':bomb.planted, 'bomb.x':bomb.x, 'bomb.y':bomb.y, 'bomb.timer':+bomb.timer.toFixed(1),
    });
  } catch(e){}
}

// ── Start game from lobby snapshot ──────────────────
function startGame(data){
  if(gameState!=='menu') return;
  if(lobbyUnsub){lobbyUnsub();lobbyUnsub=null;}
  document.getElementById('main-menu').style.display='none';
  document.getElementById('hud').style.display='flex';
  document.getElementById('online-panel').style.display='flex';
  document.getElementById('waiting-overlay').style.display='none';

  const emailKey=myEmail.replace(/\./g,'_').replace(/@/g,'__at__');
  const myData=data.players?.[emailKey]||{};
  player.isT = (myData.team||myTeam)==='t';
  isHost = data.host===myEmail;

  // Team badge
  const badge=document.getElementById('team-badge');
  badge.textContent=player.isT?'◉ T SIDE':'◈ CT SIDE';
  badge.style.color=player.isT?'#e05c4a':'#5ba3f0';
  badge.style.display='block';

  // If this player has a bomb (first T spawns with it)
  if(player.isT){
    const tPlayers=Object.entries(data.players||{}).filter(([,v])=>v.team==='t');
    if(tPlayers.length>0&&tPlayers[0][0]===emailKey) player.hasBomb=true;
  }

  initRound();
  loop();

  // Subscribe to room for remote player updates
  const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
  gameUnsub=onSnapshot(roomRef,snap=>{
    if(!snap.exists()) return;
    const d=snap.data();
    // Update remote players
    const allPlayers=d.players||{};
    remotePlayers={};
    Object.entries(allPlayers).forEach(([ek,info])=>{
      if(ek===emailKey) return;
      remotePlayers[ek]=info;
    });
    updateOnlinePanel(allPlayers,emailKey);
    // Sync round state from host
    if(!isHost){
      if(d.ctScore!==undefined) round.ctScore=d.ctScore;
      if(d.tScore!==undefined)  round.tScore=d.tScore;
      if(d.roundNum!==undefined&&d.roundNum!==round.num){ round.num=d.roundNum; }
      if(d.roundTimer!==undefined) round.timer=d.roundTimer;
      if(d.bomb?.planted!==undefined){
        bomb.planted=d.bomb.planted;
        if(bomb.planted){bomb.x=d.bomb.x;bomb.y=d.bomb.y;bomb.timer=d.bomb.timer;
          document.getElementById('bomb-status').style.display='flex';}
        else document.getElementById('bomb-status').style.display='none';
      }
    }
    updateHUD();
  });

  // Ping loop
  setInterval(()=>{
    pingStart=Date.now();
    pushMyState().then(()=>{pingMs=Date.now()-pingStart;document.getElementById('ping-badge').textContent=`● ${pingMs}MS`;});
  },2000);
}

function updateOnlinePanel(players,myKey){
  const list=document.getElementById('online-list'); list.innerHTML='';
  Object.entries(players).forEach(([ek,info])=>{
    const row=document.createElement('div'); row.className='online-player';
    const dot=document.createElement('div'); dot.className='online-dot'; dot.style.background=info.body||'#5BA3F0';
    const name=document.createElement('span'); name.style.color=ek===myKey?'#c8a96e':'#8a9199'; name.textContent=info.name||'???';
    const team=document.createElement('span'); team.style.color=info.team==='ct'?'#5ba3f0':'#e05c4a'; team.textContent=' '+((info.team||'ct').toUpperCase());
    row.appendChild(dot); row.appendChild(name); row.appendChild(team);
    list.appendChild(row);
  });
}

// ── HUD helpers ──────────────────────────────────────
function updateHUD(){
  document.getElementById('money').textContent='$'+player.money;
  document.getElementById('health-num').textContent=player.alive?player.hp:0;
  document.getElementById('hp-fill').style.width=(player.alive?player.hp:0)+'%';
  document.getElementById('armor-num').textContent='♦ '+player.armor;
  const w=player.weapons[player.activeWeapon];
  if(w){document.getElementById('weapon-info').textContent=w.name;document.getElementById('ammo-info').textContent=`${w.ammo}/${w.reserve}`;}
  document.getElementById('score-ct').textContent=round.ctScore;
  document.getElementById('score-t').textContent=round.tScore;
}
function updateTimer(){ const t=Math.ceil(round.timer),m=Math.floor(t/60),s=t%60; document.getElementById('round-timer').textContent=`${m}:${s.toString().padStart(2,'0')}`; document.getElementById('round-info').textContent=`ROUND ${round.num} OF 30`; }
function updatePips(){
  const ctPips=document.getElementById('ct-pips'),tPips=document.getElementById('t-pips');
  ctPips.innerHTML=''; tPips.innerHTML='';
  // Local player pip
  const cpip=document.createElement('div'); cpip.className='pip ct'+(player.alive?'':' dead'); (player.isT?tPips:ctPips).appendChild(cpip);
  // Remote player pips
  Object.values(remotePlayers).forEach(info=>{
    const pip=document.createElement('div'); pip.className='pip '+(info.team||'ct')+(info.alive===false?' dead':'');
    (info.team==='t'?tPips:ctPips).appendChild(pip);
  });
}

let killfeedArr=[];
function addKillfeed(killer,weapon,victim,side){
  const kf=document.getElementById('killfeed');
  const div=document.createElement('div'); div.className=`kf-entry kf-${side}`;
  div.innerHTML=`<span class="kf-killer">${killer}</span><span class="kf-weapon">✦${weapon}✦</span><span class="kf-victim">${victim}</span>`;
  kf.insertBefore(div,kf.firstChild); killfeedArr.push(div);
  if(killfeedArr.length>4){const old=killfeedArr.shift();old.remove();}
  setTimeout(()=>{div.style.opacity='0';div.style.transition='opacity 1s';setTimeout(()=>{if(div.parentNode)div.remove();killfeedArr=killfeedArr.filter(x=>x!==div);},1000);},4000);
}

// ── Input ────────────────────────────────────────────
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
  const now=Date.now(); if(now-player.lastShot<w.rof) return;
  if(w.ammo<=0){startReload();return;}
  player.lastShot=now; w.ammo--;
  const da=(Math.random()-0.5)*w.spread*2,angle=player.angle+da;
  bullets.push({x:player.x,y:player.y,vx:Math.cos(angle)*BULLET_SPEED,vy:Math.sin(angle)*BULLET_SPEED,owner:'player',dmg:w.dmg,life:60});
  effects.push({type:'muzzle',x:player.x,y:player.y,life:3,maxLife:3,angle:player.angle});
  updateHUD();
}

function startReload(){
  if(!player.alive) return;
  const w=player.weapons[player.activeWeapon];
  if(!w||player.reloading||w.ammo===w.mag||w.reserve===0) return;
  player.reloading=true; const rt=w.reload*1000; player.reloadEnd=Date.now()+rt;
  document.getElementById('reload-bar').style.display='block';
  const fill=document.getElementById('reload-fill');
  fill.style.transition=`width ${w.reload}s linear`; fill.style.width='0%';
  setTimeout(()=>fill.style.width='100%',10);
  setTimeout(()=>{if(!player.alive)return;const needed=w.mag-w.ammo,take=Math.min(needed,w.reserve);w.ammo+=take;w.reserve-=take;player.reloading=false;document.getElementById('reload-bar').style.display='none';fill.style.width='0%';fill.style.transition='none';updateHUD();},rt);
}

function switchWeapon(idx){
  if(idx<player.weapons.length){player.activeWeapon=idx;player.reloading=false;document.getElementById('reload-bar').style.display='none';updateHUD();}
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
  const items=document.getElementById('buy-items'); items.innerHTML='';
  document.getElementById('buy-money').textContent='FUNDS: $'+player.money;
  const shopItems=[{key:'m4a1',w:WEAPONS.m4a1},{key:'ak47',w:WEAPONS.ak47},{key:'awp',w:WEAPONS.awp},{key:'deagle',w:WEAPONS.deagle},{key:'mp5',w:WEAPONS.mp5},{key:'armor',w:WEAPONS.armor},{key:'helmet',w:WEAPONS.helmet},{key:'usp',w:WEAPONS.usp}];
  shopItems.forEach(({key,w})=>{
    const div=document.createElement('div'); div.className='buy-item'+(player.money<w.cost?' cant-afford':'');
    div.innerHTML=`<div class="bi-type">${w.type}</div><div class="bi-name">${w.name}</div><div class="bi-cost">$${w.cost}</div>`;
    if(player.money>=w.cost) div.addEventListener('click',()=>buyItem(key,w));
    items.appendChild(div);
  });
}

function buyItem(key,w){
  if(player.money<w.cost) return; player.money-=w.cost;
  if(key==='armor'){player.armor=100;}else if(key==='helmet'){player.hasHelmet=true;}
  else{const existing=player.weapons.find(pw=>pw.key===key);if(existing){existing.reserve=Math.min(existing.reserve+existing.mag,existing.mag*3);}else{player.weapons.push({...w,ammo:w.mag,reserve:w.reserve,key});}}
  buildBuyMenu(); updateHUD();
}

// ── Round end / game over ────────────────────────────
function endRound(ctWins,reason){
  if(gameState==='roundend') return;
  gameState='roundend';
  if(ctWins){round.ctScore++;player.money=Math.min(16000,player.money+(player.isT?1400:3250));}
  else{round.tScore++;player.money=Math.min(16000,player.money+(player.isT?3250:1400));}
  document.getElementById('bomb-status').style.display='none';
  document.getElementById('defuse-prompt').style.display='none';
  document.getElementById('plant-prompt').style.display='none';
  const re=document.getElementById('round-end'); re.style.display='flex';
  document.getElementById('re-title').textContent=ctWins?'CT WIN':'T WIN';
  document.getElementById('re-title').style.color=ctWins?'#5ba3f0':'#e05c4a';
  document.getElementById('re-reason').textContent=reason.toUpperCase();
  const myWin=(ctWins&&!player.isT)||(!ctWins&&player.isT);
  document.getElementById('re-rewards').textContent=myWin?'+$3,250 (WIN)':'+$1,400 (LOSS BONUS)';
  nextRoundTimer=5;
  updateHUD();
  if(isHost) pushRoundState();
}

function endGame(){
  gameState='gameover';
  document.getElementById('round-end').style.display='flex';
  const ctWon=round.ctScore>round.tScore;
  const iWon=(ctWon&&!player.isT)||(!ctWon&&player.isT);
  document.getElementById('re-title').textContent=iWon?'VICTORY':'DEFEAT';
  document.getElementById('re-title').style.color=iWon?'#00ff88':'#e05c4a';
  document.getElementById('re-reason').textContent=`FINAL: CT ${round.ctScore} — T ${round.tScore}`;
  document.getElementById('re-rewards').textContent=`K: ${player.kills}  D: ${player.deaths}`;
  document.getElementById('re-next').textContent='REFRESH TO PLAY AGAIN';
  // Push final stats to leaderboard
  pushLeaderboard();
}

async function pushLeaderboard(){
  if(!firestoreOk||!myEmail) return;
  const emailKey=myEmail.replace(/\./g,'_').replace(/@/g,'__at__');
  const ref=doc(db,'ozh_leaderboard',emailKey);
  try {
    const snap=await getDoc(ref);
    const ctWon=round.ctScore>round.tScore;
    const iWon=(ctWon&&!player.isT)||(!ctWon&&player.isT);
    if(!snap.exists()){
      await setDoc(ref,{
        name:player.name, email:myEmail, body:charCfg.body, shape:charCfg.shape,
        kills:player.kills, deaths:player.deaths, wins:iWon?1:0, losses:iWon?0:1,
        gamesPlayed:1, lastSeen:serverTimestamp()
      });
    } else {
      await updateDoc(ref,{
        kills:increment(player.kills), deaths:increment(player.deaths),
        wins:increment(iWon?1:0), losses:increment(iWon?0:1),
        gamesPlayed:increment(1), lastSeen:serverTimestamp(),
        name:player.name, body:charCfg.body, shape:charCfg.shape,
      });
    }
  } catch(e){ console.warn('Leaderboard push failed:',e); }
}

// ── Main update loop ─────────────────────────────────
function update(dt){
  if(gameState==='buyphase'){
    round.phaseTimer-=dt/60; round.timer=ROUND_TIME;
    if(round.phaseTimer<=0){ gameState='playing'; document.getElementById('buy-phase-banner').style.display='none'; document.getElementById('buy-menu').style.display='none'; isBuyOpen=false; }
  }
  if(gameState==='roundend'){
    nextRoundTimer-=dt/60;
    const el=document.getElementById('re-next'); if(el) el.textContent=`NEXT ROUND IN ${Math.ceil(Math.max(nextRoundTimer,0))}...`;
    if(nextRoundTimer<=0){
      document.getElementById('round-end').style.display='none';
      round.num++;
      if(round.ctScore>=16||round.tScore>=16||round.num>30){endGame();return;}
      initRound();
    }
    return;
  }
  if(gameState!=='playing'&&gameState!=='buyphase') return;

  // Player movement
  if(player.alive&&!isBuyOpen){
    const spd=2.2; let dx=0,dy=0;
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

  // Push state to Firebase (throttled)
  pushMyState();

  if(gameState==='playing'){
    round.timer-=dt/60; updateTimer();
    if(round.timer<=0){endRound(false,'TIME EXPIRED');return;}
    if(isHost) pushRoundState();
  }

  // Bomb logic
  if(bomb.planted){
    bomb.timer-=dt/60;
    document.getElementById('bomb-bar').style.width=(bomb.timer/BOMB_TIME*100)+'%';
    if(bomb.timer<=0){endRound(false,'BOMB EXPLODED');return;}
    // CT can defuse
    if(!player.isT){
      const ddx=player.x-bomb.x,ddy=player.y-bomb.y,dd=Math.hypot(ddx,ddy);
      if(dd<40&&player.alive&&!isBuyOpen){
        document.getElementById('defuse-prompt').style.display='block';
        if(keys['f']){bomb.defuseProgress+=dt/60/DEFUSE_TIME;if(bomb.defuseProgress>=1){endRound(true,'BOMB DEFUSED');return;}}
        else{bomb.defuseProgress=Math.max(0,bomb.defuseProgress-dt/60/2);}
      } else {document.getElementById('defuse-prompt').style.display='none';bomb.defuseProgress=Math.max(0,bomb.defuseProgress-dt/60/2);}
    }
  }

  // T plants bomb
  if(!bomb.planted&&player.hasBomb&&player.isT){
    const ddx=player.x-bombsite.x,ddy=player.y-bombsite.y,dd=Math.hypot(ddx,ddy);
    if(dd<40&&player.alive){
      document.getElementById('plant-prompt').style.display='block';
      if(keys['f']){bomb.plantProgress+=dt/60/PLANT_TIME;if(bomb.plantProgress>=1){
        bomb.planted=true;bomb.x=bombsite.x;bomb.y=bombsite.y;bomb.timer=BOMB_TIME;bomb.siteLabel='A';player.hasBomb=false;bomb.plantProgress=0;
        addKillfeed(player.name,'PLANTED','BOMB','t');
        document.getElementById('bomb-status').style.display='flex';
        document.getElementById('plant-prompt').style.display='none';
        if(isHost) pushRoundState();
      }}
      else{bomb.plantProgress=Math.max(0,bomb.plantProgress-dt/60/2);}
    } else {document.getElementById('plant-prompt').style.display='none';}
  }

  // Bullet movement + hit detection
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i]; b.x+=b.vx; b.y+=b.vy; b.life--;
    if(b.life<=0||isWall(b.x,b.y)){if(isWall(b.x,b.y)) effects.push({type:'impact',x:b.x,y:b.y,life:8,maxLife:8}); bullets.splice(i,1); continue;}

    // Hit local player (from enemy team shots — simulated, remote bullets not yet synced)
    // PvP: we do local bullet vs remote player hit checks (bullets are only local)
    if(b.owner==='player'){
      // Check vs remote players
      let hit=false;
      Object.entries(remotePlayers).forEach(([ek,info])=>{
        if(!info.alive||hit) return;
        if(Math.hypot(b.x-info.x,b.y-info.y)<PLAYER_R+3){
          hit=true;
          let dmg=b.dmg;
          if(info.armor>0){const a=Math.min(dmg*0.5,info.armor);dmg-=a;}
          effects.push({type:'blood',x:info.x,y:info.y,life:15,maxLife:15});
          // Notify Firebase that we hit this player
          hitRemotePlayer(ek,dmg);
          addKillfeed(player.name,player.weapons[player.activeWeapon]?.name||'GUN',info.name||'ENEMY','ct');
        }
      });
      if(hit){bullets.splice(i,1);}
    }
  }

  // Check if remote bullets hit us (read from firebase snapshot - simplified: we check our HP from remote)
  // Local effects tick
  for(let i=effects.length-1;i>=0;i--){effects[i].life--;if(effects[i].life<=0)effects.splice(i,1);}

  // Win condition for PvP
  if(gameState==='playing'){
    const allRemoteDead=Object.values(remotePlayers).every(p=>!p.alive);
    const localTeam=player.isT?'t':'ct';
    const enemyTeamDead=Object.values(remotePlayers).filter(p=>p.team!==localTeam).every(p=>!p.alive);
    if(!player.isT&&enemyTeamDead&&!bomb.planted){endRound(true,'ALL T ELIMINATED');return;}
    if(player.isT&&!player.alive){const ctPlayers=Object.values(remotePlayers).filter(p=>p.team==='ct');if(ctPlayers.length===0||ctPlayers.every(p=>!p.alive)){/* all ct dead - T wins */ endRound(false,'ALL CT ELIMINATED');return;}}
  }

  camera.x=player.x-canvas.width/2; camera.y=player.y-canvas.height/2;
  updatePips();
}

async function hitRemotePlayer(emailKey,dmg){
  if(!firestoreOk||!myRoomId) return;
  try {
    const roomRef=doc(db,'ozh_pvp_rooms',myRoomId);
    const snap=await getDoc(roomRef);
    if(!snap.exists()) return;
    const data=snap.data();
    const info=data.players?.[emailKey];
    if(!info||!info.alive) return;
    let newHp=Math.max(0,(info.hp||100)-dmg);
    let updates={[`players.${emailKey}.hp`]:newHp};
    if(newHp<=0){
      updates[`players.${emailKey}.alive`]=false;
      updates[`players.${emailKey}.deaths`]=increment(1);
      updates[`players.${myEmail.replace(/\./g,'_').replace(/@/g,'__at__')}.kills`]=increment(1);
      player.kills++;
      player.money=Math.min(16000,player.money+300);
      updateHUD();
    }
    await updateDoc(roomRef,updates);
  } catch(e){}
}

// ── Draw ─────────────────────────────────────────────
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.translate(-camera.x,-camera.y);

  // Map
  for(let r=0;r<MAP_H;r++){
    for(let c=0;c<MAP_W;c++){
      const cell=MAP_DATA[r][c],x=c*TILE,y=r*TILE;
      if(cell===1){ctx.fillStyle='#1a2030';ctx.fillRect(x,y,TILE,TILE);ctx.strokeStyle='rgba(200,169,110,0.06)';ctx.lineWidth=1;ctx.strokeRect(x,y,TILE,TILE);}
      else if(cell===2){ctx.fillStyle='rgba(192,57,43,0.12)';ctx.fillRect(x,y,TILE,TILE);ctx.strokeStyle='rgba(192,57,43,0.3)';ctx.lineWidth=1;ctx.strokeRect(x,y,TILE,TILE);ctx.fillStyle='rgba(192,57,43,0.25)';ctx.font='bold 18px Barlow Condensed';ctx.textAlign='center';ctx.fillText('A',x+TILE/2,y+TILE/2+6);}
      else{ctx.fillStyle=(r+c)%2===0?'#141820':'#131720';ctx.fillRect(x,y,TILE,TILE);}
    }
  }

  // Effects
  effects.forEach(ef=>{
    const a=ef.life/ef.maxLife;
    if(ef.type==='blood'){ctx.save();ctx.globalAlpha=a*0.6;ctx.fillStyle='#8B1A1A';ctx.beginPath();ctx.arc(ef.x,ef.y,6,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(ef.type==='impact'){ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#FFB300';ctx.beginPath();ctx.arc(ef.x,ef.y,3,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(ef.type==='muzzle'){ctx.save();ctx.globalAlpha=a*0.9;ctx.fillStyle='#FFD700';const mx=ef.x+Math.cos(ef.angle)*18,my=ef.y+Math.sin(ef.angle)*18;ctx.beginPath();ctx.arc(mx,my,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,200,50,0.5)';ctx.beginPath();ctx.arc(mx,my,10,0,Math.PI*2);ctx.fill();ctx.restore();}
  });

  // Bomb
  if(bomb.planted){
    const pulse=Math.sin(Date.now()/200)*0.4+0.6;
    ctx.save();ctx.globalAlpha=pulse;ctx.fillStyle='#FFB300';ctx.beginPath();ctx.arc(bomb.x,bomb.y,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#FF6600';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    if(bomb.defuseProgress>0){ctx.save();ctx.strokeStyle='#00FF88';ctx.lineWidth=3;ctx.beginPath();ctx.arc(bomb.x,bomb.y,14,-Math.PI/2,-Math.PI/2+bomb.defuseProgress*Math.PI*2);ctx.stroke();ctx.restore();}
  }

  // Bullets
  bullets.forEach(b=>{ctx.save();ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(b.x,b.y,2,0,Math.PI*2);ctx.fill();ctx.restore();});

  // Remote PvP players
  Object.values(remotePlayers).forEach(info=>{
    if(!info.alive) return;
    drawCharacterShape(ctx,info.x,info.y,PLAYER_R,info.body||'#e05c4a',info.accent||'#c0392b',info.shape||'circle',info.angle||0,false,info.name||'???');
    // Health bar
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(info.x-16,info.y-28,32,4);
    ctx.fillStyle=(info.hp||0)>50?'#4caf50':'#e05c4a';ctx.fillRect(info.x-16,info.y-28,32*((info.hp||0)/100),4);
    ctx.restore();
    // Team indicator ring
    const teamColor=info.team==='ct'?'#5ba3f0':'#e05c4a';
    ctx.save();ctx.strokeStyle=teamColor;ctx.lineWidth=1;ctx.globalAlpha=0.4;ctx.beginPath();ctx.arc(info.x,info.y,PLAYER_R+4,0,Math.PI*2);ctx.stroke();ctx.restore();
    // Bomb carrier
    if(info.hasBomb){ctx.save();ctx.fillStyle='#FFB300';ctx.font='bold 10px Share Tech Mono';ctx.textAlign='center';ctx.fillText('C4',info.x,info.y-32);ctx.restore();}
  });

  // Local player
  if(player.alive){
    drawCharacterShape(ctx,player.x,player.y,PLAYER_R,player.bodyColor,player.accentColor,player.shape,player.angle,true,player.name);
    // Bomb plant progress arc
    if(bomb.plantProgress>0){ctx.save();ctx.strokeStyle='#FFB300';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x,player.y,14,-Math.PI/2,-Math.PI/2+bomb.plantProgress*Math.PI*2);ctx.stroke();ctx.restore();}
  }

  ctx.restore();
  drawMinimap();
}

function drawMinimap(){
  const mm=miniCanvas; mctx.clearRect(0,0,mm.width,mm.height);
  const tileW=mm.width/MAP_W,tileH=mm.height/MAP_H;
  for(let r=0;r<MAP_H;r++){for(let c=0;c<MAP_W;c++){const cell=MAP_DATA[r][c];mctx.fillStyle=cell===1?'#1a2030':cell===2?'rgba(192,57,43,0.4)':'#141820';mctx.fillRect(c*tileW,r*tileH,tileW,tileH);}}
  if(bomb.planted){const bx=bomb.x/TILE*tileW,by=bomb.y/TILE*tileH;const p=Math.sin(Date.now()/300)*0.5+0.5;mctx.fillStyle=`rgba(255,179,0,${p})`;mctx.fillRect(bx-2,by-2,4,4);}
  Object.values(remotePlayers).forEach(info=>{
    if(!info.alive) return;
    mctx.fillStyle=info.team==='ct'?'#5ba3f0':'#e05c4a';
    mctx.beginPath();mctx.arc(info.x/TILE*tileW,info.y/TILE*tileH,2.5,0,Math.PI*2);mctx.fill();
  });
  if(player.alive){const px=player.x/TILE*tileW,py=player.y/TILE*tileH;mctx.fillStyle=player.bodyColor;mctx.beginPath();mctx.arc(px,py,3,0,Math.PI*2);mctx.fill();mctx.strokeStyle=player.bodyColor+'aa';mctx.lineWidth=1;mctx.beginPath();mctx.moveTo(px,py);mctx.lineTo(px+Math.cos(player.angle)*7,py+Math.sin(player.angle)*7);mctx.stroke();}
  mctx.strokeStyle='rgba(200,169,110,0.3)';mctx.lineWidth=1;mctx.strokeRect(0,0,mm.width,mm.height);
}

window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});

// ── Main loop ────────────────────────────────────────
let lastTime=0;
function loop(ts=0){
  requestAnimationFrame(loop);
  const dt=Math.min((ts-lastTime)/16.67,3); lastTime=ts;
  if(gameState==='menu') return;
  update(dt); draw();
}

// roundRect polyfill
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.beginPath();this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();};
}

// ── Mobile controls ──────────────────────────────────
(function initMobileControls(){
  const isTouchDevice=()=>window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;
  if(!isTouchDevice()) return;
  document.getElementById('mobile-controls').style.display='block';
  const zone=document.getElementById('joystick-zone'),base=document.getElementById('joystick-base'),stick=document.getElementById('joystick-stick');
  const RADIUS=39; let joystickActive=false,joystickId=null,joyVec={x:0,y:0};
  function getZoneCenter(){const r=base.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};}
  function updateStick(touch){const c=getZoneCenter();let dx=touch.clientX-c.x,dy=touch.clientY-c.y;const dist=Math.hypot(dx,dy);if(dist>RADIUS){dx=dx/dist*RADIUS;dy=dy/dist*RADIUS;}stick.style.transform=`translate(${dx}px,${dy}px)`;joyVec.x=dx/RADIUS;joyVec.y=dy/RADIUS;const DZ=0.25;keys['w']=joyVec.y<-DZ;keys['s']=joyVec.y>DZ;keys['a']=joyVec.x<-DZ;keys['d']=joyVec.x>DZ;}
  zone.addEventListener('touchstart',e=>{e.preventDefault();const t=e.changedTouches[0];joystickId=t.identifier;joystickActive=true;updateStick(t);},{passive:false});
  zone.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===joystickId)updateStick(t);}},{passive:false});
  zone.addEventListener('touchend',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===joystickId){joystickActive=false;joystickId=null;joyVec={x:0,y:0};stick.style.transform='translate(0,0)';keys['w']=keys['s']=keys['a']=keys['d']=false;}}},{passive:false});
  const aimRing=document.getElementById('aim-ring');let aimTouchId=null,aimActive=false;
  canvas.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier!==joystickId&&t.clientX>window.innerWidth*0.42){aimTouchId=t.identifier;aimActive=true;aimRing.style.display='block';aimRing.style.left=t.clientX+'px';aimRing.style.top=t.clientY+'px';}}},{passive:false});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===aimTouchId){aimRing.style.left=t.clientX+'px';aimRing.style.top=t.clientY+'px';const cx=canvas.width/2,cy=canvas.height/2;mouseX=cx+(t.clientX-cx);mouseY=cy+(t.clientY-cy);player.angle=Math.atan2(mouseY-cy,mouseX-cx);}}},{passive:false});
  canvas.addEventListener('touchend',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===aimTouchId){aimTouchId=null;aimActive=false;aimRing.style.display='none';}}},{passive:false});
  const btnShoot=document.getElementById('btn-shoot');let shootInterval=null;
  btnShoot.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();tryShoot();const w=player.weapons[player.activeWeapon];if(w&&w.auto){shootInterval=setInterval(tryShoot,w?w.rof:100);}btnShoot.classList.add('firing');},{passive:false});
  btnShoot.addEventListener('touchend',e=>{e.preventDefault();clearInterval(shootInterval);shootInterval=null;mouseDown=false;btnShoot.classList.remove('firing');},{passive:false});
  document.getElementById('btn-reload').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();startReload();},{passive:false});
  document.getElementById('btn-action').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();keys['f']=true;},{passive:false});
  document.getElementById('btn-action').addEventListener('touchend',e=>{e.preventDefault();keys['f']=false;},{passive:false});
  document.getElementById('btn-buy').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();toggleBuyMenu();},{passive:false});
  document.getElementById('btn-menu').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();isBuyOpen=false;document.getElementById('buy-menu').style.display='none';},{passive:false});
  document.getElementById('weapon-switcher').querySelectorAll('.wpn-btn').forEach(btn=>{btn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();switchWeapon(parseInt(btn.dataset.slot));},{passive:false});});
  document.getElementById('ui').addEventListener('touchmove',e=>{if(e.target.closest('#buy-menu')||e.target.closest('.menu-panel'))return;e.preventDefault();},{passive:false});
})();

</script>
</body>
</html>
