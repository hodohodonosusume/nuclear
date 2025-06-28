/* ===================================================================
   Nuclear Fusion Puzzle – 2025-06-28 full rev.
   ・成功直後でも新元素が即選択可
   ・新しい融合ルートを追加してゲームが止まらない
   ・エネルギーを使うアップグレード（最大温度 & 加熱量）
   ・温度依存成功率（上限95%）
=================================================================== */
class FusionGame {
  /* ---------- 基本データ ---------- */
  gameData = {
    /* 元素定義 */
    elements: {
      1: {name:'Hydrogen',   symbol:'H',   color:'#ff6b6b', rarity:'common',    description:'最も軽い元素'},
      2: {name:'Deuterium',  symbol:'²H',  color:'#4ecdc4', rarity:'uncommon',  description:'重水素'},
      3: {name:'Tritium',    symbol:'³H',  color:'#45b7d1', rarity:'rare',      description:'三重水素'},
      4: {name:'Helium-3',   symbol:'³He', color:'#96ceb4', rarity:'very_rare', description:'ヘリウム-3'},
      5: {name:'Helium-4',   symbol:'⁴He', color:'#feca57', rarity:'common',    description:'安定α粒子'},
      6: {name:'Lithium-6',  symbol:'⁶Li', color:'#ff9ff3', rarity:'uncommon',  description:'リチウム-6'},
      7: {name:'Beryllium',  symbol:'Be',  color:'#54a0ff', rarity:'rare',      description:'ベリリウム'},
      8: {name:'Boron',      symbol:'B',   color:'#5f27cd', rarity:'uncommon',  description:'ホウ素'},
      9: {name:'Carbon',     symbol:'C',   color:'#00d2d3', rarity:'common',    description:'炭素'}
    },

    /* 核融合ルール */
    fusionRules: [
      /* 基本鎖 */
      {reactants:[1,1], products:[2],    energy: 1.4, probability:0.20, tempReq:10 },
      {reactants:[1,2], products:[4],    energy: 5.5, probability:0.45, tempReq:50 },
      {reactants:[2,4], products:[5],    energy: 8.0, probability:0.55, tempReq:80 },
      /* 拡張ルート */
      {reactants:[5,2], products:[6],    energy: 5.0, probability:0.50, tempReq:90 },
      {reactants:[6,1], products:[7],    energy: 8.0, probability:0.45, tempReq:110},
      {reactants:[7,1], products:[8],    energy:10.0, probability:0.40, tempReq:130},
      {reactants:[8,1], products:[9],    energy:12.0, probability:0.35, tempReq:150}
    ],

    /* 設定値 */
    config: {
      initialEnergy     : 100,
      heatIncrementBase : 10,  // クリックあたり増分(初期)
      maxTempBase       : 200, // 最大温度(初期)
      tempDecayRate     : 0.95,
      scoreMul          : 10,
      /* アップグレード設定 */
      upgrade: {
        temp: { level:0, inc:50, baseCost:100 },
        heat: { level:0, inc: 5, baseCost: 50 }
      }
    }
  };

  /* ---------- ランタイム状態 ---------- */
  gameState = {
    energy : 0,
    score  : 0,
    temperature : 0,
    unlocked : [1],         // 解放済み元素 ID
    inventory : {1:10},     // 所持数
    reactionSlots : [null,null]
  };

  /* ---------- 構築 ---------- */
  constructor(){
    document.addEventListener('DOMContentLoaded',()=>this.init());
  }

  /* ================== 初期化 ================== */
  init(){
    this.cacheDom();
    this.bindEvents();
    this.resetState();
    this.renderElements();
    this.updateDisplay();
    this.loopParticles();
  }

  /* DOM取得 */
  cacheDom(){
    this.canvas   = document.getElementById('particle-canvas');
    this.ctx      = this.canvas.getContext('2d');
    this.grid     = document.getElementById('element-grid');
    /* ボタン類 */
    this.heatBtn      = document.getElementById('heat-button');
    this.fuseBtn      = document.getElementById('fuse-button');
    this.clearBtn     = document.getElementById('clear-button');
    this.upTempBtn    = document.getElementById('upgrade-temp-button');
    this.upHeatBtn    = document.getElementById('upgrade-heat-button');
    /* 表示 */
    this.energyDisp   = document.getElementById('energy-display');
    this.tempDisp     = document.getElementById('temperature-display');
    this.scoreDisp    = document.getElementById('score-display');
    this.eqDisp       = document.getElementById('reaction-equation');
    this.enDisp       = document.getElementById('reaction-energy');
    this.tempGauge    = document.getElementById('temperature-gauge-fill');
    /* 画面遷移ボタン */
    document.getElementById('start-game').addEventListener('click',()=>{
      document.getElementById('startup-screen').classList.remove('active');
      document.getElementById('game-screen').classList.add('active');
    });
  }

