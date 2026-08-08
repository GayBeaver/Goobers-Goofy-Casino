const SAVE_KEY = 'allInCrescendoSave_v4';
const OLD_SAVE_KEY = 'allInCrescendoSave_v3';
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const UI_UPDATE_INTERVAL = 1 / 15;

const BUILDING_ORDER = [
    'busker', 'slots', 'blackjack', 'roulette',
    'vip', 'highRoller', 'corporate', 'empire'
];

const state = {
    chips: 0,
    lastTick: performance.now(),
    autosaveTimer: 0,
    uiUpdateTimer: 0,

    // Prestige
    fame: 0,
    runChipsEarned: 0,
    lifetimeChipsEarned: 0,

    // Rhythm game
    isPlaying: false,
    wager: 0,
    notes: [],
    spawnTimer: 0,
    spawnInterval: 1.2,
    holdRewardPerSecond: 10,
    combo: 0,
    bestCombo: 0,
    targetStart: 500,
    targetEnd: 560,
    missThreshold: 570,
    keysHeld: [false, false, false, false],
    activeHoldNote: [null, null, null, null],

    // Tempo
    baseNoteSpeed: 300,
    noteSpeed: 300,
    payoutMultiplier: 1,
    tempo: {
        unlockedLevel: 0,
        activeLevel: 0,
        speedPerLevel: 20,
        payoutPerLevel: 0.15,
        baseCost: 50,
        cost: 50,
        costMult: 1.45
    },

    // Casino Data with Tiered Cost Growth Math
    baseIncome: 1,
    buyMode: '1',
    casino: {
        buildings: {
            busker:      { name: "Busker",               amount: 0, baseCost: 10,       costGrowth: 1.07, baseIncome: 1 },
            slots:       { name: "Slot Machines",        amount: 0, baseCost: 100,      costGrowth: 1.12, baseIncome: 5 },
            blackjack:   { name: "Blackjack Tables",     amount: 0, baseCost: 1000,     costGrowth: 1.15, baseIncome: 25 },
            roulette:    { name: "Roulette",             amount: 0, baseCost: 12000,    costGrowth: 1.18, baseIncome: 120 },
            vip:         { name: "VIP Lounge",           amount: 0, baseCost: 150000,   costGrowth: 1.22, baseIncome: 800 },
            highRoller:  { name: "High Roller Suite",    amount: 0, baseCost: 2000000,  costGrowth: 1.28, baseIncome: 5000 },
            corporate:   { name: "Corporate Sponsor",    amount: 0, baseCost: 35000000, costGrowth: 1.35, baseIncome: 40000 },
            empire:      { name: "Casino Empire",        amount: 0, baseCost: 500000000,costGrowth: 1.45, baseIncome: 300000 }
        }
    },

    // Jackpot
    jackpot: 0,
    jackpotMax: 100,
    feverActive: false,
    feverTimeRemaining: 0,
    feverDuration: 10,
    feverMultiplier: 3
};

let noteIdCounter = 0;

/* =========================================================
   CREATE CASINO UI
========================================================= */

