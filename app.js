/* ===================================================================
   Nuclear Fusion Puzzle – initialization fix (2025-06-28)
   ・ゲーム開始時に元素リストと所持数を正しくリセット
   ・タップゾーンでエネルギーと水素を補充
   ・広告／課金用のフックをコメントで用意
   ・他の機能はすべて維持
=================================================================== */
class FusionGame {

  /* ---------- ゲームデータ ---------- */
  gameData = {
    elements:{
      1:{name:'Hydrogen',  symbol:'H',   color:'#ff6b6b'}, 2:{name:'Deuterium', symbol:'²H',  color:'#4ecdc4'},
      3:{name:'Tritium',   symbol:'³H',  color:'#45b7d1'}, 4:{name:'Helium-3',  symbol:'³He', color:'#96ceb4'},
      5:{name:'Helium-4',  symbol:'⁴He', color:'#feca57'}, 6:{name:'Lithium-6', symbol:'⁶Li', color:'#ff9ff3'},
      7:{name:'Beryllium', symbol:'Be',  color:'#54a0ff'}, 8:{name:'Boron',     symbol:'B',   color:'#5f27cd'},
      9:{name:'Carbon',    symbol:'C',   color:'#00d2d3'}
    },
    fusionRules:[
      {r:[1,1], p:[2], e:1.4, prob:0.20, temp:10 }, {r:[1,2], p:[4], e:5.5, prob:0.45, temp:50 },
      {r:[2,4], p:[5], e:8.0, prob:0.55, temp:80 }, {r:[5,2], p:[6], e:5.0, prob:0.50, temp:90 },
      {r:[6,1], p:[7], e:8.0, prob:0.45, temp:110}, {r:[7,1], p:[8], e:10,  prob:0.40, temp:130},
      {r:[8,1], p:[9], e:12,  prob:0.35, temp:150}
    ],
    config:{
      initialEnergy:100, heatIncBase:10, maxTempBase:200, tempDecay:0.95, scoreMul:10,
      tapZone:{ energyGain:1, hChance:0.3 },
      upgrade:{ temp:{level:0,inc:50,cost:100}, heat:{level:0,inc:5,cost:50} }
    }
  };

  /* ---------- 状態 ---------- */
  gameState={ energy:0, score:0, temp:0, unlocked:[], inventory:{}, slots:[null,null] };

  constructor(){ document.addEventListener('DOMContentLoaded',()=>this.init()); }

  /* ================== 初期化 ================== */
  init(){
    this.cacheDom();
    this.bindEvents();
    this.resetGame();
    this.loopParticles();
  }

  cacheDom(){
    this.canvas=document.getElementById('particle-canvas'); this.ctx=this.canvas.getContext('2d');
    this.grid=document.getElementById('element-grid');
    this.heatBtn=document.getElementById('heat-button'); this.fuseBtn=document.getElementById('fuse-button');
    this.clearBtn=document.getElementById('clear-button'); this.upTempBtn=document.getElementById('upgrade-temp-button');
    this.upHeatBtn=document.getElementById('upgrade-heat-button'); this.tapZone=document.getElementById('tap-zone');
    this.energyDisp=document.getElementById('energy-display'); this.tempDisp=document.getElementById('temperature-display');
    this.scoreDisp=document.getElementById('score-display'); this.eqDisp=document.getElementById('reaction-equation');
    this.enDisp=document.getElementById('reaction-energy'); this.tempGauge=document.getElementById('temperature-gauge-fill');
    document.getElementById('start-game').addEventListener('click',()=>{
      document.getElementById('startup-screen').classList.remove('active');
      document.getElementById('game-screen').classList.add('active');
      this.resetGame();
    });
  }

  bindEvents(){
    window.addEventListener('resize',()=>this.resizeCanvas()); this.resizeCanvas();
    this.heatBtn.addEventListener('click',()=>this.increaseTemperature()); this.fuseBtn.addEventListener('click',()=>this.attemptFusion());
    this.clearBtn.addEventListener('click',()=>this.clearReaction()); this.upTempBtn.addEventListener('click',()=>this.buyUpgrade('temp'));
    this.upHeatBtn.addEventListener('click',()=>this.buyUpgrade('heat')); this.tapZone.addEventListener('click',()=>this.handleTapZone());
    setInterval(()=>this.decayTemperature(),1000);
    document.getElementById('continue-button').addEventListener('click',()=>document.getElementById('result-modal').classList.remove('active'));
  }