  /* イベント */
  bindEvents(){
    window.addEventListener('resize',()=>this.resizeCanvas());
    this.resizeCanvas();

    this.heatBtn .addEventListener('click',()=>this.increaseTemperature());
    this.fuseBtn .addEventListener('click',()=>this.attemptFusion());
    this.clearBtn.addEventListener('click',()=>this.clearReaction());

    this.upTempBtn.addEventListener('click',()=>this.buyUpgrade('temp'));
    this.upHeatBtn.addEventListener('click',()=>this.buyUpgrade('heat'));

    /* 温度自然減衰 */
    setInterval(()=>this.decayTemperature(),1000);

    /* モーダル */
    document.getElementById('continue-button')
            .addEventListener('click',()=>document.getElementById('result-modal').classList.remove('active'));
  }

  /* 状態リセット */
  resetState(){
    this.gameState.energy      = this.gameData.config.initialEnergy;
    this.gameState.temperature = 0;
    this.gameState.score       = 0;
    /* アップグレードもリセット */
    this.gameData.config.upgrade.temp.level = 0;
    this.gameData.config.upgrade.heat.level = 0;
  }

  /* ================== 元素パレット ================== */
  renderElements(){
    this.grid.innerHTML = '';
    Object.entries(this.gameData.elements).forEach(([id, el])=>{
      const unlocked = this.gameState.unlocked.includes(+id);
      const count    = this.gameState.inventory[id] || 0;

      const btn=document.createElement('div');
      btn.className = `element-button rarity-${el.rarity}` + (unlocked?'':' locked');
      btn.style.backgroundColor = el.color;
      btn.innerHTML =
        `<div class="element-symbol">${el.symbol}</div><div class="element-count">${count}</div>`;

      if(unlocked){
        btn.addEventListener('click',()=>this.selectElement(+id));
        btn.title = `${el.name} (所持: ${count})`;
      }else{
        btn.title = `${el.name} (Locked)`;
      }
      this.grid.appendChild(btn);
    });
  }

  /* 元素選択 → スロットへ格納 */
  selectElement(id){
    const cnt = this.gameState.inventory[id]||0;
    if(cnt<=0){ this.toast('在庫がありません'); return; }

    const slotIdx = this.gameState.reactionSlots.indexOf(null);
    if(slotIdx===-1){ this.toast('スロットが満杯よ'); return; }

    this.gameState.reactionSlots[slotIdx]=id;
    this.gameState.inventory[id]--;
    this.updateReactionSlots();
    this.renderElements();
    this.updateDisplay();
    this.checkReactionPossibility();
  }

  /* スロット表示 */
  updateReactionSlots(){
    this.gameState.reactionSlots.forEach((id,i)=>{
      const slot=document.getElementById(`slot-${i+1}`);
      if(id){
        slot.textContent=this.gameData.elements[id].symbol;
        slot.classList.add('filled');
      }else{
        slot.textContent='';
        slot.classList.remove('filled');
      }
    });
  }

  /* ================== 温度操作 ================== */
  get maxTemperature(){
    const {maxTempBase,upgrade:{temp}} = this.gameData.config;
    return maxTempBase + temp.level*temp.inc;
  }
  get heatIncrement(){
    const {heatIncrementBase,upgrade:{heat}} = this.gameData.config;
    return heatIncrementBase + heat.level*heat.inc;
  }

  increaseTemperature(){
    if(this.gameState.energy<=0){ this.toast('エネルギー不足'); return; }
    this.gameState.temperature = Math.min(
      this.gameState.temperature + this.heatIncrement,
      this.maxTemperature
    );
    this.gameState.energy--;
    this.updateDisplay();
    this.checkReactionPossibility();
  }
  decayTemperature(){
    if(this.gameState.temperature>0){
      this.gameState.temperature*=this.gameData.config.tempDecayRate;
      if(this.gameState.temperature<1) this.gameState.temperature=0;
      this.updateDisplay();
      this.checkReactionPossibility();
    }
  }

  /* ================== 核融合処理 ================== */
  attemptFusion(){
    const [a,b] = this.gameState.reactionSlots;
    if(!a||!b){ this.toast('元素を2つセットしてね'); return; }

    const rule = this.findFusionRule(a,b);
    if(!rule){ this.toast('その組み合わせでは反応しないわ'); return; }

    if(this.gameState.temperature < rule.tempReq){
      this.toast(`${rule.tempReq}M°C 以上にしてね`);
      return;
    }

    const ratio = this.gameState.temperature / rule.tempReq;
    const successChance = Math.min(rule.probability * ratio, 0.95);
    const isSuccess = Math.random() < successChance;

    if(isSuccess){
      this.handleFusionSuccess(rule,a,b);
    }else{
      this.toast('核融合失敗…');
      this.consumeReactants(a,b);
      this.clearReaction();
      this.renderElements();
    }
    this.updateDisplay();
  }

  handleFusionSuccess(rule,a,b){
    /* 生成物付与＋アンロック */
    rule.products.forEach(pid=>{
      this.gameState.inventory[pid]=(this.gameState.inventory[pid]||0)+1;
      if(!this.gameState.unlocked.includes(pid)){
        this.gameState.unlocked.push(pid);
        this.toast(`新元素 ${this.gameData.elements[pid].symbol} 解放！`);
      }
    });

    /* エネルギー&スコア */
    this.gameState.energy += rule.energy;
    this.gameState.score  += Math.floor(rule.energy * this.gameData.config.scoreMul);

    /* 反応物消費 */
    this.consumeReactants(a,b);

    /* 成功演出 */
    this.showResultModal(rule);
    this.createFusionParticles();

    /* スロット & UI リセット */
    this.gameState.reactionSlots = [null,null];
    this.updateReactionSlots();
    this.renderElements();
    this.checkReactionPossibility();
  }