function injectCasinoUI() {
    const upgradeList = document.querySelector('.upgrade-list');
    const highway = document.getElementById('highway');
    if (!upgradeList || !highway) return;

    const buildingButtons = BUILDING_ORDER.map(type => {
        const building = state.casino.buildings[type];
        return `
            <button class="casino-building" id="building-${type}" onclick="buyBuilding('${type}')">
                <span>
                    <span class="building-name">${building.name}</span>
                    <span class="building-details">
                        <span id="building-${type}-income">0/sec</span><br>
                        Cost: <span id="building-${type}-cost">0</span><br>
                        <span id="building-${type}-milestone">Next milestone: 10</span>
                    </span>
                </span>
                <span class="building-owned" id="building-${type}-owned">0</span>
            </button>
        `;
    }).join('');

    upgradeList.innerHTML = `
        <div class="economy-summary">
            <div class="economy-stat">Casino Income<strong id="casinoIncomeDisplay">1/sec</strong></div>
            <div class="economy-stat">Fame Bonus<strong id="fameMultiplierMini">x1</strong></div>
        </div>
        <div class="buy-mode-row">
            <button id="buyMode1" class="selected" onclick="setBuyMode('1')">BUY 1</button>
            <button id="buyMode10" onclick="setBuyMode('10')">BUY 10</button>
            <button id="buyModeMax" onclick="setBuyMode('max')">BUY MAX</button>
        </div>
        ${buildingButtons}
    `;

    upgradeList.insertAdjacentHTML('afterend', `
        <div class="prestige-panel" id="prestigePanel">
            <h4>★ SELL THE CASINO</h4>
            <p>Sell everything and restart stronger. Fame permanently multiplies casino and rhythm income.</p>
            <p>Fame: <strong id="fameDisplay">0</strong> • Multiplier: <strong id="fameMultiplierDisplay">x1</strong></p>
            <p>Run Earnings: <strong id="runEarnedDisplay">0</strong><br>Sell Reward: <strong id="fameGainDisplay">+0 Fame</strong></p>
            <button id="sellCasinoBtn" onclick="sellCasino()" disabled>SELL THE CASINO</button>
        </div>
    `);

    highway.insertAdjacentHTML('beforebegin', `
        <div class="jackpot-panel" id="jackpotPanel">
            <div class="jackpot-header">
                <span>JACKPOT METER</span>
                <span id="jackpotText">0 / 100</span>
            </div>
            <div class="jackpot-track"><div id="jackpotFill"></div></div>
            <button id="feverBtn" onclick="activateFever()" disabled>FEVER LOCKED</button>
            <div class="fever-subtext">PERFECT +10 • GREAT +4 • GOOD +1</div>
        </div>
    `);
}

/* =========================================================
   TEMPO CONTROL UI
========================================================= */

function injectTempoControls() {
    const upgrade = document.getElementById('rightSpeedUpgrade');
    if (!upgrade) return;

    const info = upgrade.querySelector('.rhythm-upgrade-info');
    if (info) {
        info.innerHTML = `
            <strong>Unlock Higher Tempo</strong>
            <span>+20 maximum note speed</span>
            <span>+0.15× maximum rhythm payout</span>
        `;
    }

    if (document.getElementById('tempoSelector')) return;

    upgrade.insertAdjacentHTML('afterend', `
        <div id="tempoSelector" class="tempo-selector">
            <div class="tempo-selector-heading">
                <span>ACTIVE TEMPO</span>
                <strong id="tempoLevelDisplay">0 / 0</strong>
            </div>
            <div class="tempo-control-row">
                <button id="tempoDownBtn" onclick="changeTempo(-1)">−<span>SLOWER</span></button>
                <div class="tempo-current">
                    <strong id="tempoSpeedDisplay">300</strong>
                    <span>SPEED</span>
                </div>
                <button id="tempoUpBtn" onclick="changeTempo(1)">+<span>FASTER</span></button>
            </div>
            <div class="tempo-payout-line">
                Rhythm payout at this tempo: <strong id="tempoPayoutDisplay">x1.00</strong>
            </div>
        </div>
    `);

    injectTempoStyles();
}

