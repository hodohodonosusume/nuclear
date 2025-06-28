/* ===================================================================
   Nuclear Fusion Puzzle – tap-zone edition (2025-06-28)
   ・タップゾーンでエネルギー + 水素ドロップ
   ・アップグレード／核融合ロジックは前回版を継承
   ・広告／課金用のフックをコメントで用意
=================================================================== */
class FusionGame {

  /* ---------- ゲームデータ ---------- */
  gameData = {

    /* 元素 */
    elements:{
      1:{name:'Hydrogen',  symbol:'H',   color:'#ff6b6b', rarity:'common',    description:'最も軽い元素'},
      2:{name:'Deuterium', symbol:'²H',  color:'#4ecdc4', rarity:'uncommon',  description:'重水素'},
      3:{name:'Tritium',   symbol:'³H',  color:'#45b7d1', rarity:'rare',      description:'三重水素'},
      4:{name:'Helium-3',  symbol:'³He', color:'#96ceb4', rarity:'very_rare', description:'ヘリウム-3'},
      5:{name:'Helium-4',  symbol:'⁴He', color:'#feca57', rarity:'common',    description:'安定α粒子'},
      6:{name:'Lithium-6', symbol:'⁶Li', color:'#ff9ff3', rarity:'uncommon',  description:'リチウム-6'},
      7:{name:'Beryllium', symbol:'Be',  color:'#54a0ff', rarity:'rare',      description:'ベリリウム'},
      8:{name:'Boron',     symbol:'B',   color:'#5f27cd', rarity:'uncommon',  description:'ホウ素'},
      9:{name:'Carbon',    symbol:'C',   color:'#00d2d3', rarity:'common',    description:'炭素'}
    },

    /* 核融合ルール */
    fusionRules:[
      {reactants:[1,1], products:[2], energy:1.4, probability:0.20, tempReq:10 },
      {reactants:[1,2], products:[4], energy:5.5, probability:0.45, tempReq:50 },
      {reactants:[2,4], products:[5], energy:8.0, probability:0.55, tempReq:80 },
      {reactants:[5,2], products:[6], energy:5.0, probability:0.50, tempReq:90 },
      {reactants:[6,1], products:[7], energy:8.0, probability:0.45, tempReq:110},
      {reactants:[7,1], products:[8], energy:10,  probability:0.40, tempReq:130},
      {reactants:[8,1], products:[9], energy:12,  probability:0.35, tempReq:150}
    ],

    /* 各種設定 */
    config:{
      initialEnergy     :100,
      heatIncrementBase :10,
      maxTempBase       :200,
      tempDecayRate     :0.95,
      scoreMul          :10,

      /* タップゾーン */
      tapZone:{
        energyGain :1,    // 1タップで得られるエネルギー
        hChance    :0.30  // Hドロップ確率
      },

      /* アップグレード */
      upgrade:{
        temp:{level:0, inc:50, baseCost:100},
        heat:{level:0, inc: 5, baseCost: 50}
      }
    }
  };

  /* ---------- 状態 ---------- */
  gameState={
    energy:0, score:0, temperature:0,
    unlocked:[1], inventory:{1:10},
    reactionSlots:[null,null]
  };

  /* ---------- 初期化 ---------- */
  constructor(){ document.addEventListener('DOMContentLoaded',()=>this.init()); }

  init(){
    this.cacheDom();
    this.bindEvents();
    this.resetState();
    this.renderElements();
    this.updateDisplay();
    this.loopParticles();
  }

