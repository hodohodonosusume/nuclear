/* ===================================================================
   Nuclear Fusion Puzzle – "Genesis Edition" (100 Elements)
   ・実際の恒星内元素合成プロセスに基づく100種類の元素
   ・PP連鎖、CNOサイクル、トリプルアルファ、アルファプロセス対応
   ・科学的に正確な核融合チェーン
=================================================================== */
class FusionGame {

  // 100種類の元素データ（実際の核融合プロセスに基づく）
  gameData = {
    elements: {
      // PP連鎖反応（水素燃焼）
      1: {name:"Hydrogen", symbol:"H", color:"#ff6b6b"},
      2: {name:"Deuterium", symbol:"²H", color:"#ff8c8c"},
      3: {name:"Tritium", symbol:"³H", color:"#ffa2a2"},
      4: {name:"Helium-3", symbol:"³He", color:"#ffb7b7"},
      5: {name:"Helium-4", symbol:"⁴He", color:"#ffdada"},

      // リチウム・ベリリウム（PP連鎖分岐）
      6: {name:"Lithium-6", symbol:"⁶Li", color:"#4ecdc4"},
      7: {name:"Lithium-7", symbol:"⁷Li", color:"#63d1c9"},
      8: {name:"Beryllium-7", symbol:"⁷Be", color:"#77d6ce"},
      9: {name:"Beryllium-8", symbol:"⁸Be", color:"#8bdbc4"},

      // ホウ素（CNOサイクル関連）
      10: {name:"Boron-8", symbol:"⁸B", color:"#a0e0ba"},
      11: {name:"Boron-10", symbol:"¹⁰B", color:"#b5e6c7"},
      12: {name:"Boron-11", symbol:"¹¹B", color:"#caecd4"},

      // 炭素（トリプルアルファプロセス）
      13: {name:"Carbon-12", symbol:"¹²C", color:"#45b7d1"},
      14: {name:"Carbon-13", symbol:"¹³C", color:"#59bdd5"},

      // 窒素（CNOサイクル）
      15: {name:"Nitrogen-13", symbol:"¹³N", color:"#6dc3da"},
      16: {name:"Nitrogen-14", symbol:"¹⁴N", color:"#81c9df"},
      17: {name:"Nitrogen-15", symbol:"¹⁵N", color:"#96cee5"},

      // 酸素（アルファプロセス開始）
      18: {name:"Oxygen-15", symbol:"¹⁵O", color:"#96ceb4"},
      19: {name:"Oxygen-16", symbol:"¹⁶O", color:"#a3d3bd"},
      20: {name:"Oxygen-17", symbol:"¹⁷O", color:"#b0d8c6"},
      21: {name:"Oxygen-18", symbol:"¹⁸O", color:"#bdddd0"},

      // フッ素
      22: {name:"Fluorine-17", symbol:"¹⁷F", color:"#cae2d9"},
      23: {name:"Fluorine-18", symbol:"¹⁸F", color:"#d7e7e2"},
      24: {name:"Fluorine-19", symbol:"¹⁹F", color:"#e4eceb"},

      // ネオン（アルファプロセス）
      25: {name:"Neon-20", symbol:"²⁰Ne", color:"#feca57"},
      26: {name:"Neon-21", symbol:"²¹Ne", color:"#fed470"},
      27: {name:"Neon-22", symbol:"²²Ne", color:"#fedd8a"},

      // ナトリウム
      28: {name:"Sodium-22", symbol:"²²Na", color:"#fee7a3"},
      29: {name:"Sodium-23", symbol:"²³Na", color:"#feefbd"},

      // マグネシウム（ネオン燃焼）
      30: {name:"Magnesium-24", symbol:"²⁴Mg", color:"#ff9ff3"},
      31: {name:"Magnesium-25", symbol:"²⁵Mg", color:"#ffa8f4"},
      32: {name:"Magnesium-26", symbol:"²⁶Mg", color:"#ffb2f6"},

      // アルミニウム
      33: {name:"Aluminum-26", symbol:"²⁶Al", color:"#ffbbf7"},
      34: {name:"Aluminum-27", symbol:"²⁷Al", color:"#ffc5f9"},

      // ケイ素（マグネシウム燃焼）
      35: {name:"Silicon-28", symbol:"²⁸Si", color:"#54a0ff"},
      36: {name:"Silicon-29", symbol:"²⁹Si", color:"#68a9ff"},
      37: {name:"Silicon-30", symbol:"³⁰Si", color:"#7cb2ff"},

      // リン
      38: {name:"Phosphorus-30", symbol:"³⁰P", color:"#90bbff"},
      39: {name:"Phosphorus-31", symbol:"³¹P", color:"#a4c4ff"},

      // 硫黄（ケイ素燃焼）
      40: {name:"Sulfur-32", symbol:"³²S", color:"#5f27cd"},
      41: {name:"Sulfur-33", symbol:"³³S", color:"#7240d4"},
      42: {name:"Sulfur-34", symbol:"³⁴S", color:"#8559da"},
      43: {name:"Sulfur-36", symbol:"³⁶S", color:"#9872e1"},

      // 塩素
      44: {name:"Chlorine-35", symbol:"³⁵Cl", color:"#ab8be7"},
      45: {name:"Chlorine-37", symbol:"³⁷Cl", color:"#beafed"},

      // アルゴン（アルファプロセス）
      46: {name:"Argon-36", symbol:"³⁶Ar", color:"#00d2d3"},
      47: {name:"Argon-38", symbol:"³⁸Ar", color:"#19d7d8"},
      48: {name:"Argon-40", symbol:"⁴⁰Ar", color:"#32dddd"},

      // カリウム
      49: {name:"Potassium-39", symbol:"³⁹K", color:"#4ce2e2"},
      50: {name:"Potassium-40", symbol:"⁴⁰K", color:"#65e7e7"},
      51: {name:"Potassium-41", symbol:"⁴¹K", color:"#7eece7"},

      // カルシウム（アルファプロセス）
      52: {name:"Calcium-40", symbol:"⁴⁰Ca", color:"#ff6b6b"},
      53: {name:"Calcium-42", symbol:"⁴²Ca", color:"#ff8c8c"},
      54: {name:"Calcium-44", symbol:"⁴⁴Ca", color:"#ffa2a2"},

      // スカンジウム
      55: {name:"Scandium-45", symbol:"⁴⁵Sc", color:"#ffb7b7"},

      // チタン（アルファプロセス）
      56: {name:"Titanium-44", symbol:"⁴⁴Ti", color:"#ffdada"},
      57: {name:"Titanium-46", symbol:"⁴⁶Ti", color:"#ffe5e5"},
      58: {name:"Titanium-48", symbol:"⁴⁸Ti", color:"#fff0f0"},

      // バナジウム～鉄（アルファプロセス終点）
      59: {name:"Vanadium-48", symbol:"⁴⁸V", color:"#4ecdc4"},
      60: {name:"Vanadium-50", symbol:"⁵⁰V", color:"#63d1c9"},
      61: {name:"Vanadium-51", symbol:"⁵¹V", color:"#77d6ce"},
      62: {name:"Chromium-48", symbol:"⁴⁸Cr", color:"#8bdbc4"},
      63: {name:"Chromium-50", symbol:"⁵⁰Cr", color:"#a0e0ba"},
      64: {name:"Chromium-52", symbol:"⁵²Cr", color:"#b5e6c7"},
      65: {name:"Manganese-52", symbol:"⁵²Mn", color:"#caecd4"},
      66: {name:"Manganese-55", symbol:"⁵⁵Mn", color:"#dff2e1"},
      67: {name:"Iron-52", symbol:"⁵²Fe", color:"#45b7d1"},
      68: {name:"Iron-54", symbol:"⁵⁴Fe", color:"#59bdd5"},
      69: {name:"Iron-56", symbol:"⁵⁶Fe", color:"#6dc3da"},
      70: {name:"Iron-57", symbol:"⁵⁷Fe", color:"#81c9df"},
      71: {name:"Iron-58", symbol:"⁵⁸Fe", color:"#96cee5"},

      // コバルト・ニッケル（鉄族）
      72: {name:"Cobalt-55", symbol:"⁵⁵Co", color:"#96ceb4"},
      73: {name:"Cobalt-56", symbol:"⁵⁶Co", color:"#a3d3bd"},
      74: {name:"Cobalt-57", symbol:"⁵⁷Co", color:"#b0d8c6"},
      75: {name:"Cobalt-59", symbol:"⁵⁹Co", color:"#bdddd0"},
      76: {name:"Nickel-56", symbol:"⁵⁶Ni", color:"#cae2d9"},
      77: {name:"Nickel-58", symbol:"⁵⁸Ni", color:"#d7e7e2"},
      78: {name:"Nickel-60", symbol:"⁶⁰Ni", color:"#e4eceb"},
      79: {name:"Nickel-62", symbol:"⁶²Ni", color:"#f1f1f1"},

      // s-プロセス元素（銅～クリプトン）
      80: {name:"Copper-63", symbol:"⁶³Cu", color:"#feca57"},
      81: {name:"Copper-65", symbol:"⁶⁵Cu", color:"#fed470"},
      82: {name:"Zinc-64", symbol:"⁶⁴Zn", color:"#fedd8a"},
      83: {name:"Zinc-66", symbol:"⁶⁶Zn", color:"#fee7a3"},
      84: {name:"Zinc-67", symbol:"⁶⁷Zn", color:"#feefbd"},
      85: {name:"Gallium-69", symbol:"⁶⁹Ga", color:"#ff9ff3"},
      86: {name:"Gallium-71", symbol:"⁷¹Ga", color:"#ffa8f4"},
      87: {name:"Germanium-70", symbol:"⁷⁰Ge", color:"#ffb2f6"},
      88: {name:"Germanium-72", symbol:"⁷²Ge", color:"#ffbbf7"},
      89: {name:"Germanium-74", symbol:"⁷⁴Ge", color:"#ffc5f9"},
      90: {name:"Arsenic-75", symbol:"⁷⁵As", color:"#54a0ff"},
      91: {name:"Selenium-76", symbol:"⁷⁶Se", color:"#68a9ff"},
      92: {name:"Selenium-78", symbol:"⁷⁸Se", color:"#7cb2ff"},
      93: {name:"Selenium-80", symbol:"⁸⁰Se", color:"#90bbff"},
      94: {name:"Selenium-82", symbol:"⁸²Se", color:"#a4c4ff"},
      95: {name:"Bromine-79", symbol:"⁷⁹Br", color:"#5f27cd"},
      96: {name:"Bromine-81", symbol:"⁸¹Br", color:"#7240d4"},
      97: {name:"Krypton-80", symbol:"⁸⁰Kr", color:"#8559da"},
      98: {name:"Krypton-82", symbol:"⁸²Kr", color:"#9872e1"},
      99: {name:"Krypton-84", symbol:"⁸⁴Kr", color:"#ab8be7"},
      100: {name:"Krypton-86", symbol:"⁸⁶Kr", color:"#beafed"}
    },

    // 実際の核融合プロセスに基づく反応ルール
    fusionRules: [
      // 1. PP連鎖反応（プロトン-プロトン連鎖）
      {r:[1,1], p:[2], e:1.2, prob:0.15, temp:15},        // H + H → ²H
      {r:[2,1], p:[4], e:5.5, prob:0.85, temp:20},        // ²H + H → ³He
      {r:[4,4], p:[5,1,1], e:12.9, prob:0.75, temp:30},   // ³He + ³He → ⁴He + 2H
      {r:[4,5], p:[8], e:1.6, prob:0.25, temp:35},        // ³He + ⁴He → ⁷Be

      // 2. 重水素関連（DT反応含む）
      {r:[2,2], p:[3,1], e:4.0, prob:0.50, temp:50},      // ²H + ²H → ³H + H
      {r:[2,2], p:[4], e:3.3, prob:0.50, temp:50},        // ²H + ²H → ³He
      {r:[2,3], p:[5], e:17.6, prob:0.95, temp:100},      // ²H + ³H → ⁴He (DT反応)

      // 3. トリプルアルファプロセス
      {r:[5,5], p:[9], e:-0.1, prob:0.10, temp:100},      // ⁴He + ⁴He → ⁸Be
      {r:[9,5], p:[13], e:7.3, prob:0.30, temp:120},      // ⁸Be + ⁴He → ¹²C

      // 4. CNOサイクル
      {r:[13,1], p:[15], e:1.9, prob:0.60, temp:140},     // ¹²C + H → ¹³N
      {r:[15], p:[14], e:1.2, prob:0.95, temp:5},         // ¹³N → ¹³C

      // 5. アルファプロセス（炭素燃焼以降）
      {r:[13,5], p:[19], e:7.2, prob:0.45, temp:200},     // ¹²C + ⁴He → ¹⁶O
      {r:[19,5], p:[25], e:4.7, prob:0.40, temp:300},     // ¹⁶O + ⁴He → ²⁰Ne
      {r:[25,5], p:[30], e:9.3, prob:0.35, temp:500},     // ²⁰Ne + ⁴He → ²⁴Mg
      {r:[30,5], p:[35], e:9.0, prob:0.30, temp:800},     // ²⁴Mg + ⁴He → ²⁸Si
      {r:[35,5], p:[40], e:6.9, prob:0.25, temp:1200},    // ²⁸Si + ⁴He → ³²S
      {r:[40,5], p:[46], e:6.6, prob:0.20, temp:1800},    // ³²S + ⁴He → ³⁶Ar
      {r:[46,5], p:[52], e:7.0, prob:0.18, temp:2500},    // ³⁶Ar + ⁴He → ⁴⁰Ca
      {r:[52,5], p:[56], e:5.1, prob:0.15, temp:3200},    // ⁴⁰Ca + ⁴He → ⁴⁴Ti
      {r:[56,5], p:[62], e:7.7, prob:0.12, temp:4000},    // ⁴⁴Ti + ⁴He → ⁴⁸Cr
      {r:[62,5], p:[67], e:7.9, prob:0.10, temp:5000},    // ⁴⁸Cr + ⁴He → ⁵²Fe

      // 6. 鉄族元素の形成
      {r:[67,5], p:[76], e:8.0, prob:0.08, temp:6000},    // ⁵²Fe + ⁴He → ⁵⁶Ni

      // 7. s-プロセス（簡略化された中性子捕獲）
      {r:[67], p:[68], e:8.0, prob:0.05, temp:7000},      // ⁵²Fe → ⁵⁴Fe
      {r:[69], p:[76], e:7.8, prob:0.06, temp:7200},      // ⁵⁶Fe → ⁵⁶Ni
      {r:[76], p:[80], e:7.5, prob:0.04, temp:7500},      // ⁵⁶Ni → ⁶³Cu

      // 8. より重い元素への段階的変換
      ...Array.from({length:15}, (_,i) => ({
        r:[80+i], p:[81+i], e:7.0-i*0.2, prob:0.03, temp:8000+i*300
      })),

      // 9. 軽元素の分岐反応
      {r:[8,1], p:[10], e:0.1, prob:0.20, temp:80},       // ⁷Be + H → ⁸B
      {r:[6,1], p:[8], e:5.0, prob:0.40, temp:60},        // ⁶Li + H → ⁷Be
      {r:[25], p:[19,5], e:-4.7, prob:0.30, temp:1200},   // ²⁰Ne → ¹⁶O + ⁴He
    ],

    config: {
      initialEnergy: 100, heatIncBase: 10, maxTempBase: 300, tempDecay: 0.95, scoreMul: 10,
      tapZone: { energyGain: 1, hChance: 0.3 },
      upgrade: { temp: {level: 0, inc: 100, cost: 150}, heat: {level: 0, inc: 8, cost: 80} }
    }
  };