function injectTempoStyles() {
    if (document.getElementById('tempoStyles')) return;

    const style = document.createElement('style');
    style.id = 'tempoStyles';
    style.textContent = `
        .tempo-selector { margin-top: 9px; padding: 10px; background: rgba(255,255,255,0.018); border: 1px solid rgba(255,255,255,0.065); border-radius: 9px; }
        .tempo-selector-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: #666f76; font-size: 8px; font-weight: 900; letter-spacing: 1px; }
        .tempo-selector-heading strong { color: #aeb7bd; font-size: 9px; }
        .tempo-control-row { display: grid; grid-template-columns: 1fr 72px 1fr; gap: 6px; align-items: stretch; }
        .tempo-control-row button { min-height: 47px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; background: rgba(24,242,139,0.07); color: #18f28b; border: 1px solid rgba(24,242,139,0.25); border-radius: 7px; font-size: 17px; font-weight: 900; cursor: pointer; transition: 0.15s ease; }
        .tempo-control-row button span { font-size: 7px; letter-spacing: 0.8px; }
        .tempo-control-row button:not(:disabled):hover { transform: translateY(-1px); background: rgba(24,242,139,0.13); border-color: #18f28b; }
        .tempo-control-row button:disabled { color: #4c555b; background: #14181b; border-color: #292f34; opacity: 0.55; cursor: not-allowed; }
        .tempo-current { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #090c0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; }
        .tempo-current strong { color: #fff; font-size: 16px; }
        .tempo-current span { margin-top: 1px; color: #596168; font-size: 7px; font-weight: 900; letter-spacing: 1px; }
        .tempo-payout-line { margin-top: 7px; text-align: center; color: #606970; font-size: 8px; }
        .tempo-payout-line strong { color: #18f28b; }
    `;
    document.head.appendChild(style);
}

injectCasinoUI();
injectTempoControls();

/* =========================================================
   UI REFERENCES
========================================================= */

const ui = {
    gameShell: document.getElementById('gameShell'),
    screenFlash: document.getElementById('screenFlash'),
    highway: document.getElementById('highway'),
    effectsLayer: document.getElementById('effectsLayer'),
    judgement: document.getElementById('judgement'),
    chips: document.getElementById('chips'),
    idleIncome: document.getElementById('idleIncome'),
    startBtn: document.getElementById('startBtn'),
    message: document.getElementById('message'),
    wagerInput: document.getElementById('wager'),
    comboCard: document.getElementById('comboCard'),
    comboDisplay: document.getElementById('comboDisplay'),
    bestCombo: document.getElementById('bestCombo'),
    comboMultiplier: document.getElementById('comboMultiplier'),
    totalMultiplier: document.getElementById('totalMultiplier'),
    lanes: [0, 1, 2, 3].map(i => document.getElementById(`lane-${i}`)),
    targets: [0, 1, 2, 3].map(i => document.getElementById(`target-${i}`))
};

// Dynamic elements (injected above) get cached once here instead of
// being looked up with getElementById inside updateUI() every frame.
function cacheDynamicUI() {
    ui.buildings = {};
    for (const type of BUILDING_ORDER) {
        ui.buildings[type] = {
            button: document.getElementById(`building-${type}`),
            owned: document.getElementById(`building-${type}-owned`),
            cost: document.getElementById(`building-${type}-cost`),
            income: document.getElementById(`building-${type}-income`),
            milestone: document.getElementById(`building-${type}-milestone`)
        };
    }

    ui.casinoIncomeDisplay = document.getElementById('casinoIncomeDisplay');
    ui.fameMultiplierMini = document.getElementById('fameMultiplierMini');
    ui.fameDisplay = document.getElementById('fameDisplay');
    ui.fameMultiplierDisplay = document.getElementById('fameMultiplierDisplay');
    ui.runEarnedDisplay = document.getElementById('runEarnedDisplay');
    ui.fameGainDisplay = document.getElementById('fameGainDisplay');
    ui.sellCasinoBtn = document.getElementById('sellCasinoBtn');

    ui.buyMode1 = document.getElementById('buyMode1');
    ui.buyMode10 = document.getElementById('buyMode10');
    ui.buyModeMax = document.getElementById('buyModeMax');

    ui.rightSpeedUpgrade = document.getElementById('rightSpeedUpgrade');
    ui.rightSpeedCost = document.getElementById('rightSpeedCost');
    ui.rightSpeedLevel = document.getElementById('rightSpeedLevel');

    ui.tempoLevelDisplay = document.getElementById('tempoLevelDisplay');
    ui.tempoSpeedDisplay = document.getElementById('tempoSpeedDisplay');
    ui.tempoPayoutDisplay = document.getElementById('tempoPayoutDisplay');
    ui.tempoDownBtn = document.getElementById('tempoDownBtn');
    ui.tempoUpBtn = document.getElementById('tempoUpBtn');

    ui.tempoStat = document.getElementById('tempoStat');
    ui.payoutStat = document.getElementById('payoutStat');
    ui.rightBestCombo = document.getElementById('rightBestCombo');
    ui.rightFameMultiplier = document.getElementById('rightFameMultiplier');

    ui.jackpotFill = document.getElementById('jackpotFill');
    ui.jackpotText = document.getElementById('jackpotText');
    ui.feverBtn = document.getElementById('feverBtn');
}