  /* ★ 修正：ゲーム開始・リセット処理 */
  resetGame(){
    const cfg = this.gameData.config;
    this.gameState.energy = cfg.initialEnergy;
    this.gameState.score = 0;
    this.gameState.temp = 0;
    this.gameState.unlocked = [1];
    this.gameState.inventory = { 1: 10 };
    this.gameState.slots = [null, null];

    cfg.upgrade.temp.level = 0;
    cfg.upgrade.heat.level = 0;

    this.renderElements();
    this.updateDisplay();
    this.updateReactionSlots();
  }

  /* ================== 元素パレット ================== */
  renderElements(){
    this.grid.innerHTML = '';
    Object.entries(this.gameData.elements).forEach(([id, el])=>{
      const unlocked = this.gameState.unlocked.includes(+id);
      const count = this.gameState.inventory[id] || 0;
      const btn=document.createElement('div');
      btn.className = 'element-button' + (unlocked ? '' : ' locked');
      btn.style.backgroundColor = el.color;
      btn.innerHTML = `<div class="element-symbol">${el.symbol}</div><div class="element-count">${count}</div>`;
      if(unlocked){
        btn.addEventListener('click',()=>this.selectElement(+id));
        btn.title = `${el.name} (所持: ${count})`;
      }else{ btn.title = `${el.name} (未発見)`; }
      this.grid.appendChild(btn);
    });
  }

  selectElement(id){
    if((this.gameState.inventory[id]||0)<=0){ this.toast('在庫がありません'); return; }
    const slotIdx = this.gameState.slots.indexOf(null);
    if(slotIdx===-1){ this.toast('スロットが満杯よ'); return; }
    this.gameState.slots[slotIdx]=id;
    this.gameState.inventory[id]--;
    this.updateReactionSlots(); this.renderElements(); this.updateDisplay(); this.checkReactionPossibility();
  }

  updateReactionSlots(){
    this.gameState.slots.forEach((id,i)=>{
      const slot=document.getElementById(`slot-${i+1}`);
      if(id){ slot.textContent=this.gameData.elements[id].symbol; slot.classList.add('filled'); }
      else{ slot.textContent=''; slot.classList.remove('filled'); }
    });
  }

  /* ================== ゲームプレイ ================== */
  handleTapZone(){
    const tapCfg=this.gameData.config.tapZone;
    this.gameState.energy += tapCfg.energyGain;
    if(Math.random()<tapCfg.hChance){
      this.gameState.inventory[1]=(this.gameState.inventory[1]||0)+1;
      this.toast('水素(H)をゲット！'); this.renderElements();
    }
    // 広告／課金フック：if(adWatched){ giveBonus(); }
    this.updateDisplay(); this.createTapParticles();
  }

  increaseTemperature(){
    if(this.gameState.energy<=0){ this.toast('エネルギー不足'); return; }
    this.gameState.temp = Math.min(this.gameState.temp + this.heatIncrement, this.maxTemperature);
    this.gameState.energy--;
    this.updateDisplay(); this.checkReactionPossibility();
  }

  decayTemperature(){
    if(this.gameState.temp>0){
      this.gameState.temp *= this.gameData.config.tempDecay;
      if(this.gameState.temp<1) this.gameState.temp=0;
      this.updateDisplay(); this.checkReactionPossibility();
    }
  }

  attemptFusion(){
    const [a,b] = this.gameState.slots;
    if(!a||!b){ this.toast('元素を2つセットしてね'); return; }
    const rule = this.findFusionRule(a,b);
    if(!rule){ this.toast('その組み合わせでは反応しないわ'); return; }
    if(this.gameState.temp < rule.temp){ this.toast(`${rule.temp}M°C 以上にしてね`); return; }
    const success = Math.random() < Math.min(rule.prob * (this.gameState.temp / rule.temp), 0.95);

    if(success){ this.handleFusionSuccess(rule,a,b); }
    else{
      this.toast('核融合失敗…'); this.consumeReactants(a,b);
      this.clearReaction(); this.renderElements();
    }
    this.updateDisplay();
  }

  handleFusionSuccess(rule,a,b){
    rule.p.forEach(pid=>{
      this.gameState.inventory[pid]=(this.gameState.inventory[pid]||0)+1;
      if(!this.gameState.unlocked.includes(pid)){
        this.gameState.unlocked.push(pid);
        this.toast(`新元素 ${this.gameData.elements[pid].symbol} 解放！`);
      }
    });
    this.gameState.energy += rule.e;
    this.gameState.score += Math.floor(rule.e * this.gameData.config.scoreMul);
    this.consumeReactants(a,b);
    this.showResultModal(rule);
    this.createFusionParticles();
    this.gameState.slots = [null,null];
    this.updateReactionSlots(); this.renderElements(); this.checkReactionPossibility();
  }

