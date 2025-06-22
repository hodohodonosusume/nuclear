// Nuclear Fusion Puzzle Game
class FusionGame {
    constructor() {
        this.gameData = {
            elements: {
                "1": {"name": "Hydrogen", "symbol": "H", "atomic_number": 1, "mass": 1.008, "neutrons": 0, "color": "#ff6b6b", "fusible": true, "rarity": "common", "description": "最も軽い元素。核融合の基本材料。"},
                "2": {"name": "Deuterium", "symbol": "²H", "atomic_number": 1, "mass": 2.014, "neutrons": 1, "color": "#4ecdc4", "fusible": true, "rarity": "uncommon", "description": "重水素。水の約0.015%に含まれる。"},
                "3": {"name": "Tritium", "symbol": "³H", "atomic_number": 1, "mass": 3.016, "neutrons": 2, "color": "#45b7d1", "fusible": true, "rarity": "rare", "description": "三重水素。放射性同位体。"},
                "4": {"name": "Helium-3", "symbol": "³He", "atomic_number": 2, "mass": 3.016, "neutrons": 1, "color": "#96ceb4", "fusible": true, "rarity": "very_rare", "description": "希少な核融合燃料。月面に豊富。"},
                "5": {"name": "Helium-4", "symbol": "⁴He", "atomic_number": 2, "mass": 4.003, "neutrons": 2, "color": "#feca57", "fusible": false, "rarity": "common", "description": "最も安定したヘリウム同位体。"},
                "6": {"name": "Lithium", "symbol": "Li", "atomic_number": 3, "mass": 6.941, "neutrons": 3, "color": "#ff9ff3", "fusible": true, "rarity": "uncommon", "description": "三重水素の生産に使用。"},
                "7": {"name": "Beryllium", "symbol": "Be", "atomic_number": 4, "mass": 9.012, "neutrons": 5, "color": "#54a0ff", "fusible": true, "rarity": "rare", "description": "中性子源として使用。"},
                "8": {"name": "Boron", "symbol": "B", "atomic_number": 5, "mass": 10.811, "neutrons": 5, "color": "#5f27cd", "fusible": true, "rarity": "uncommon", "description": "プロトン-ボロン核融合に使用。"},
                "9": {"name": "Carbon", "symbol": "C", "atomic_number": 6, "mass": 12.011, "neutrons": 6, "color": "#00d2d3", "fusible": true, "rarity": "common", "description": "恒星内核融合の産物。"}
            },
            fusion_rules: [
                {"reactants": [1, 1], "products": [2], "energy": 1.4, "probability": 0.1, "temperature_required": 10},
                {"reactants": [1, 2], "products": [4], "energy": 5.5, "probability": 0.6, "temperature_required": 50},
                {"reactants": [2, 3], "products": [5], "energy": 17.6, "probability": 0.9, "temperature_required": 100},
                {"reactants": [2, 2], "products": [4], "energy": 3.3, "probability": 0.5, "temperature_required": 80},
                {"reactants": [4, 4], "products": [5, 1, 1], "energy": 12.9, "probability": 0.7, "temperature_required": 150}
            ],
            config: {
                "initial_energy": 100,
                "energy_per_click": 1,
                "temperature_decay_rate": 0.95,
                "fusion_success_base": 0.5,
                "score_multiplier": 10,
                "max_temperature": 200,
                "unlock_thresholds": {
                    "deuterium": 50,
                    "tritium": 200,
                    "helium3": 500,
                    "lithium": 1000,
                    "beryllium": 2000,
                    "boron": 5000,
                    "carbon": 10000
                }
            }
        };

        this.gameState = {
            energy: this.gameData.config.initial_energy,
            temperature: 0,
            score: 0,
            unlockedElements: [1], // Start with Hydrogen
            selectedElements: [],
            reactionSlots: [null, null],
            inventory: { 1: 10 }, // Start with 10 hydrogen
            currentScreen: 'startup'
        };

        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadGameState();
        this.renderElements();
        this.updateDisplay();
        this.startGameLoop();
    }

    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        // Screen navigation
        document.getElementById('start-game').addEventListener('click', () => this.showScreen('game'));
        document.getElementById('show-tutorial').addEventListener('click', () => this.showScreen('tutorial'));
        document.getElementById('start-from-tutorial').addEventListener('click', () => this.showScreen('game'));
        document.getElementById('back-to-startup').addEventListener('click', () => this.showScreen('startup'));