cacheDynamicUI();

/* =========================================================
   TEMPO MATH
========================================================= */

function syncTempoStats() {
    state.noteSpeed = state.baseNoteSpeed + state.tempo.activeLevel * state.tempo.speedPerLevel;
    state.payoutMultiplier = 1 + state.tempo.activeLevel * state.tempo.payoutPerLevel;
}

function changeTempo(direction) {
    if (state.isPlaying) {
        showMessage('You cannot change tempo during a show!', 'lose');
        return;
    }

    const newLevel = state.tempo.activeLevel + direction;
    if (newLevel < 0 || newLevel > state.tempo.unlockedLevel) return;

    state.tempo.activeLevel = newLevel;
    syncTempoStats();
    showMessage(`Tempo set to level ${state.tempo.activeLevel}. Speed ${state.noteSpeed}.`, 'win');
    updateUI();
}

/* =========================================================
   FORMAT NUMBERS
========================================================= */

function formatNumber(value) {
    if (!Number.isFinite(value)) return '∞';
    if (value < 1000) return Math.floor(value * 10) / 10;

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
    const tier = Math.floor(Math.log10(value) / 3);
    if (tier >= suffixes.length) return value.toExponential(2);

    const scaled = value / Math.pow(1000, tier);
    const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return scaled.toFixed(decimals) + suffixes[tier];
}

/* =========================================================
   CHIP ECONOMY
========================================================= */

function addChips(amount, countAsEarned = true) {
    if (!Number.isFinite(amount) || amount <= 0) return;

    state.chips += amount;
    if (countAsEarned) {
        state.runChipsEarned += amount;
        state.lifetimeChipsEarned += amount;
    }
}

function getFameMultiplier() {
    return 1 + state.fame * 4;
}

function calculateFameGain() {
    if (state.runChipsEarned < 100000) return 0;
    return Math.floor(Math.sqrt(state.runChipsEarned / 100000));
}

/* =========================================================
   CASINO BUILDING MATH
========================================================= */

function getBuildingMilestoneMultiplier(amount) {
    let multiplier = 1;
    if (amount >= 10) multiplier *= 2;
    if (amount >= 25) multiplier *= 2;
    if (amount >= 50) multiplier *= 2;
    if (amount >= 100) multiplier *= 3;
    return multiplier;
}

function getNextMilestone(amount) {
    if (amount < 10) return 10;
    if (amount < 25) return 25;
    if (amount < 50) return 50;
    if (amount < 100) return 100;
    return null;
}

function getBuildingIncome(building) {
    return building.amount * building.baseIncome * getBuildingMilestoneMultiplier(building.amount);
}

function calculateBaseCasinoIncome() {
    let total = state.baseIncome;
    for (const type of BUILDING_ORDER) {
        total += getBuildingIncome(state.casino.buildings[type]);
    }
    return total;
}

function getIdleIncomePerSecond() {
    return calculateBaseCasinoIncome() * getFameMultiplier() * (state.feverActive ? state.feverMultiplier : 1);
}

function getBulkCost(type, quantity) {
    if (quantity <= 0) return 0;

    const building = state.casino.buildings[type];
    const r = building.costGrowth;

    const total = r === 1
        ? building.baseCost * quantity
        : building.baseCost * Math.pow(r, building.amount) * (Math.pow(r, quantity) - 1) / (r - 1);

    return Math.floor(total);
}