  // ゲーム状態
  gameState = { energy: 0, score: 0, temp: 0, unlocked: [], inventory: {}, slots: [null, null] };

  constructor() { 
    document.addEventListener('DOMContentLoaded', () => this.init()); 
  }

  // 初期化とDOM操作（前回と同じ構造）
  init() {
    this.cacheDom();
    this.bindEvents();
    this.resetGame();
    this.loopParticles();
  }

  cacheDom() {
    // キャンバスとコンテキスト
    this.canvas        = document.getElementById('particle-canvas');
    this.ctx           = this.canvas.getContext('2d');

    // 元素パレット
    this.grid          = document.getElementById('element-grid');
  
    // スタート画面ボタン
    this.startBtn      = document.getElementById('start-game');
  
    // ゲーム画面ボタン
    this.heatBtn       = document.getElementById('heat-button');
    this.fuseBtn       = document.getElementById('fuse-button');
    this.clearBtn      = document.getElementById('clear-button');
  
    // アップグレードボタン
    this.upTempBtn     = document.getElementById('upgrade-temp-button');
    this.upHeatBtn     = document.getElementById('upgrade-heat-button');
  
    // タップゾーン
    this.tapZone       = document.getElementById('tap-zone');
  
    // モーダル「続ける」ボタン
    this.continueBtn   = document.getElementById('continue-button');
  }