        // Game controls
        document.getElementById('heat-button').addEventListener('click', () => this.increaseTemperature());
        document.getElementById('fuse-button').addEventListener('click', () => this.attemptFusion());
        document.getElementById('clear-button').addEventListener('click', () => this.clearReaction());
        document.getElementById('continue-button').addEventListener('click', () => this.closeResultModal());

        // Temperature decay
        setInterval(() => this.decayTemperature(), 1000);
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.gameState.currentScreen = screenName;
        
        if (screenName === 'game') {
            this.renderElements();
            this.updateDisplay();
        }
    }

    renderElements() {
        const grid = document.getElementById('element-grid');
        grid.innerHTML = '';

        Object.entries(this.gameData.elements).forEach(([id, element]) => {
            const button = document.createElement('div');
            button.className = `element-button rarity-${element.rarity}`;
            button.style.backgroundColor = element.color;
            button.dataset.elementId = id;
            
            const isUnlocked = this.gameState.unlockedElements.includes(parseInt(id));
            const count = this.gameState.inventory[id] || 0;
            
            if (!isUnlocked) {
                button.classList.add('locked');
            }

            button.innerHTML = `
                <div class="rarity-glow"></div>
                <div class="element-symbol">${element.symbol}</div>
            `;

            if (isUnlocked) {
                button.addEventListener('click', () => this.selectElement(parseInt(id)));
                button.title = `${element.name} - ${element.description} (所有数: ${count})`;
            } else {
                button.title = `${element.name} - ロック中`;
            }

            grid.appendChild(button);
        });
    }

    selectElement(elementId) {
        const element = this.gameData.elements[elementId];
        const count = this.gameState.inventory[elementId] || 0;
        
        if (count <= 0) {
            this.showMessage('この元素は所有していません！');
            return;
        }

        // Find empty slot
        const emptySlotIndex = this.gameState.reactionSlots.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) {
            this.showMessage('反応スロットが満杯です！');
            return;
        }

        // Place element in slot
        this.gameState.reactionSlots[emptySlotIndex] = elementId;
        this.gameState.inventory[elementId]--;
        
        this.updateReactionSlots();
        this.updateDisplay();
        this.checkReactionPossibility();
    }

    updateReactionSlots() {
        this.gameState.reactionSlots.forEach((elementId, index) => {
            const slot = document.getElementById(`slot-${index + 1}`);
            if (elementId) {
                const element = this.gameData.elements[elementId];
                slot.innerHTML = `<div class="element-symbol" style="color: ${element.color}; font-weight: bold;">${element.symbol}</div>`;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            }
        });
    }

    checkReactionPossibility() {
        const reactants = this.gameState.reactionSlots.filter(id => id !== null);
        
        if (reactants.length < 2) {
            this.updateReactionInfo(null);
            return;
        }

        // Sort reactants to match fusion rules format
        const sortedReactants = [...reactants].sort((a, b) => a - b);
        
        // Find matching reaction
        const reaction = this.gameData.fusion_rules.find(rule => {
            if (rule.reactants.length !== sortedReactants.length) return false;
            
            // Check if reactants match exactly
            const sortedRuleReactants = [...rule.reactants].sort((a, b) => a - b);
            return sortedRuleReactants.every((r, i) => r === sortedReactants[i]);
        });

        this.updateReactionInfo(reaction);
    }

    updateReactionInfo(reaction) {
        const equationDiv = document.getElementById('reaction-equation');
        const energyDiv = document.getElementById('reaction-energy');
        const fuseButton = document.getElementById('fuse-button');
        const tempInfo = document.getElementById('required-temp-info');

        if (reaction) {
            const reactantSymbols = reaction.reactants.map(id => this.gameData.elements[id].symbol);
            const productSymbols = reaction.products.map(id => this.gameData.elements[id].symbol);
            
            equationDiv.textContent = `${reactantSymbols.join(' + ')} → ${productSymbols.join(' + ')}`;
            energyDiv.textContent = `エネルギー: +${reaction.energy} MeV`;
            tempInfo.textContent = `必要温度: ${reaction.temperature_required}M°C`;
            
            const canReact = this.gameState.temperature >= reaction.temperature_required;
            fuseButton.disabled = !canReact;
            fuseButton.textContent = canReact ? '核融合開始' : `温度不足 (${reaction.temperature_required}M°C必要)`;
        } else {
            const reactants = this.gameState.reactionSlots.filter(id => id !== null);
            if (reactants.length === 2) {
                equationDiv.textContent = '未知の反応です';
                energyDiv.textContent = 'この組み合わせでは反応しません';
            } else {
                equationDiv.textContent = '元素を2つ配置してください';
                energyDiv.textContent = '';
            }
            tempInfo.textContent = '必要温度: --';
            fuseButton.disabled = true;
            fuseButton.textContent = '核融合開始';
        }
    }

    increaseTemperature() {
        if (this.gameState.energy < this.gameData.config.energy_per_click) {
            this.showMessage('エネルギーが不足しています！');
            return;
        }

        this.gameState.energy -= this.gameData.config.energy_per_click;
        this.gameState.temperature += 10;
        
        if (this.gameState.temperature > this.gameData.config.max_temperature) {
            this.gameState.temperature = this.gameData.config.max_temperature;
        }

        this.updateDisplay();
        this.checkReactionPossibility();
        this.createHeatParticles();
    }

    decayTemperature() {
        if (this.gameState.temperature > 0) {
            this.gameState.temperature *= this.gameData.config.temperature_decay_rate;
            if (this.gameState.temperature < 1) {
                this.gameState.temperature = 0;
            }
            this.updateDisplay();
            this.checkReactionPossibility();
        }
    }

    attemptFusion() {
        const [slot1, slot2] = this.gameState.reactionSlots;
        if (!slot1 || !slot2) {
            this.showMessage('反応させる元素を2つ選択してください');
            return;
        }

        const rule = this.findFusionRule(slot1, slot2);
        if (!rule) {
            this.showMessage('この組み合わせでは核融合できません');
            return;
        }

        if (this.gameState.temperature < rule.temperature_required) {
        this.showMessage(`温度が不足しています。${rule.temperature_required}°C以上必要です`);
            return;
        }
    
        // 成功判定
        const successChance = rule.probability * (this.gameState.temperature / rule.temperature_required);
        const isSuccess = Math.random() < successChance;
    
        if (isSuccess) {
            this.handleFusionSuccess(rule, slot1, slot2);
        } else {
            this.showMessage('核融合に失敗しました');
            this.consumeReactants(slot1, slot2);
        }
    
        this.clearReaction();
        this.updateDisplay();
    }

    // 新しく追加する必要があるメソッド
    handleFusionSuccess(rule, slot1, slot2) {
        // エネルギー増加
        this.gameState.energy += rule.energy;
        
        // スコア増加
        this.gameState.score += rule.energy * this.gameData.config.score_multiplier;
        
        // 生成物をインベントリに追加
        rule.products.forEach(productId => {
            if (!this.gameState.inventory[productId]) {
                this.gameState.inventory[productId] = 0;
            }
            this.gameState.inventory[productId]++;
            
            // 新元素のアンロック処理
            if (!this.gameState.unlockedElements.includes(productId)) {
                this.gameState.unlockedElements.push(productId);
                this.showUnlockMessage(productId);
            }
        });
        
        // 反応物を消費
        this.consumeReactants(slot1, slot2);
        
        // 成功メッセージとモーダル表示
        this.showFusionResult(rule);
        
        // パーティクルエフェクト
        this.createFusionParticles();
    }
    
    consumeReactants(slot1, slot2) {
        this.gameState.inventory[slot1]--;
        this.gameState.inventory[slot2]--;
    
        // インベントリが0になった場合の処理
        if (this.gameState.inventory[slot1] <= 0) {
            delete this.gameState.inventory[slot1];
        }
        if (this.gameState.inventory[slot2] <= 0) {
            delete this.gameState.inventory[slot2];
        }
    }
    
    showFusionResult(rule) {
        const modal = document.getElementById('result-modal');
        const resultText = document.getElementById('result-text');
        const resultElements = document.getElementById('result-elements');
        const resultEnergy = document.getElementById('result-energy');
        
        resultText.textContent = '核融合成功！';
        
        // 生成された元素を表示
        const productNames = rule.products.map(id => this.gameData.elements[id].symbol).join(' + ');
        resultElements.textContent = productNames;
        
        // エネルギーを表示
        resultEnergy.textContent = `+${rule.energy} MeV`;
        
        modal.classList.add('active');
    }
    
    showUnlockMessage(elementId) {
        const element = this.gameData.elements[elementId];
        this.showMessage(`新元素発見！${element.name} (${element.symbol}) がアンロックされました！`);
    }
    
    createFusionParticles() {
        // パーティクルエフェクトの実装
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: 0.02,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
            });
        }
    }


    findFusionRule(element1, element2) {
        return this.gameData.fusion_rules.find(rule => {
            const [r1, r2] = rule.reactants;
            return (r1 == element1 && r2 == element2) || (r1 == element2 && r2 == element1);
        });
    }
    
    executeFusion(reaction) {
        // Add energy
        this.gameState.energy += reaction.energy;
        
        // Add score
        const scoreGain = Math.floor(reaction.energy * this.gameData.config.score_multiplier);
        this.gameState.score += scoreGain;

        // Add products to inventory
        reaction.products.forEach(productId => {
            if (!this.gameState.inventory[productId]) {
                this.gameState.inventory[productId] = 0;
            }
            this.gameState.inventory[productId]++;
        });

        // Clear reaction slots
        this.gameState.reactionSlots = [null, null];
        
        // Check for unlocks
        const newUnlocks = this.checkUnlocks();
        
        // Create fusion effect
        this.createFusionParticles(true);
        
        // Show result
        this.showFusionResult(true, reaction, newUnlocks);
        
        // Update display
        this.updateDisplay();
        this.updateReactionSlots();
        this.checkReactionPossibility();
        this.saveGameState();
    }

    checkUnlocks() {
        const newUnlocks = [];
        const thresholds = this.gameData.config.unlock_thresholds;
        
        Object.entries(thresholds).forEach(([elementKey, threshold]) => {
            let elementId;
            switch(elementKey) {
                case 'deuterium': elementId = 2; break;
                case 'tritium': elementId = 3; break;
                case 'helium3': elementId = 4; break;
                case 'lithium': elementId = 6; break;
                case 'beryllium': elementId = 7; break;
                case 'boron': elementId = 8; break;
                case 'carbon': elementId = 9; break;
            }
            
            if (elementId && this.gameState.score >= threshold && !this.gameState.unlockedElements.includes(elementId)) {
                this.gameState.unlockedElements.push(elementId);
                if (!this.gameState.inventory[elementId]) {
                    this.gameState.inventory[elementId] = 1; // Give 1 as starting amount
                }
                newUnlocks.push(this.gameData.elements[elementId]);
            }
        });
        
        if (newUnlocks.length > 0) {
            this.renderElements(); // Re-render with new unlocks
        }
        
        return newUnlocks;
    }

    showFusionResult(success, reaction, unlocks = []) {
        const modal = document.getElementById('result-modal');
        const title = document.getElementById('result-title');
        const elements = document.getElementById('result-elements');
        const energy = document.getElementById('result-energy');
        const unlock = document.getElementById('result-unlock');

        title.textContent = success ? '核融合成功！' : '核融合失敗...';
        
        if (success) {
            const productSymbols = reaction.products.map(id => this.gameData.elements[id].symbol);
            elements.innerHTML = `生成: ${productSymbols.join(' + ')}`;
            energy.textContent = `+${reaction.energy} MeV`;
            
            if (unlocks.length > 0) {
                unlock.innerHTML = `新しい元素をアンロック: ${unlocks.map(e => e.symbol).join(', ')}`;
                unlock.style.display = 'block';
            } else {
                unlock.style.display = 'none';
            }
        } else {
            elements.textContent = '反応に失敗しました。温度を上げて再挑戦してください。';
            energy.textContent = '';
            unlock.style.display = 'none';
        }

        modal.classList.add('active');
    }

    closeResultModal() {
        document.getElementById('result-modal').classList.remove('active');
    }

    clearReaction() {
        // Return elements to inventory
        this.gameState.reactionSlots.forEach(elementId => {
            if (elementId) {
                if (!this.gameState.inventory[elementId]) {
                    this.gameState.inventory[elementId] = 0;
                }
                this.gameState.inventory[elementId]++;
            }
        });

        this.gameState.reactionSlots = [null, null];
        this.updateReactionSlots();
        this.updateDisplay();
        this.checkReactionPossibility();
    }

    updateDisplay() {
        document.getElementById('energy-display').textContent = Math.floor(this.gameState.energy);
        document.getElementById('temperature-display').textContent = Math.floor(this.gameState.temperature);
        document.getElementById('score-display').textContent = this.gameState.score;
        
        // Update temperature gauge
        const gauge = document.getElementById('temperature-gauge-fill');
        const percentage = (this.gameState.temperature / this.gameData.config.max_temperature) * 100;
        gauge.style.width = `${Math.min(percentage, 100)}%`;
    }

    createFusionParticles(success) {
        const vessel = document.getElementById('reaction-vessel');
        const rect = vessel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < (success ? 30 : 10); i++) {
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.02,
                size: Math.random() * 3 + 1,
                color: success ? '#4ecdc4' : '#ff6b6b'
            });
        }
    }

    createHeatParticles() {
        const vessel = document.getElementById('reaction-vessel');
        const rect = vessel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: centerX + (Math.random() - 0.5) * 50,
                y: centerY + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3,
                life: 1,
                decay: 0.03,
                size: Math.random() * 2 + 0.5,
                color: '#feca57'
            });
        }
    }

    updateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    startGameLoop() {
        const loop = () => {
            this.updateParticles();
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    showMessage(message) {
        // Simple toast message
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-error);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1001;
            font-weight: 500;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    saveGameState() {
        try {
            const saveData = {
                energy: this.gameState.energy,
                score: this.gameState.score,
                unlockedElements: this.gameState.unlockedElements,
                inventory: this.gameState.inventory
            };
            // Note: localStorage is not available in the deployment environment
            // This is kept for local development only
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('fusionGame', JSON.stringify(saveData));
            }
        } catch (e) {
            console.log('Could not save game state');
        }
    }

    loadGameState() {
        try {
            if (typeof(Storage) !== "undefined") {
                const saved = localStorage.getItem('fusionGame');
                if (saved) {
                    const saveData = JSON.parse(saved);
                    this.gameState.energy = saveData.energy || this.gameData.config.initial_energy;
                    this.gameState.score = saveData.score || 0;
                    this.gameState.unlockedElements = saveData.unlockedElements || [1];
                    this.gameState.inventory = saveData.inventory || { 1: 10 };
                }
            }
        } catch (e) {
            console.log('Could not load game state');
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FusionGame();
});