function getMaxAffordable(type) {
    const building = state.casino.buildings[type];
    const r = building.costGrowth;
    const chips = state.chips;

    const costOfOne = building.baseCost * Math.pow(r, building.amount);
    if (costOfOne > chips) return 0;

    let k;
    if (r === 1) {
        k = Math.floor(chips / building.baseCost);
    } else {
        const ratio = 1 + (chips * (r - 1)) / (building.baseCost * Math.pow(r, building.amount));
        k = ratio > 0 ? Math.floor(Math.log(ratio) / Math.log(r)) : 0;
    }

    k = Math.max(0, Math.min(k, 10000));

    while (k < 10000 && getBulkCost(type, k + 1) <= chips) k++;
    while (k > 0 && getBulkCost(type, k) > chips) k--;

    return k;
}

function getPurchaseQuantity(type) {
    if (state.buyMode === '10') return 10;
    if (state.buyMode === 'max') return getMaxAffordable(type);
    return 1;
}

function setBuyMode(mode) {
    state.buyMode = mode;
    updateUI();
}

function buyBuilding(type) {
    const building = state.casino.buildings[type];
    const quantity = getPurchaseQuantity(type);

    if (quantity <= 0) {
        showMessage('Not enough chips!', 'lose');
        return;
    }

    const cost = getBulkCost(type, quantity);
    if (state.chips < cost) {
        showMessage('Not enough chips!', 'lose');
        return;
    }

    state.chips -= cost;
    building.amount += quantity;
    showMessage(`Bought ${quantity} ${building.name}!`, 'win');
    updateUI();
}

/* =========================================================
   PRESTIGE
========================================================= */

function sellCasino() {
    const fameGain = calculateFameGain();
    if (fameGain <= 0) return;

    if (!confirm(`Sell the casino for +${fameGain} Fame?`)) return;

    clearAllNotes();
    state.isPlaying = false;
    state.fame += fameGain;
    state.chips = 0;
    state.runChipsEarned = 0;
    state.combo = 0;
    state.jackpot = 0;
    state.feverActive = false;
    state.feverTimeRemaining = 0;
    state.tempo.unlockedLevel = 0;
    state.tempo.activeLevel = 0;
    state.tempo.cost = state.tempo.baseCost;
    state.spawnInterval = 1.2;
    syncTempoStats();

    for (const type of BUILDING_ORDER) {
        state.casino.buildings[type].amount = 0;
    }

    ui.startBtn.disabled = false;
    showJudgement(`+${fameGain} FAME`, 'milestone');
    showMessage(`Casino sold! Permanent multiplier is now x${getFameMultiplier()}.`, 'win');
    updateUI();
}

/* =========================================================
   JACKPOT
========================================================= */

function addJackpot(amount) {
    if (state.feverActive) return;

    const oldValue = state.jackpot;
    state.jackpot = Math.min(state.jackpotMax, state.jackpot + amount);

    if (oldValue < state.jackpotMax && state.jackpot >= state.jackpotMax) {
        showJudgement('JACKPOT READY!', 'milestone');
        showMessage('Jackpot ready! Activate Fever!', 'win');
    }
}

function activateFever() {
    if (state.jackpot < state.jackpotMax || state.feverActive) return;

    state.jackpot = 0;
    state.feverActive = true;
    state.feverTimeRemaining = state.feverDuration;

    showJudgement('FEVER TIME!', 'milestone');
    showMessage('FEVER TIME! Idle income x3!', 'win');
    triggerShake('big');
    flashScreen('#ffd86b');
}

/* =========================================================
   RHYTHM MULTIPLIERS (Updated Math)
========================================================= */

function getComboMultiplier() {
    if (state.combo <= 0) return 1;
    
    // Uses Square Root scaling: 
    // 5 Combo = x2.2 multiplier
    // 25 Combo = x3.5 multiplier
    // 100 Combo = x6.0 multiplier
    return Math.floor(1 + Math.sqrt(state.combo) * 0.5);
}

function getTotalPayoutMultiplier() {
    return state.payoutMultiplier * getComboMultiplier() * getFameMultiplier();
}

/* =========================================================
   BUY TEMPO UPGRADE
========================================================= */