  /* DOM */
  cacheDom(){
    /* 主要ノード */
    this.canvas=document.getElementById('particle-canvas');
    this.ctx   =this.canvas.getContext('2d');
    this.grid  =document.getElementById('element-grid');

    /* ボタン */
    this.heatBtn =document.getElementById('heat-button');
    this.fuseBtn =document.getElementById('fuse-button');
    this.clearBtn=document.getElementById('clear-button');
    this.upTempBtn=document.getElementById('upgrade-temp-button');
    this.upHeatBtn=document.getElementById('upgrade-heat-button');
    this.tapZone=document.getElementById('tap-zone');

    /* 表示 */
    this.energyDisp=document.getElementById('energy-display');
    this.tempDisp  =document.getElementById('temperature-display');
    this.scoreDisp =document.getElementById('score-display');
    this.eqDisp    =document.getElementById('reaction-equation');
    this.enDisp    =document.getElementById('reaction-energy');
    this.tempGauge =document.getElementById('temperature-gauge-fill');

    /* 画面遷移 */
    document.getElementById('start-game')
            .addEventListener('click',()=>{
              document.getElementById('startup-screen').classList.remove('active');
              document.getElementById('game-screen'  ).classList.add   ('active');
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

    /* ★ タップゾーン */
    this.tapZone.addEventListener('click',()=>this.handleTapZone());

    /* 温度自然減衰 */
    setInterval(()=>this.decayTemperature(),1000);

    /* モーダル */
    document.getElementById('continue-button')
            .addEventListener('click',()=>document.getElementById('result-modal').classList.remove('active'));
  }

  /* ======= タップゾーン処理 ======= */
  handleTapZone(){
    const tapCfg=this.gameData.config.tapZone;

    /* エネルギー付与 */
    this.gameState.energy += tapCfg.energyGain;
    /* 一定確率で水素ドロップ */
    if(Math.random()<tapCfg.hChance){
      this.gameState.inventory[1]=(this.gameState.inventory[1]||0)+1;
      this.toast('H をゲット！');
      this.renderElements();
    }
    /* 成長用の広告／課金フック
       if(adWatched){ giveBonus(); }
       if(iapPurchased){ hugeEnergy(); } */

    this.updateDisplay();
    this.createTapParticles();
  }

  /* ======= 表示 ======= */
  updateDisplay(){
    this.energyDisp.textContent=Math.floor(this.gameState.energy);
    this.tempDisp  .textContent=Math.floor(this.gameState.temperature);
    this.scoreDisp .textContent=this.gameState.score;

    const ratio=(this.gameState.temperature/this.maxTemperature)*100;
    this.tempGauge.style.width=`${Math.min(ratio,100)}%`;

    /* アップグレードコスト更新 */
    const uT=this.gameData.config.upgrade.temp;
    const uH=this.gameData.config.upgrade.heat;
    document.getElementById('upgrade-temp-cost').textContent=uT.baseCost*(uT.level+1);
    document.getElementById('upgrade-heat-cost').textContent=uH.baseCost*(uH.level+1);
  }

  /* ======= アップグレード ======= */
  buyUpgrade(type){
    const up=this.gameData.config.upgrade[type];
    const cost=up.baseCost*(up.level+1);
    if(this.gameState.energy<cost){this.toast('エネルギー不足');return;}
    up.level++; this.gameState.energy-=cost;
    this.toast(type==='temp'?'最大温度を強化！':'加熱量を強化！');
    this.updateDisplay();
  }

  /* ======= 温度操作 ======= */
  get maxTemperature(){
    const {maxTempBase,upgrade:{temp}}=this.gameData.config;
    return maxTempBase+temp.level*temp.inc;
  }
  get heatIncrement(){
    const {heatIncrementBase,upgrade:{heat}}=this.gameData.config;
    return heatIncrementBase+heat.level*heat.inc;
  }

  increaseTemperature(){
    if(this.gameState.energy<=0){this.toast('エネルギー不足');return;}
    this.gameState.temperature=Math.min(
      this.gameState.temperature+this.heatIncrement,
      this.maxTemperature
    );
    this.gameState.energy--;
    this.updateDisplay();
    this.checkReactionPossibility();
  }
  decayTemperature(){
    if(this.gameState.temperature>0){
      this.gameState.temperature*=this.gameData.config.tempDecayRate;
      if(this.gameState.temperature<1)this.gameState.temperature=0;
      this.updateDisplay();
      this.checkReactionPossibility();
    }
  }

  /* ======= 核融合 ======= */
  attemptFusion(){
    const [a,b]=this.gameState.reactionSlots;
    if(!a||!b){this.toast('2つ置いてね');return;}

    const rule=this.findFusionRule(a,b);
    if(!rule){this.toast('反応しない組み合わせ');return;}

    if(this.gameState.temperature<rule.tempReq){
      this.toast(`${rule.tempReq}M°C 以上必要`);
      return;
    }

    const success=Math.random()<Math.min(
      rule.probability*(this.gameState.temperature/rule.tempReq),
      0.95
    );

    if(success){this.handleFusionSuccess(rule,a,b);}
    else{
      this.toast('核融合失敗…');
      this.consumeReactants(a,b);
      this.clearReaction();
      this.renderElements();
    }
    this.updateDisplay();
  }

  handleFusionSuccess(rule,a,b){
    rule.products.forEach(pid=>{
      this.gameState.inventory[pid]=(this.gameState.inventory[pid]||0)+1;
      if(!this.gameState.unlocked.includes(pid)){
        this.gameState.unlocked.push(pid);
        this.toast(`新元素 ${this.gameData.elements[pid].symbol} 解放！`);
      }
    });

    this.gameState.energy+=rule.energy;
    this.gameState.score +=Math.floor(rule.energy*this.gameData.config.scoreMul);

    this.consumeReactants(a,b);

    this.showResultModal(rule);
    this.createFusionParticles();

    this.gameState.reactionSlots=[null,null];
    this.updateReactionSlots();
    this.renderElements();
    this.checkReactionPossibility();
  }

  consumeReactants(x,y){
    [x,y].forEach(id=>{
      this.gameState.inventory[id]--;
      if(this.gameState.inventory[id]<=0)delete this.gameState.inventory[id];
    });
  }

  clearReaction(){
    this.gameState.reactionSlots.forEach(id=>{
      if(id){
        this.gameState.inventory[id]=(this.gameState.inventory[id]||0)+1;
      }
    });
    this.gameState.reactionSlots=[null,null];
    this.updateReactionSlots();
    this.renderElements();
  }

  /* ======= ルール検索 ======= */
  findFusionRule(x,y){
    return this.gameData.fusionRules.find(r=>{
      const [p,q]=r.reactants;
      return (p===x&&q===y)||(p===y&&q===x);
    });
  }

  /* ======= 反応スロット表示 ======= */
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

  /* ======= 反応可否表示 ======= */
  checkReactionPossibility(){
    const [a,b]=this.gameState.reactionSlots;
    if(!a||!b){
      this.eqDisp.textContent='元素を2つ配置してね';
      this.enDisp.textContent=''; this.fuseBtn.disabled=true; return;
    }
    const rule=this.findFusionRule(a,b);
    if(rule){
      this.eqDisp.textContent=
        `${this.gameData.elements[a].symbol} + ${this.gameData.elements[b].symbol} → ${rule.products.map(id=>this.gameData.elements[id].symbol).join(' + ')}`;
      this.enDisp.textContent=`+${rule.energy} MeV`;
      this.fuseBtn.disabled=this.gameState.temperature<rule.tempReq;
    }else{
      this.eqDisp.textContent='未知の反応';
      this.enDisp.textContent=''; this.fuseBtn.disabled=true;
    }
  }

  /* ======= モーダル ======= */
  showResultModal(rule){
    document.getElementById('result-title').textContent='核融合成功！';
    document.getElementById('result-elements').textContent=
      rule.products.map(id=>this.gameData.elements[id].symbol).join(' + ');
    document.getElementById('result-energy').textContent=`+${rule.energy} MeV`;
    document.getElementById('result-modal').classList.add('active');
  }

  /* ======= トースト ======= */
  toast(msg){
    const t=document.createElement('div');
    t.textContent=msg;
    t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);'+
                    'background:#c0142f;color:#fff;padding:10px 20px;border-radius:8px;z-index:1001;';
    document.body.appendChild(t); setTimeout(()=>t.remove(),2500);
  }

  /* ======= パーティクル ======= */
  resizeCanvas(){ this.canvas.width=innerWidth; this.canvas.height=innerHeight; }
  particles=[];
  createFusionParticles(){ this.spawnParticles('#4ecdc4'); }
  createTapParticles   (){ this.spawnParticles('#feca57',15); }

  spawnParticles(color,count=30){
    const cx=innerWidth/2, cy=innerHeight/2;
    for(let i=0;i<count;i++){
      this.particles.push({
        x:cx,y:cy, vx:(Math.random()-0.5)*10, vy:(Math.random()-0.5)*10,
        life:1,decay:0.02,size:Math.random()*3+1,color
      });
    }
  }
  updateParticles(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i];
      p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if(p.life<=0){this.particles.splice(i,1);continue;}
      this.ctx.globalAlpha=p.life;
      this.ctx.fillStyle=p.color;
      this.ctx.beginPath();this.ctx.arc(p.x,p.y,p.size,0,Math.PI*2);this.ctx.fill();
    }
    this.ctx.globalAlpha=1;
  }
  loopParticles(){ const loop=()=>{this.updateParticles();requestAnimationFrame(loop);};loop(); }

  /* ======= 状態初期化 ======= */
  resetState(){
    const cfg=this.gameData.config;
    cfg.upgrade.temp.level=0; cfg.upgrade.heat.level=0;

    this.gameState.energy=cfg.initialEnergy;
    this.gameState.score =0;
    this.gameState.temperature=0;
  }
}

/* ---------- 起動 ---------- */
new FusionGame();