  consumeReactants(x,y){
    [x,y].forEach(id=>{
      this.gameState.inventory[id]--;
      if(this.gameState.inventory[id]<=0) delete this.gameState.inventory[id];
    });
  }

  clearReaction(){
    /* スロットに残った元素を戻す */
    this.gameState.reactionSlots.forEach(id=>{
      if(id){
        this.gameState.inventory[id]=(this.gameState.inventory[id]||0)+1;
      }
    });
    this.gameState.reactionSlots=[null,null];
    this.updateReactionSlots();
    this.renderElements();
    this.checkReactionPossibility();
  }

  /* ルール検索 */
  findFusionRule(x,y){
    return this.gameData.fusionRules.find(r=>{
      const [a,b]=r.reactants;
      return (a===x&&b===y)||(a===y&&b===x);
    });
  }

  /* 反応可能かチェック → 方程式表示・ボタン活性 */
  checkReactionPossibility(){
    const [a,b]=this.gameState.reactionSlots;
    if(!a||!b){
      this.eqDisp.textContent='元素を2つ配置してね';
      this.enDisp.textContent='';
      this.fuseBtn.disabled=true;
      return;
    }
    const rule=this.findFusionRule(a,b);
    if(rule){
      this.eqDisp.textContent=
        `${this.gameData.elements[a].symbol} + ${this.gameData.elements[b].symbol} → ${rule.products.map(id=>this.gameData.elements[id].symbol).join(' + ')}`;
      this.enDisp.textContent=`+${rule.energy} MeV`;
      this.fuseBtn.disabled = this.gameState.temperature < rule.tempReq;
    }else{
      this.eqDisp.textContent='未知の反応';
      this.enDisp.textContent='';
      this.fuseBtn.disabled=true;
    }
  }

  /* ================== アップグレード ================== */
  buyUpgrade(type){
    const up = this.gameData.config.upgrade[type];
    const cost = up.baseCost * (up.level+1);
    if(this.gameState.energy < cost){ this.toast('エネルギーが足りない'); return; }

    up.level++;
    this.gameState.energy -= cost;
    this.toast(`${type==='temp'?'最大温度':'加熱量'} をアップグレード！`);
    this.updateDisplay();
  }

  /* ================== 表示更新 ================== */
  updateDisplay(){
    this.energyDisp.textContent = Math.floor(this.gameState.energy);
    this.tempDisp  .textContent = Math.floor(this.gameState.temperature);
    this.scoreDisp .textContent = this.gameState.score;

    /* 温度ゲージ */
    const gaugeRatio = (this.gameState.temperature/this.maxTemperature)*100;
    this.tempGauge.style.width = `${Math.min(gaugeRatio,100)}%`;

    /* アップグレードボタン表示 */
    const uT = this.gameData.config.upgrade.temp;
    const uH = this.gameData.config.upgrade.heat;
    document.getElementById('upgrade-temp-cost').textContent = uT.baseCost*(uT.level+1);
    document.getElementById('upgrade-heat-cost').textContent = uH.baseCost*(uH.level+1);
  }

  /* ================== 成功モーダル ================== */
  showResultModal(rule){
    document.getElementById('result-title').textContent='核融合成功！';
    document.getElementById('result-elements').textContent=
      rule.products.map(id=>this.gameData.elements[id].symbol).join(' + ');
    document.getElementById('result-energy').textContent=`+${rule.energy} MeV`;
    document.getElementById('result-modal').classList.add('active');
  }

  /* ================== トースト ================== */
  toast(msg){
    const t=document.createElement('div');
    t.textContent=msg;
    t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);'+
                    'background:#c0142f;color:#fff;padding:10px 20px;border-radius:8px;z-index:1001;';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2500);
  }

  /* ================== Canvas パーティクル ================== */
  resizeCanvas(){
    this.canvas.width = innerWidth;
    this.canvas.height= innerHeight;
  }
  particles=[];
  createFusionParticles(){
    const centerX = innerWidth/2;
    const centerY = innerHeight/2;
    for(let i=0;i<30;i++){
      this.particles.push({
        x:centerX,y:centerY,
        vx:(Math.random()-0.5)*10,
        vy:(Math.random()-0.5)*10,
        life:1, decay:0.02,
        size:Math.random()*3+1,
        color:'#4ecdc4'
      });
    }
  }
  updateParticles(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i];
      p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if(p.life<=0){ this.particles.splice(i,1); continue; }
      this.ctx.globalAlpha=p.life;
      this.ctx.fillStyle=p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha=1;
  }
  loopParticles(){
    const loop=()=>{ this.updateParticles(); requestAnimationFrame(loop); };
    loop();
  }
}

/* ================== 起動 ================== */
new FusionGame();