function buyUpgrade(type) {
    if (type !== 'speed') return;

    const upgrade = state.tempo;
    if (state.chips < upgrade.cost) {
        showMessage('Not enough chips for the tempo upgrade!', 'lose');
        return;
    }

    state.chips -= upgrade.cost;
    upgrade.unlockedLevel++;
    upgrade.cost = Math.floor(upgrade.cost * upgrade.costMult);

    if (!state.isPlaying) {
        upgrade.activeLevel = upgrade.unlockedLevel;
        syncTempoStats();
        showMessage(`Tempo ${upgrade.unlockedLevel} unlocked! Speed is now ${state.noteSpeed}. You can lower it whenever you want.`, 'win');
    } else {
        showMessage(`Tempo ${upgrade.unlockedLevel} unlocked! Select it from the tempo panel after this show.`, 'win');
    }

    flashScreen('#18f28b');
    updateUI();
}

/* =========================================================
   HIT JUDGEMENT
========================================================= */

function getHitJudgement(noteCenter) {
    const targetCenter = (state.targetStart + state.targetEnd) / 2;
    const distance = Math.abs(noteCenter - targetCenter);

    if (distance <= 8) {
        return { label: 'PERFECT', className: 'perfect', rewardMultiplier: 1.25, color: '#ffd86b', particles: 20, shake: 'medium', jackpot: 10 };
    }
    if (distance <= 20) {
        return { label: 'GREAT', className: 'great', rewardMultiplier: 1.1, color: '#24dfff', particles: 14, shake: 'small', jackpot: 4 };
    }
    return { label: 'GOOD', className: 'good', rewardMultiplier: 1, color: '#18f28b', particles: 10, shake: 'small', jackpot: 1 };
}

/* =========================================================
   NOTE SUCCESS
========================================================= */

function awardSuccessfulNote(quality, laneIndex, isLong, holdEarned = 0) {
    state.combo++;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    addJackpot(quality.jackpot);

    const reward = Math.max(
        1,
        Math.floor(state.wager * (isLong ? 0.1 : 0.2) * getTotalPayoutMultiplier() * quality.rewardMultiplier)
    );

    addChips(reward);

    playSuccessEffects(
        laneIndex,
        quality,
        reward + Math.floor(holdEarned),
        isLong ? 'LONG COMPLETE' : quality.label
    );

    if (state.combo % 5 === 0) {
        showJudgement(`${state.combo} COMBO!`, 'milestone');
    }

    updateUI();
}