  bindEvents() {
    // ウィンドウサイズ変更でキャンバスリサイズ
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();

    // スクリーン切替
    this.startBtn.addEventListener('click', () => {
      document.getElementById('startup-screen').classList.remove('active');
      document.getElementById('game-screen').classList.add('active');
      this.resetGame();
    });
  
    // ゲーム操作
    this.heatBtn.addEventListener('click',    () => this.increaseTemperature());
    this.fuseBtn.addEventListener('click',    () => this.attemptFusion());
    this.clearBtn.addEventListener('click',   () => this.clearReaction());

    // アップグレード
    this.upTempBtn.addEventListener('click',  () => this.buyUpgrade('temp'));
    this.upHeatBtn.addEventListener('click',  () => this.buyUpgrade('heat'));

    // タップゾーン
    this.tapZone.addEventListener('click',    () => this.handleTapZone());
  
    // モーダル閉じる
    this.continueBtn.addEventListener('click',() => {
      document.getElementById('result-modal').classList.remove('active');
    });
  
    // 温度自然減衰
    setInterval(() => this.decayTemperature(), 1000);
  }
   
// ウィンドウサイズ変更でキャンバスリサイズ
window.addEventListener('resize', () => this.resizeCanvas());
  this.resizeCanvas();

  // スクリーン切替
  this.startBtn.addEventListener('click', () => {
    document.getElementById('startup-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    this.resetGame();
  });

  // ゲーム操作
  this.heatBtn.addEventListener('click',    () => this.increaseTemperature());
  this.fuseBtn.addEventListener('click',    () => this.attemptFusion());
  this.clearBtn.addEventListener('click',   () => this.clearReaction());

  // アップグレード
  this.upTempBtn.addEventListener('click',  () => this.buyUpgrade('temp'));
  this.upHeatBtn.addEventListener('click',  () => this.buyUpgrade('heat'));

  // タップゾーン
  this.tapZone.addEventListener('click',    () => this.handleTapZone());

  // モーダル閉じる
  this.continueBtn.addEventListener('click',() => {
    document.getElementById('result-modal').classList.remove('active');
  });

  // 温度自然減衰
  setInterval(() => this.decayTemperature(), 1000);
}

  resetGame() {
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

  // ゲームロジック（改良版）
  renderElements() {
    this.grid.innerHTML = '';
    Object.entries(this.gameData.elements).forEach(([id, el]) => {
      const unlocked = this.gameState.unlocked.includes(+id);
      const count = this.gameState.inventory[id] || 0;
      const btn = document.createElement('div');
      btn.className = 'element-button' + (unlocked ? '' : ' locked');
      btn.style.backgroundColor = el.color;
      btn.innerHTML = `<div class="element-symbol">${el.symbol}</div><div class="element-count">${count}</div>`;
      
      if (unlocked) {
        btn.addEventListener('click', () => this.selectElement(+id));
        btn.title = `${el.name} (所持: ${count})`;
      } else {
        btn.title = `${el.name} (未発見)`;
      }
      this.grid.appendChild(btn);
    });
  }

  // その他のメソッド（前回と同じ構造だが、新しい融合ルールに対応）...
  
  findFusionRule(x, y) {
    return this.gameData.fusionRules.find(rule => {
      const [a, b] = rule.r;
      return (a === x && b === y) || (a === y && b === x);
    });
  }

  // パーティクルシステムやUI更新など（前回と同じ）...
}

new FusionGame();
