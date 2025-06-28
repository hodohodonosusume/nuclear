/* ===================================================================
   Nuclear Fusion Puzzle – "Genesis" Edition (100 Elements)
   ・元素データと核融合ルールを約100種類に大幅拡張
   ・ゲームバランスを調整し、後半になるほど難しくなるように
   ・その他、既存のアップグレードやタップゾーン機能はすべて維持
=================================================================== */
class FusionGame {

  /* ---------- ゲームデータ ---------- */
  gameData = {
    // ★ 元素データを100種類に拡張！
    elements: {
      1: { name: "Hydrogen", symbol: "H"    , color: "#ff6b6b" }, 2: { name: "Deuterium", symbol: "²H"   , color: "#ff8c8c" },
      3: { name: "Tritium", symbol: "³H"   , color: "#ffa2a2" }, 4: { name: "Helium-3", symbol: "³He"  , color: "#ffb7b7" },
      5: { name: "Helium-4", symbol: "⁴He"  , color: "#ffdada" }, 6: { name: "Lithium-6", symbol: "⁶Li"  , color: "#4ecdc4" },
      7: { name: "Beryllium-7", symbol: "⁷Be"  , color: "#63d1c9" }, 8: { name: "Boron-8", symbol: "⁸B"   , color: "#77d6ce" },
      9: { name: "Carbon-9", symbol: "⁹C"   , color: "#8bdbc4" }, 10: { name: "Nitrogen-10", symbol: "¹⁰N"  , color: "#a0e0ba" },
      11: { name: "Oxium", symbol: "Ox"   , color: "#45b7d1" }, 12: { name: "Fluorium", symbol: "Fl"   , color: "#59bdd5" },
      13: { name: "Neonium", symbol: "Ne"   , color: "#6dc3da" }, 14: { name: "Sodium", symbol: "Na"   , color: "#81c9df" },
      15: { name: "Magnesium", symbol: "Mg"   , color: "#96cee5" }, 16: { name: "Aluminium", symbol: "Al"   , color: "#96ceb4" },
      17: { name: "Silicon", symbol: "Si"   , color: "#a3d3bd" }, 18: { name: "Phosphorus", symbol: "P"    , color: "#b0d8c6" },
      19: { name: "Sulfur", symbol: "S"    , color: "#bdddd0" }, 20: { name: "Chlorine", symbol: "Cl"   , color: "#cae2d9" },
      21: { name: "Argonium", symbol: "Ar"   , color: "#feca57" }, 22: { name: "Potassium", symbol: "K"    , color: "#fed470" },
      23: { name: "Calcium", symbol: "Ca"   , color: "##fedd8a" }, 24: { name: "Scandium", symbol: "Sc"   , color: "#fee7a3" },
      25: { name: "Titanium", symbol: "Ti"   , color: "#feefbd" }, 26: { name: "Vanadium", symbol: "V"    , color: "#ff9ff3" },
      27: { name: "Chromium", symbol: "Cr"   , color: "#ffa8f4" }, 28: { name: "Manganese", symbol: "Mn"   , color: "#ffb2f6" },
      29: { name: "Iron", symbol: "Fe"   , color: "#ffbbf7" }, 30: { name: "Cobalt", symbol: "Co"   , color: "#ffc5f9" },
      31: { name: "Nickel", symbol: "Ni"   , color: "#54a0ff" }, 32: { name: "Copper", symbol: "Cu"   , color: "#68a9ff" },
      33: { name: "Zinc", symbol: "Zn"   , color: "#7cb2ff" }, 34: { name: "Gallium", symbol: "Ga"   , color: "#90bbff" },
      35: { name: "Germanium", symbol: "Ge"   , color: "#a4c4ff" }, 36: { name: "Arsenic", symbol: "As"   , color: "#5f27cd" },
      37: { name: "Selenium", symbol: "Se"   , color: "#7240d4" }, 38: { name: "Bromine", symbol: "Br"   , color: "#8559da" },
      39: { name: "Krypton", symbol: "Kr"   , color: "#9872e1" }, 40: { name: "Rubidium", symbol: "Rb"   , color: "#ab8be7" },
      41: { name: "Strontium", symbol: "Sr"   , color: "#00d2d3" }, 42: { name: "Yttrium", symbol: "Y"    , color: "#19d7d8" },
      43: { name: "Zirconium", symbol: "Zr"   , color: "#32dddd" }, 44: { name: "Niobium", symbol: "Nb"   , color: "#4ce2e2" },
      45: { name: "Molybdenum", symbol: "Mo"   , color: "#65e7e7" }, 46: { name: "Technetium", symbol: "Tc"   , color: "#ff6b6b" },
      47: { name: "Ruthenium", symbol: "Ru"   , color: "#ff8c8c" }, 48: { name: "Rhodium", symbol: "Rh"   , color: "#ffa2a2" },
      49: { name: "Palladium", symbol: "Pd"   , color: "#ffb7b7" }, 50: { name: "Silver", symbol: "Ag"   , color: "#ffdada" },
      51: { name: "Cadmium", symbol: "Cd"   , color: "#4ecdc4" }, 52: { name: "Indium", symbol: "In"   , color: "#63d1c9" },
      53: { name: "Tin", symbol: "Sn"   , color: "#77d6ce" }, 54: { name: "Antimony", symbol: "Sb"   , color: "#8bdbc4" },
      55: { name: "Tellurium", symbol: "Te"   , color: "#a0e0ba" }, 56: { name: "Iodine", symbol: "I"    , color: "#45b7d1" },
      57: { name: "Xenon", symbol: "Xe"   , color: "#59bdd5" }, 58: { name: "Caesium", symbol: "Cs"   , color: "#6dc3da" },
      59: { name: "Barium", symbol: "Ba"   , color: "#81c9df" }, 60: { name: "Lanthanum", symbol: "La"   , color: "#96cee5" },
      61: { name: "Cerium", symbol: "Ce"   , color: "#96ceb4" }, 62: { name: "Praseodymium", symbol: "Pr"   , color: "#a3d3bd" },
      63: { name: "Neodymium", symbol: "Nd"   , color: "#b0d8c6" }, 64: { name: "Promethium", symbol: "Pm"   , color: "#bdddd0" },
      65: { name: "Samarium", symbol: "Sm"   , color: "#cae2d9" }, 66: { name: "Europium", symbol: "Eu"   , color: "#feca57" },
      67: { name: "Gadolinium", symbol: "Gd"   , color: "#fed470" }, 68: { name: "Terbium", symbol: "Tb"   , color: "##fedd8a" },
      69: { name: "Dysprosium", symbol: "Dy"   , color: "#fee7a3" }, 70: { name: "Holmium", symbol: "Ho"   , color: "#feefbd" },
      71: { name: "Erbium", symbol: "Er"   , color: "#ff9ff3" }, 72: { name: "Thulium", symbol: "Tm"   , color: "#ffa8f4" },
      73: { name: "Ytterbium", symbol: "Yb"   , color: "#ffb2f6" }, 74: { name: "Lutetium", symbol: "Lu"   , color: "#ffbbf7" },
      75: { name: "Hafnium", symbol: "Hf"   , color: "#ffc5f9" }, 76: { name: "Tantalum", symbol: "Ta"   , color: "#54a0ff" },
      77: { name: "Tungsten", symbol: "W"    , color: "#68a9ff" }, 78: { name: "Rhenium", symbol: "Re"   , color: "#7cb2ff" },
      79: { name: "Osmium", symbol: "Os"   , color: "#90bbff" }, 80: { name: "Iridium", symbol: "Ir"   , color: "#a4c4ff" },
      81: { name: "Platinum", symbol: "Pt"   , color: "#5f27cd" }, 82: { name: "Gold", symbol: "Au"   , color: "#7240d4" },
      83: { name: "Mercury", symbol: "Hg"   , color: "#8559da" }, 84: { name: "Thallium", symbol: "Tl"   , color: "#9872e1" },
      85: { name: "Lead", symbol: "Pb"   , color: "#ab8be7" }, 86: { name: "Bismuth", symbol: "Bi"   , color: "#00d2d3" },
      87: { name: "Polonium", symbol: "Po"   , color: "#19d7d8" }, 88: { name: "Astatine", symbol: "At"   , color: "#32dddd" },
      89: { name: "Radon", symbol: "Rn"   , color: "#4ce2e2" }, 90: { name: "Francium", symbol: "Fr"   , color: "#65e7e7" },
      91: { name: "Radium", symbol: "Ra"   , color: "#ff6b6b" }, 92: { name: "Actinium", symbol: "Ac"   , color: "#ff8c8c" },
      93: { name: "Thorium", symbol: "Th"   , color: "#ffa2a2" }, 94: { name: "Protactinium", symbol: "Pa"   , color: "#ffb7b7" },
      95: { name: "Uranium", symbol: "U"    , color: "#ffdada" }, 96: { name: "Neptunium", symbol: "Np"   , color: "#4ecdc4" },
      97: { name: "Plutonium", symbol: "Pu"   , color: "#63d1c9" }, 98: { name: "Americium", symbol: "Am"   , color: "#77d6ce" },
      99: { name: "Curium", symbol: "Cm"   , color: "#8bdbc4" }, 100: { name: "Berkelium", symbol: "Bk"   , color: "#a0e0ba" }
    },

    // ★ 核融合ルールも100種類に対応！[2]
    fusionRules: [
        {r: [1,1], p: [2], e: 1.1, prob: 0.99, temp: 10},
        ...Array.from({length: 98}, (_, i) => ({
            r: [i + 1, i + 2],
            p: [i + 3],
            e: parseFloat((1.2 + i * 0.2).toFixed(2)),
            prob: parseFloat(Math.max(0.1, 0.98 - i * 0.009).toFixed(2)),
            temp: 12 + i * 3
        }))
    ].flat(),

    config: {
      initialEnergy: 100, heatIncBase: 10, maxTempBase: 200, tempDecay: 0.95, scoreMul: 10,
      tapZone: { energyGain: 1, hChance: 0.3 },
      upgrade: { temp: {level: 0, inc: 50, cost: 100}, heat: {level: 0, inc: 5, cost: 50} }
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

  resetGame(){
    const cfg = this.gameData.config;
    this.gameState.energy = cfg.initialEnergy; this.gameState.score = 0; this.gameState.temp = 0;
    this.gameState.unlocked = [1]; this.gameState.inventory = { 1: 10 }; this.gameState.slots = [null, null];
    cfg.upgrade.temp.level = 0; cfg.upgrade.heat.level = 0;
    this.renderElements(); this.updateDisplay(); this.updateReactionSlots();
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
      if(this.gameData.elements[pid]){ // 存在しない元素は作らない
        this.gameState.inventory[pid]=(this.gameState.inventory[pid]||0)+1;
        if(!this.gameState.unlocked.includes(pid)){
          this.gameState.unlocked.push(pid);
          this.toast(`新元素 ${this.gameData.elements[pid].symbol} 解放！`);
        }
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
      this.eqDisp.textContent = `${this.gameData.elements[a].symbol} + ${this.gameData.elements[b].symbol} → ${rule.p.map(id=>this.gameData.elements[id] ? this.gameData.elements[id].symbol : '?').join(' + ')}`;
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
    document.getElementById('result-elements').textContent=rule.p.map(id=>this.gameData.elements[id] ? this.gameData.elements[id].symbol : '???').join(' + ');
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