/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(currentTick) {
    const rawDeltaTime = (currentTick - state.lastTick) / 1000;
    const rhythmDeltaTime = Math.min(rawDeltaTime, 0.05);
    state.lastTick = currentTick;

    addChips(getIdleIncomePerSecond() * rawDeltaTime);

    if (state.feverActive) {
        state.feverTimeRemaining -= rawDeltaTime;
        if (state.feverTimeRemaining <= 0) {
            state.feverActive = false;
            state.feverTimeRemaining = 0;
            showMessage('Fever Time ended.', 'win');
        }
    }

    if (state.isPlaying) {
        state.spawnTimer += rhythmDeltaTime;
        if (state.spawnTimer >= state.spawnInterval) {
            state.spawnTimer = 0;
            spawnNote();
        }

        for (let i = state.notes.length - 1; i >= 0; i--) {
            const note = state.notes[i];

            if (!note.isHolding) {
                note.y += state.noteSpeed * rhythmDeltaTime;
            }

            const head = document.getElementById(note.id);
            if (head) head.style.top = note.y + 'px';

            if (note.isLong) {
                const body = document.getElementById(note.id + '-body');
                if (body) {
                    if (note.isHolding) {
                        note.holdElapsed += rhythmDeltaTime;
                        const remaining = note.holdDuration > 0
                            ? Math.max(0, 1 - note.holdElapsed / note.holdDuration)
                            : 0;
                        const currentLength = note.length * remaining;
                        body.style.top = (note.y - currentLength) + 'px';
                        body.style.height = currentLength + 'px';
                    } else {
                        body.style.top = (note.y - note.length) + 'px';
                        body.style.height = note.length + 'px';
                    }
                }
            }

            if (note.isHolding) {
                const reward = state.holdRewardPerSecond * rhythmDeltaTime * getTotalPayoutMultiplier();
                addChips(reward);
                note.holdEarned += reward;

                if (note.holdElapsed >= note.holdDuration) {
                    const lane = note.lane;
                    const quality = note.hitQuality;
                    const earnings = note.holdEarned;
                    cleanupNoteCompletely(i);
                    awardSuccessfulNote(quality, lane, true, earnings);
                }

                continue;
            }

            if (!note.hit && note.y > state.missThreshold) {
                cleanupNoteCompletely(i);
                finishGame(false, 'Note missed!');
                break;
            }
        }
    }

    state.autosaveTimer += rawDeltaTime;
    if (state.autosaveTimer >= 10) {
        state.autosaveTimer = 0;
        saveGame();
    }

    state.uiUpdateTimer += rawDeltaTime;
    if (state.uiUpdateTimer >= UI_UPDATE_INTERVAL) {
        state.uiUpdateTimer = 0;
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

/* =========================================================
   SPAWN NOTE
========================================================= */

function spawnNote() {
    const lane = Math.floor(Math.random() * 4);
    const isLong = Math.random() < 0.3;

    const note = {
        id: `note-${noteIdCounter++}`,
        lane,
        y: -30,
        isLong,
        length: isLong ? 150 : 0,
        hit: false,
        isHolding: false,
        hitQuality: null,
        holdEarned: 0,
        holdElapsed: 0,
        holdDuration: 0
    };

    state.notes.push(note);

    if (isLong) {
        const body = document.createElement('div');
        body.id = note.id + '-body';
        body.className = 'long-note-body';
        ui.lanes[lane].appendChild(body);
    }

    const head = document.createElement('div');
    head.id = note.id;
    head.className = 'note';
    ui.lanes[lane].appendChild(head);
}

/* =========================================================
   NOTE CLEANUP
========================================================= */

function cleanupNoteCompletely(index) {
    const note = state.notes[index];
    if (!note) return;

    document.getElementById(note.id)?.remove();
    document.getElementById(note.id + '-body')?.remove();

    if (state.activeHoldNote[note.lane] === note) {
        state.activeHoldNote[note.lane] = null;
        ui.targets[note.lane].classList.remove('holding');
    }

    state.notes.splice(index, 1);
}

function clearAllNotes() {
    state.notes.forEach(note => {
        document.getElementById(note.id)?.remove();
        document.getElementById(note.id + '-body')?.remove();
    });

    state.notes = [];
    state.activeHoldNote = [null, null, null, null];
    ui.targets.forEach(target => target.classList.remove('holding', 'active'));
}

/* =========================================================
   INPUT
========================================================= */

function handleKeyDown(laneIndex) {
    if (!state.isPlaying) return;

    ui.targets[laneIndex].classList.add('active');
    setTimeout(() => ui.targets[laneIndex].classList.remove('active'), 100);

    const index = state.notes.findIndex(note => note.lane === laneIndex && !note.hit);
    if (index === -1) {
        state.combo = 0;
        return;
    }

    const note = state.notes[index];
    const center = note.y + 12.5;

    if (center >= state.targetStart && center <= state.targetEnd) {
        const quality = getHitJudgement(center);
        note.hit = true;
        note.hitQuality = quality;

        if (note.isLong) {
            note.isHolding = true;
            note.holdElapsed = 0;
            note.holdDuration = note.length / state.noteSpeed;
            state.activeHoldNote[laneIndex] = note;

            ui.targets[laneIndex].classList.add('holding');
            document.getElementById(note.id)?.classList.add('held');
            document.getElementById(note.id + '-body')?.classList.add('held');

            showJudgement('HOLD', 'hold');
        } else {
            cleanupNoteCompletely(index);
            awardSuccessfulNote(quality, laneIndex, false);
        }
    }
}