  clearReaction(){
    this.gameState.slots.forEach(id=>{
      if(id) this.gameState.inventory[id]=(this.gameState.inventory[id]||0)+1;
    });
    this.gameState.slots=[null,null];
    this.updateReactionSlots(); this.renderElements(); this.checkReactionPossibility();
  }

  consumeReactants(x,y){
    [x,y].forEach(id=>{
      this.gameState.inventory[id]--;
      if(this.gameState.inventory[id]<=0) delete this.gameState.inventory[id];
    });
  }

  buyUpgrade(type){
    const up=this.gameData.config.upgrade[type]; const cost=up.cost*(up.level+1);
    if(this.gameState.energy<cost){ this.toast('エネルギー不足'); return; }
    up.level++; this.gameState.energy-=cost;
    this.toast(type==='temp'?'最大温度を強化！':'加熱量を強化！'); this.updateDisplay();
  }

  /* ================== 表示・UI ================== */
  updateDisplay(){
    this.energyDisp.textContent = Math.floor(this.gameState.energy);
    this.tempDisp.textContent = Math.floor(this.gameState.temp);
    this.scoreDisp.textContent = this.gameState.score;
    this.tempGauge.style.width = `${Math.min((this.gameState.temp/this.maxTemperature)*100,100)}%`;
    const uT=this.gameData.config.upgrade.temp; document.getElementById('upgrade-temp-cost').textContent = uT.cost*(uT.level+1);
    const uH=this.gameData.config.upgrade.heat; document.getElementById('upgrade-heat-cost').textContent = uH.cost*(uH.level+1);
  }

  checkReactionPossibility(){
    const [a,b]=this.gameState.slots;
    if(!a||!b){ this.eqDisp.textContent='元素を2つ配置してね'; this.enDisp.textContent=''; this.fuseBtn.disabled=true; return; }
    const rule=this.findFusionRule(a,b);
    if(rule){
      this.eqDisp.textContent = `${this.gameData.elements[a].symbol} + ${this.gameData.elements[b].symbol} → ${rule.p.map(id=>this.gameData.elements[id].symbol).join(' + ')}`;
      this.enDisp.textContent=`+${rule.e} MeV`; this.fuseBtn.disabled = this.gameState.temp < rule.temp;
    }else{ this.eqDisp.textContent='未知の反応'; this.enDisp.textContent=''; this.fuseBtn.disabled=true; }
  }

  findFusionRule(x,y){
    return this.gameData.fusionRules.find(rule=>{
      const [a,b]=rule.r; return (a===x&&b===y)||(a===y&&b===x);
    });
  }

  toast(msg){
    const t=document.createElement('div'); t.textContent=msg;
    t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#c0142f;color:#fff;padding:10px 20px;border-radius:8px;z-index:1001;';
    document.body.appendChild(t); setTimeout(()=>t.remove(),2500);
  }

  showResultModal(rule){
    document.getElementById('result-title').textContent='核融合成功！';
    document.getElementById('result-elements').textContent=rule.p.map(id=>this.gameData.elements[id].symbol).join(' + ');
    document.getElementById('result-energy').textContent=`+${rule.e} MeV`;
    document.getElementById('result-modal').classList.add('active');
  }

  get maxTemperature(){ const {maxTempBase,upgrade:{temp}}=this.gameData.config; return maxTempBase+temp.level*temp.inc; }
  get heatIncrement(){ const {heatIncBase,upgrade:{heat}}=this.gameData.config; return heatIncBase+heat.level*heat.inc; }

  /* ================== パーティクル ================== */
  particles=[]; resizeCanvas(){ this.canvas.width=innerWidth; this.canvas.height=innerHeight; }
  createFusionParticles(){ this.spawnParticles('#4ecdc4'); } createTapParticles(){ this.spawnParticles('#feca57',15); }
  spawnParticles(color,count=30){
    for(let i=0;i<count;i++) this.particles.push({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-0.5)*10,vy:(Math.random()-0.5)*10,life:1,decay:0.02,size:Math.random()*3+1,color});
  }
  updateParticles(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if(p.life<=0){ this.particles.splice(i,1); continue; }
      this.ctx.globalAlpha=p.life; this.ctx.fillStyle=p.color;
      this.ctx.beginPath(); this.ctx.arc(p.x,p.y,p.size,0,Math.PI*2); this.ctx.fill();
    }
    this.ctx.globalAlpha=1;
  }
  loopParticles(){ const loop=()=>{ this.updateParticles(); requestAnimationFrame(loop); }; loop(); }
}

new FusionGame();
