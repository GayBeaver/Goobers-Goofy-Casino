'use strict';

/* =========================================================
   GOOBERS GOOFY CASINO — LONG-FORM TYCOON / RHYTHM ROGUELITE

   This build intentionally uses a new save key. The economy,
   prestige model and rhythm payouts are incompatible with the
   older prototype, so publishing it gives every player a clean
   start without requiring them to clear browser storage.
========================================================= */

const SAVE_KEY = 'goobersGoofyCasinoSave_v7';
const LEGACY_SAVE_KEYS = ['allInCrescendoSave_v6'];
const SAVE_VERSION = 7;
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const OFFLINE_EFFICIENCY = 0.5;
const SAVE_INTERVAL = 15;
const UI_INTERVAL = 1 / 12;

const LANE_COUNT = 4;
const NOTE_SPAWN_Y = -34;
let TARGET_CENTER_Y = 536;
let MISS_Y = 585;
const PERFECT_WINDOW = 0.055;
const GREAT_WINDOW = 0.105;
const GOOD_WINDOW = 0.18;

const BUILDING_ORDER = [
    'busker',
    'slots',
    'blackjack',
    'roulette',
    'vip',
    'highRoller',
    'corporate',
    'empire'
];

const BUILDINGS = {
    busker: {
        name: 'Street Buskers',
        shortName: 'Buskers',
        icon: '♪',
        unlockVenue: 0,
        baseCost: 15,
        costGrowth: 1.14,
        baseIncome: 0.8,
        description: 'Cheap opening income. Every 10 Buskers slightly improves Show Pot growth.'
    },
    slots: {
        name: 'Slot Machines',
        shortName: 'Slots',
        icon: '7',
        unlockVenue: 0,
        baseCost: 250,
        costGrowth: 1.15,
        baseIncome: 7,
        description: 'Reliable floor revenue. Large banks of Slots charge the Jackpot faster.'
    },
    blackjack: {
        name: 'Blackjack Tables',
        shortName: 'Blackjack',
        icon: '21',
        unlockVenue: 1,
        baseCost: 5_000,
        costGrowth: 1.16,
        baseIncome: 70,
        description: 'Skilled dealers improve production and increase GREAT/PERFECT Show Pot growth.'
    },
    roulette: {
        name: 'Roulette Wheels',
        shortName: 'Roulette',
        icon: '◎',
        unlockVenue: 2,
        baseCost: 120_000,
        costGrowth: 1.17,
        baseIncome: 850,
        description: 'High-volume tables. Each wheel adds a little more duration to Fever Time.'
    },
    vip: {
        name: 'VIP Lounges',
        shortName: 'VIP',
        icon: '◆',
        unlockVenue: 3,
        baseCost: 3_000_000,
        costGrowth: 1.18,
        baseIncome: 12_000,
        description: 'Luxury clients generate huge income and add a small bonus when you cash out.'
    },
    highRoller: {
        name: 'High Roller Suites',
        shortName: 'High Rollers',
        icon: '♛',
        unlockVenue: 4,
        baseCost: 90_000_000,
        costGrowth: 1.19,
        baseIncome: 180_000,
        description: 'Whale-only suites that make difficult Show Contracts more profitable.'
    },
    corporate: {
        name: 'Corporate Sponsors',
        shortName: 'Sponsors',
        icon: '▰',
        unlockVenue: 5,
        baseCost: 3_000_000_000,
        costGrowth: 1.20,
        baseIncome: 3_000_000,
        description: 'Brand deals strengthen every lower-tier building in your casino.'
    },
    empire: {
        name: 'Casino Empires',
        shortName: 'Empires',
        icon: '★',
        unlockVenue: 6,
        baseCost: 120_000_000_000,
        costGrowth: 1.21,
        baseIncome: 60_000_000,
        description: 'The endgame institution. Every Empire boosts all casino production.'
    }
};

const VENUES = [
    {
        name: 'Backroom Stage',
        sceneName: 'BACKROOM',
        description: 'A borrowed room, a tiny crowd and enough floor space for your first machines.',
        expansionCost: 8_000,
        objectives: [
            { type: 'building', key: 'busker', target: 10, label: 'Own 10 Street Buskers' },
            { type: 'bestCombo', target: 12, label: 'Reach a 12-note combo' },
            { type: 'bestCashout', target: 150, label: 'Cash out a Show Pot worth 150' }
        ]
    },
    {
        name: 'Neighborhood Casino',
        sceneName: 'LOCAL CASINO',
        description: 'A real gaming floor. Blackjack Tables and Gold Notes now enter the rotation.',
        expansionCost: 250_000,
        objectives: [
            { type: 'building', key: 'slots', target: 15, label: 'Own 15 Slot Machines' },
            { type: 'sustainableIncome', target: 120, label: 'Reach 120 sustainable chips/sec' },
            { type: 'completedContracts', target: 2, label: 'Complete 2 Show Contracts' }
        ]
    },
    {
        name: 'Downtown Floor',
        sceneName: 'DOWNTOWN',
        description: 'The crowd is serious now. Roulette, chord patterns and Casino Managers unlock.',
        expansionCost: 8_000_000,
        objectives: [
            { type: 'building', key: 'blackjack', target: 12, label: 'Own 12 Blackjack Tables' },
            { type: 'bestCombo', target: 30, label: 'Reach a 30-note combo' },
            { type: 'perfectHits', target: 50, label: 'Land 50 lifetime PERFECT hits' }
        ]
    },
    {
        name: 'Luxury Resort',
        sceneName: 'LUXURY RESORT',
        description: 'VIP clients arrive, recovery notes appear and selling the casino becomes possible.',
        expansionCost: 250_000_000,
        objectives: [
            { type: 'building', key: 'roulette', target: 10, label: 'Own 10 Roulette Wheels' },
            { type: 'bestCashout', target: 500_000, label: 'Cash out a Show Pot worth 500K' },
            { type: 'encores', target: 2, label: 'Accept 2 Encores' }
        ]
    },
    {
        name: 'Neon Strip',
        sceneName: 'NEON STRIP',
        description: 'A glowing destination casino with High Roller Suites and dangerous rush contracts.',
        expansionCost: 8_000_000_000,
        objectives: [
            { type: 'building', key: 'vip', target: 10, label: 'Own 10 VIP Lounges' },
            { type: 'sustainableIncome', target: 2_000_000, label: 'Reach 2M sustainable chips/sec' },
            { type: 'completedContracts', target: 12, label: 'Complete 12 Show Contracts' }
        ]
    },
    {
        name: 'Global Broadcast Casino',
        sceneName: 'GLOBAL LIVE',
        description: 'Every show is televised. Corporate Sponsors and the hardest touring sets unlock.',
        expansionCost: 250_000_000_000,
        objectives: [
            { type: 'building', key: 'highRoller', target: 10, label: 'Own 10 High Roller Suites' },
            { type: 'bestCombo', target: 80, label: 'Reach an 80-note combo' },
            { type: 'encores', target: 8, label: 'Accept 8 lifetime Encores' }
        ]
    },
    {
        name: 'World Casino Empire',
        sceneName: 'WORLD EMPIRE',
        description: 'The final venue tier. Build multiple Empires, chase records and optimize Fame builds.',
        expansionCost: null,
        objectives: [
            { type: 'building', key: 'empire', target: 10, label: 'Own 10 Casino Empires' },
            { type: 'bestCashout', target: 10_000_000_000, label: 'Cash out a Show Pot worth 10B' },
            { type: 'prestiges', target: 2, label: 'Sell the casino twice' }
        ]
    }
];

const CONTRACTS = {
    openMic: {
        name: 'Open Mic',
        icon: '♪',
        unlockVenue: 0,
        minTempo: 0,
        objectiveType: 'hits',
        target: 20,
        objectiveLabel: 'hits',
        multiplier: 1,
        density: 0.75,
        lives: 3,
        description: 'A forgiving opening set with steady beat spacing.'
    },
    houseSet: {
        name: 'House Set',
        icon: '◆',
        unlockVenue: 0,
        minTempo: 1,
        objectiveType: 'hits',
        target: 35,
        objectiveLabel: 'hits',
        multiplier: 1.18,
        density: 0.86,
        lives: 3,
        description: 'Longer than Open Mic, with better Show Pot growth.'
    },
    highRollerNight: {
        name: 'High Roller Night',
        icon: '♛',
        unlockVenue: 1,
        minTempo: 2,
        objectiveType: 'hits',
        target: 45,
        objectiveLabel: 'hits',
        multiplier: 1.38,
        density: 0.94,
        lives: 3,
        description: 'A faster crowd that pays well for confident play.'
    },
    goldenHour: {
        name: 'Golden Hour',
        icon: '★',
        unlockVenue: 2,
        minTempo: 2,
        objectiveType: 'perfects',
        target: 12,
        objectiveLabel: 'PERFECT hits',
        multiplier: 1.58,
        density: 0.9,
        lives: 3,
        goldChance: 0.16,
        description: 'Complete the set with precision. Gold Notes appear more often.'
    },
    enduranceSet: {
        name: 'Endurance Set',
        icon: '∞',
        unlockVenue: 3,
        minTempo: 3,
        objectiveType: 'hits',
        target: 75,
        objectiveLabel: 'hits',
        multiplier: 1.78,
        density: 1,
        lives: 2,
        description: 'A long two-life performance with excellent profit potential.'
    },
    neonRush: {
        name: 'Neon Rush',
        icon: '⚡',
        unlockVenue: 4,
        minTempo: 5,
        objectiveType: 'hits',
        target: 90,
        objectiveLabel: 'hits',
        multiplier: 2.05,
        density: 1.12,
        lives: 2,
        startingHeat: 2,
        description: 'Starts hot, moves fast and rewards players who can stay composed.'
    },
    perfectBroadcast: {
        name: 'Perfect Broadcast',
        icon: '◉',
        unlockVenue: 5,
        minTempo: 6,
        objectiveType: 'perfects',
        target: 22,
        objectiveLabel: 'PERFECT hits',
        multiplier: 2.32,
        density: 1.06,
        lives: 2,
        goldChance: 0.1,
        description: 'A televised precision set where every PERFECT matters.'
    },
    worldTourFinale: {
        name: 'World Tour Finale',
        icon: '✦',
        unlockVenue: 6,
        minTempo: 8,
        objectiveType: 'hits',
        target: 150,
        objectiveLabel: 'hits',
        multiplier: 2.7,
        density: 1.22,
        lives: 2,
        startingHeat: 3,
        description: 'The definitive endgame contract. Long, fast and extremely valuable.'
    }
};

const MANAGERS = {
    buskerManager: {
        name: 'Street Promoter',
        building: 'busker',
        amountRequired: 25,
        cost: 30_000,
        description: 'Turns your earliest building into either a production engine or a Show hype machine.',
        choices: {
            producer: { name: 'Touring Producer', effect: 'Street Busker production ×2.' },
            hype: { name: 'Hype Crew', effect: '+10% Show Pot growth.' }
        }
    },
    slotsManager: {
        name: 'Machine Engineer',
        building: 'slots',
        amountRequired: 20,
        cost: 600_000,
        description: 'Optimizes the floor for direct revenue or a much faster Jackpot cycle.',
        choices: {
            loose: { name: 'Loose Machines', effect: 'Slot Machine production ×1.75.' },
            network: { name: 'Jackpot Network', effect: '+25% Jackpot charge.' }
        }
    },
    blackjackManager: {
        name: 'Blackjack Pit Boss',
        building: 'blackjack',
        amountRequired: 15,
        cost: 14_000_000,
        description: 'Runs efficient tables or trains the stage crew to capitalize on accurate hits.',
        choices: {
            pit: { name: 'Perfect Pit', effect: 'Blackjack production ×1.75.' },
            dealer: { name: 'Performance Dealer', effect: 'GREAT and PERFECT Pot growth +20%.' }
        }
    },
    vipManager: {
        name: 'VIP Host',
        building: 'vip',
        amountRequired: 10,
        cost: 750_000_000,
        description: 'Makes luxury clients more profitable or insures part of a busted wager.',
        choices: {
            host: { name: 'Celebrity Host', effect: 'VIP Lounge production ×2.' },
            insurance: { name: 'House Insurance', effect: 'Refund 20% of the starting wager on bust.' }
        }
    },
    highRollerManager: {
        name: 'Whale Concierge',
        building: 'highRoller',
        amountRequired: 10,
        cost: 25_000_000_000,
        description: 'Specializes in suite revenue or in premium Show Contract payouts.',
        choices: {
            whale: { name: 'Whale Service', effect: 'High Roller production ×1.75.' },
            promoter: { name: 'Contract Promoter', effect: '+15% contract Pot growth.' }
        }
    },
    corporateManager: {
        name: 'Executive Board',
        building: 'corporate',
        amountRequired: 10,
        cost: 850_000_000_000,
        description: 'Focuses sponsors on direct deals or cross-casino operational synergy.',
        choices: {
            board: { name: 'Brand Board', effect: 'Corporate Sponsor production ×1.75.' },
            synergy: { name: 'Vertical Synergy', effect: 'All lower-tier buildings +15%.' }
        }
    }
};

const FAME_BRANCHES = {
    mogul: {
        name: 'Mogul',
        description: 'Casino production and faster rebuilding.',
        upgrades: [
            { id: 'mogulIncome', name: 'House Reputation', max: 5, costs: [1, 2, 3, 5, 8], effect: '+15% casino income per level.' },
            { id: 'mogulStarter', name: 'Opening Crew', max: 3, costs: [1, 3, 6], effect: 'Start each new casino with 5 Buskers per level.' },
            { id: 'mogulMilestones', name: 'Operational Scale', max: 4, costs: [2, 3, 5, 8], effect: '+5% building milestone power per level.' }
        ]
    },
    performer: {
        name: 'Performer',
        description: 'Rhythm consistency and stronger Show Pots.',
        upgrades: [
            { id: 'performerPot', name: 'Stage Presence', max: 5, costs: [1, 2, 3, 5, 8], effect: '+8% Show Pot growth per level.' },
            { id: 'performerFever', name: 'Extended Fever', max: 4, costs: [1, 2, 4, 7], effect: '+2 seconds of Fever Time per level.' },
            { id: 'performerLife', name: 'Second Wind', max: 2, costs: [3, 7], effect: '+1 life in every Show per level.' }
        ]
    },
    gambler: {
        name: 'Gambler',
        description: 'Jackpots, insurance and more lucrative Encores.',
        upgrades: [
            { id: 'gamblerJackpot', name: 'Lucky Streak', max: 5, costs: [1, 2, 3, 5, 8], effect: '+10% Jackpot charge per level.' },
            { id: 'gamblerInsurance', name: 'Safety Net', max: 5, costs: [1, 2, 3, 5, 8], effect: 'Refund 5% of the wager on bust per level.' },
            { id: 'gamblerEncore', name: 'Double or Nothing', max: 4, costs: [2, 3, 5, 8], effect: '+10% Encore Pot growth per level.' }
        ]
    }
};

const ACHIEVEMENTS = {
    firstShow: { name: 'First Night', description: 'Cash out your first show.', test: s => s.stats.totalCashouts >= 1 },
    cashout1k: { name: 'Four Figures', description: 'Cash out a Show Pot worth 1K.', test: s => s.stats.bestCashout >= 1_000 },
    combo25: { name: 'In the Pocket', description: 'Reach a 25-note combo.', test: s => s.stats.bestCombo >= 25 },
    combo100: { name: 'Unbroken Set', description: 'Reach a 100-note combo.', test: s => s.stats.bestCombo >= 100 },
    perfect100: { name: 'Precision Player', description: 'Land 100 lifetime PERFECT hits.', test: s => s.stats.perfectHits >= 100 },
    rank4: { name: 'Bright Lights', description: 'Reach the Neon Strip.', test: s => s.bestVenueEver >= 4 },
    firstPrestige: { name: 'Sold Out', description: 'Sell the casino once.', test: s => s.stats.prestiges >= 1 },
    encore5: { name: 'One More Song', description: 'Accept 5 Encores.', test: s => s.stats.encores >= 5 },
    billionaire: { name: 'Billion-Chip Club', description: 'Earn 1B lifetime chips.', test: s => s.stats.lifetimeChipsEarned >= 1_000_000_000 },
    contract20: { name: 'Touring Act', description: 'Complete 20 Show Contracts.', test: s => s.stats.completedContracts >= 20 }
};

function createBuildingState() {
    return Object.fromEntries(BUILDING_ORDER.map(type => [type, { amount: 0 }]));
}

function createFameUpgradeState() {
    const result = {};
    for (const branch of Object.values(FAME_BRANCHES)) {
        for (const upgrade of branch.upgrades) result[upgrade.id] = 0;
    }
    return result;
}

function createDefaultShow() {
    return {
        active: false,
        paused: false,
        awaitingEncore: false,
        wager: 0,
        pot: 0,
        lives: 3,
        maxLives: 3,
        combo: 0,
        hits: 0,
        perfects: 0,
        greats: 0,
        goods: 0,
        jackpotGained: 0,
        encoreLevel: 0,
        roundStart: { hits: 0, perfects: 0, pot: 0 },
        roundTarget: 0,
        contractId: 'openMic',
        notes: [],
        nextHitTime: 0,
        beatIndex: 0,
        lastLane: -1,
        laneBusyUntil: Array(LANE_COUNT).fill(0),
        startedAt: 0,
        contractRoundsCompleted: 0
    };
}

function createDefaultState() {
    return {
        version: SAVE_VERSION,
        chips: 0,
        baseIncome: 1,
        venueIndex: 0,
        bestVenueEver: 0,
        buyMode: '1',
        selectedContractId: 'openMic',
        buildings: createBuildingState(),
        managers: {},
        tempo: {
            baseSpeed: 300,
            activeLevel: 0,
            unlockedLevel: 0,
            speedPerLevel: 12,
            payoutPerLevel: 0.08,
            baseCost: 250,
            costGrowth: 1.52
        },
        jackpot: 0,
        jackpotMax: 100,
        feverActive: false,
        feverRemaining: 0,
        fame: {
            unspent: 0,
            total: 0,
            upgrades: createFameUpgradeState()
        },
        achievements: {},
        stats: {
            runChipsEarned: 0,
            lifetimeChipsEarned: 0,
            runBestCombo: 0,
            runBestCashout: 0,
            runCompletedContracts: 0,
            runEncores: 0,
            runPerfectHits: 0,
            bestCombo: 0,
            bestCashout: 0,
            largestProfit: 0,
            totalShows: 0,
            totalCashouts: 0,
            busts: 0,
            completedContracts: 0,
            contractCompletions: {},
            encores: 0,
            perfectHits: 0,
            greatHits: 0,
            goodHits: 0,
            totalHits: 0,
            highestHeat: 0,
            prestiges: 0
        },
        settings: {
            audio: true,
            volume: 0.28
        },
        show: createDefaultShow(),
        runtime: {
            lastTick: performance.now(),
            saveTimer: 0,
            uiTimer: 0,
            sceneDirty: true,
            contentDirty: true,
            visibilityPaused: false,
            visibilityPausedAt: 0
        }
    };
}

let state = createDefaultState();
let suppressSave = false;
let persistenceAvailable = true;
let noteIdCounter = 0;
let groupIdCounter = 0;

/* =========================================================
   DOM REFERENCES
========================================================= */

const ui = {
    gameShell: document.getElementById('gameShell'),
    screenFlash: document.getElementById('screenFlash'),
    toastStack: document.getElementById('toastStack'),
    topVenue: document.getElementById('topVenue'),
    topFame: document.getElementById('topFame'),
    topChips: document.getElementById('topChips'),

    rankBadge: document.getElementById('rankBadge'),
    casinoScene: document.getElementById('casinoScene'),
    sceneVenueName: document.getElementById('sceneVenueName'),
    sceneWindows: document.getElementById('sceneWindows'),
    sceneFloor: document.getElementById('sceneFloor'),
    sceneCrowd: document.getElementById('sceneCrowd'),
    chips: document.getElementById('chips'),
    idleIncome: document.getElementById('idleIncome'),
    baseCasinoIncome: document.getElementById('baseCasinoIncome'),
    catchUpDisplay: document.getElementById('catchUpDisplay'),
    achievementBonusDisplay: document.getElementById('achievementBonusDisplay'),
    venueName: document.getElementById('venueName'),
    venueNumber: document.getElementById('venueNumber'),
    venueDescription: document.getElementById('venueDescription'),
    objectiveList: document.getElementById('objectiveList'),
    expandVenueBtn: document.getElementById('expandVenueBtn'),
    expandVenueLabel: document.getElementById('expandVenueLabel'),
    expandVenueCost: document.getElementById('expandVenueCost'),
    buildingList: document.getElementById('buildingList'),
    buyModeRow: document.getElementById('buyModeRow'),
    managerCount: document.getElementById('managerCount'),
    fameAvailable: document.getElementById('fameAvailable'),
    achievementCount: document.getElementById('achievementCount'),
    prestigeReward: document.getElementById('prestigeReward'),
    prestigeRequirementText: document.getElementById('prestigeRequirementText'),
    prestigeBtn: document.getElementById('prestigeBtn'),

    jackpotText: document.getElementById('jackpotText'),
    jackpotFill: document.getElementById('jackpotFill'),
    feverBtn: document.getElementById('feverBtn'),
    livesRow: document.getElementById('livesRow'),
    showStatus: document.getElementById('showStatus'),
    comboDisplay: document.getElementById('comboDisplay'),
    bestCombo: document.getElementById('bestCombo'),
    showPotDisplay: document.getElementById('showPotDisplay'),
    showProfitDisplay: document.getElementById('showProfitDisplay'),
    comboMultiplier: document.getElementById('comboMultiplier'),
    heatMultiplier: document.getElementById('heatMultiplier'),
    contractMultiplier: document.getElementById('contractMultiplier'),
    potGrowthMultiplier: document.getElementById('potGrowthMultiplier'),
    contractProgressPanel: document.getElementById('contractProgressPanel'),
    activeContractName: document.getElementById('activeContractName'),
    contractProgressText: document.getElementById('contractProgressText'),
    contractProgressFill: document.getElementById('contractProgressFill'),
    highway: document.getElementById('highway'),
    beatLine: document.getElementById('beatLine'),
    effectsLayer: document.getElementById('effectsLayer'),
    judgement: document.getElementById('judgement'),
    encoreOverlay: document.getElementById('encoreOverlay'),
    encoreSummary: document.getElementById('encoreSummary'),
    encorePot: document.getElementById('encorePot'),
    encoreRiskText: document.getElementById('encoreRiskText'),
    message: document.getElementById('message'),
    lanes: Array.from({ length: LANE_COUNT }, (_, i) => document.getElementById(`lane-${i}`)),
    targets: Array.from({ length: LANE_COUNT }, (_, i) => document.getElementById(`target-${i}`)),

    audioToggleBtn: document.getElementById('audioToggleBtn'),
    contractList: document.getElementById('contractList'),
    wagerInput: document.getElementById('wager'),
    startBtn: document.getElementById('startBtn'),
    startButtonSubtext: document.getElementById('startButtonSubtext'),
    cashOutBtn: document.getElementById('cashOutBtn'),
    tempoUpgradeBtn: document.getElementById('tempoUpgradeBtn'),
    tempoUnlockedLevel: document.getElementById('tempoUnlockedLevel'),
    tempoUpgradeCost: document.getElementById('tempoUpgradeCost'),
    tempoLevelDisplay: document.getElementById('tempoLevelDisplay'),
    tempoDownBtn: document.getElementById('tempoDownBtn'),
    tempoUpBtn: document.getElementById('tempoUpBtn'),
    tempoSpeedDisplay: document.getElementById('tempoSpeedDisplay'),
    tempoBpmDisplay: document.getElementById('tempoBpmDisplay'),
    tempoPayoutDisplay: document.getElementById('tempoPayoutDisplay'),
    bestCashoutStat: document.getElementById('bestCashoutStat'),
    contractsStat: document.getElementById('contractsStat'),
    perfectHitsStat: document.getElementById('perfectHitsStat'),
    encoresStat: document.getElementById('encoresStat'),

    openManagersBtn: document.getElementById('openManagersBtn'),
    openFameBtn: document.getElementById('openFameBtn'),
    openStatsBtn: document.getElementById('openStatsBtn'),
    managersModal: document.getElementById('managersModal'),
    managerList: document.getElementById('managerList'),
    fameModal: document.getElementById('fameModal'),
    modalFameAvailable: document.getElementById('modalFameAvailable'),
    fameTree: document.getElementById('fameTree'),
    statsModal: document.getElementById('statsModal'),
    careerStats: document.getElementById('careerStats'),
    achievementList: document.getElementById('achievementList'),
    resetModal: document.getElementById('resetModal'),
    resetSaveBtn: document.getElementById('resetSaveBtn'),
    confirmResetBtn: document.getElementById('confirmResetBtn'),
    exportSaveBtn: document.getElementById('exportSaveBtn'),
    importSaveBtn: document.getElementById('importSaveBtn'),
    encoreCashOutBtn: document.getElementById('encoreCashOutBtn'),
    acceptEncoreBtn: document.getElementById('acceptEncoreBtn'),

    casinoPanel: document.getElementById('casinoPanel'),
    rhythmStage: document.getElementById('rhythmStage'),
    showControlPanel: document.getElementById('showControlPanel'),
    mobileNav: document.getElementById('mobileNav'),
    mobilePlayDock: document.getElementById('mobilePlayDock'),
    mobileDockStatus: document.getElementById('mobileDockStatus'),
    mobileDockValue: document.getElementById('mobileDockValue'),
    mobileIdleActions: document.getElementById('mobileIdleActions'),
    mobileLiveActions: document.getElementById('mobileLiveActions'),
    mobileEncoreActions: document.getElementById('mobileEncoreActions'),
    mobileLaneControls: document.getElementById('mobileLaneControls'),
    mobileSetupBtn: document.getElementById('mobileSetupBtn'),
    mobileStartBtn: document.getElementById('mobileStartBtn'),
    mobileFeverBtn: document.getElementById('mobileFeverBtn'),
    mobileCashOutBtn: document.getElementById('mobileCashOutBtn'),
    mobileEncoreCashOutBtn: document.getElementById('mobileEncoreCashOutBtn'),
    mobileAcceptEncoreBtn: document.getElementById('mobileAcceptEncoreBtn'),
    mobileLaneButtons: Array.from(document.querySelectorAll('[data-mobile-lane]'))
};

const buildingRefs = new Map();
const contractRefs = new Map();

/* =========================================================
   UTILITIES
========================================================= */

function isMobileLayout() {
    return window.matchMedia('(max-width: 850px)').matches;
}

function refreshHighwayMetrics() {
    if (!ui.highway || !ui.targets[0]) return;
    const target = ui.targets[0];
    const highwayHeight = ui.highway.clientHeight || 610;
    TARGET_CENTER_Y = target.offsetTop + target.offsetHeight / 2;
    MISS_Y = Math.max(TARGET_CENTER_Y + 30, highwayHeight - 22);
}

function scrollToGameSection(element, behavior = 'smooth') {
    if (!element) return;
    element.scrollIntoView({ behavior, block: 'start' });
}

function focusStageOnMobile() {
    if (!isMobileLayout()) return;

    window.setTimeout(() => {
        refreshHighwayMetrics();
        const dockRect = ui.mobilePlayDock.getBoundingClientRect();
        const highwayRect = ui.highway.getBoundingClientRect();
        const visibleBottom = dockRect.top - 8;
        const nextScrollTop = Math.max(0, window.scrollY + highwayRect.bottom - visibleBottom);
        setActiveMobileNav('rhythmStage');
        window.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
    }, 90);
}

function setActiveMobileNav(targetId) {
    if (!ui.mobileNav) return;
    for (const button of ui.mobileNav.querySelectorAll('[data-scroll-target]')) {
        button.classList.toggle('active', button.dataset.scrollTarget === targetId);
    }
}

function updateMobileUI() {
    if (!ui.mobilePlayDock) return;

    const active = state.show.active;
    const encore = active && state.show.awaitingEncore;
    const contract = getCurrentContract();
    const wagerValue = Number.parseInt(ui.wagerInput.value, 10);
    const invalidWager = !Number.isFinite(wagerValue) || wagerValue <= 0 || wagerValue > state.chips;
    const canStart = !active && !invalidWager && state.tempo.activeLevel >= contract.minTempo;

    document.body.classList.toggle('mobile-show-active', active);
    ui.mobileIdleActions.classList.toggle('hidden', active);
    ui.mobileLiveActions.classList.toggle('hidden', !active || encore);
    ui.mobileEncoreActions.classList.toggle('hidden', !encore);
    ui.mobileLaneControls.classList.toggle('hidden', !active || encore || state.show.paused);

    if (encore) {
        ui.mobileDockStatus.textContent = 'ENCORE DECISION';
        ui.mobileDockValue.textContent = `${formatNumber(state.show.pot)} POT`;
    } else if (active) {
        ui.mobileDockStatus.textContent = `${contract.name.toUpperCase()} · ${state.show.lives} LIFE${state.show.lives === 1 ? '' : 'S'}`;
        ui.mobileDockValue.textContent = `${formatNumber(state.show.pot)} POT`;
    } else {
        ui.mobileDockStatus.textContent = `${contract.name.toUpperCase()} · TEMPO ${contract.minTempo}+`;
        ui.mobileDockValue.textContent = `${formatNumber(state.chips)} CHIPS`;
    }

    ui.mobileStartBtn.disabled = !canStart;
    ui.mobileStartBtn.textContent = `START ${contract.name.toUpperCase()}`;
    ui.mobileCashOutBtn.disabled = !active || encore;
    ui.mobileFeverBtn.disabled = ui.feverBtn.disabled;
    ui.mobileFeverBtn.textContent = state.feverActive
        ? `FEVER ${state.feverRemaining.toFixed(1)}s`
        : state.jackpot >= state.jackpotMax
            ? 'ACTIVATE FEVER'
            : `FEVER ${Math.floor(clamp(state.jackpot / state.jackpotMax, 0, 1) * 100)}%`;
}

function pauseShowForVisibility() {
    if (!state.show.active || state.show.paused || state.runtime.visibilityPaused) return;
    state.runtime.visibilityPaused = true;
    state.runtime.visibilityPausedAt = getNowSeconds();
    state.show.paused = true;
    if (audioEngine.context?.state === 'running') audioEngine.context.suspend().catch(() => {});
}

function resumeShowFromVisibility() {
    if (!state.runtime.visibilityPaused || !state.show.active) return;
    const now = getNowSeconds();
    const shift = Math.max(0, now - state.runtime.visibilityPausedAt);

    state.show.nextHitTime += shift;
    state.show.startedAt += shift;
    state.show.laneBusyUntil = state.show.laneBusyUntil.map(time => time > 0 ? time + shift : 0);
    for (const note of state.show.notes) {
        note.hitTime += shift;
        note.spawnTime += shift;
    }

    state.runtime.visibilityPaused = false;
    state.runtime.visibilityPausedAt = 0;
    state.show.paused = false;
    audioEngine.ensure();
    showMessage('Show resumed after the interruption.', 'win');
    updateUI(true);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function cloneSerializable(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

function formatNumber(value) {
    if (!Number.isFinite(value)) return '∞';
    if (value < 0) return `-${formatNumber(Math.abs(value))}`;
    if (value < 1_000) {
        const decimals = value < 10 ? 1 : 0;
        return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
    }

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const tier = Math.floor(Math.log10(value) / 3);
    if (tier >= suffixes.length) return value.toExponential(2);

    const scaled = value / (1000 ** tier);
    const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return `${scaled.toFixed(digits)}${suffixes[tier]}`;
}

function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
}

function getNowSeconds() {
    return performance.now() / 1000;
}

function showMessage(text, type = '') {
    ui.message.textContent = text;
    ui.message.className = `rhythm-message ${type}`.trim();
}

function showToast(text, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`.trim();
    toast.textContent = text;
    ui.toastStack.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3900);
}

function flashScreen(color) {
    ui.screenFlash.style.setProperty('--screen-flash-color', color);
    ui.screenFlash.classList.remove('fire');
    void ui.screenFlash.offsetWidth;
    ui.screenFlash.classList.add('fire');
}

function triggerShake(strength = 'small') {
    ui.gameShell.classList.remove('shake-small', 'shake-medium', 'shake-big');
    void ui.gameShell.offsetWidth;
    ui.gameShell.classList.add(`shake-${strength}`);
}

function showJudgement(text, className) {
    ui.judgement.textContent = text;
    ui.judgement.className = '';
    void ui.judgement.offsetWidth;
    ui.judgement.classList.add(className, 'show');
}

function pulseBeatLine() {
    ui.beatLine.classList.remove('pulse');
    void ui.beatLine.offsetWidth;
    ui.beatLine.classList.add('pulse');
}

function addChips(amount, countAsEarned = true) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.chips += amount;
    if (countAsEarned) {
        state.stats.runChipsEarned += amount;
        state.stats.lifetimeChipsEarned += amount;
    }
}

function spendChips(amount) {
    if (!Number.isFinite(amount) || amount < 0 || state.chips + 1e-9 < amount) return false;
    state.chips -= amount;
    if (state.chips < 0.000001) state.chips = 0;
    return true;
}

function getFameUpgradeLevel(id) {
    return state.fame.upgrades[id] ?? 0;
}

function getUnlockedAchievementCount() {
    return Object.keys(state.achievements).filter(id => state.achievements[id]).length;
}

function getAchievementMultiplier() {
    return 1 + getUnlockedAchievementCount() * 0.01;
}

function getCatchUpMultiplier() {
    return state.venueIndex < state.bestVenueEver ? 5 : 1;
}

function getCurrentVenue() {
    return VENUES[state.venueIndex];
}

function getCurrentContract() {
    return CONTRACTS[state.show.active ? state.show.contractId : state.selectedContractId] ?? CONTRACTS.openMic;
}

function getBuildingAmount(type) {
    return state.buildings[type]?.amount ?? 0;
}

function isBuildingUnlocked(type) {
    return BUILDINGS[type].unlockVenue <= state.venueIndex;
}

function isContractUnlocked(id) {
    return CONTRACTS[id].unlockVenue <= state.venueIndex;
}

/* =========================================================
   PROCEDURAL AUDIO ENGINE
========================================================= */

const audioEngine = {
    context: null,
    master: null,
    noiseBuffer: null,

    ensure() {
        if (!state.settings.audio) return false;
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return false;

        if (!this.context) {
            this.context = new AudioCtor();
            this.master = this.context.createGain();
            this.master.gain.value = state.settings.volume;
            this.master.connect(this.context.destination);
            this.noiseBuffer = this.createNoiseBuffer();
        }

        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        this.master.gain.value = state.settings.volume;
        return true;
    },

    createNoiseBuffer() {
        const length = Math.floor(this.context.sampleRate * 0.08);
        const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
        return buffer;
    },

    perfToAudioTime(perfSeconds) {
        if (!this.context) return 0;
        return this.context.currentTime + (perfSeconds - getNowSeconds());
    },

    scheduleBeat(perfTime, beatIndex, heat) {
        if (!this.ensure()) return;
        const when = Math.max(this.context.currentTime + 0.01, this.perfToAudioTime(perfTime));
        const accent = beatIndex % 4 === 0;

        // Kick
        if (accent || beatIndex % 2 === 0) {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(accent ? 130 : 105, when);
            osc.frequency.exponentialRampToValueAtTime(45, when + 0.11);
            gain.gain.setValueAtTime(accent ? 0.32 : 0.18, when);
            gain.gain.exponentialRampToValueAtTime(0.001, when + 0.14);
            osc.connect(gain).connect(this.master);
            osc.start(when);
            osc.stop(when + 0.16);
        }

        // Hi-hat
        if (this.noiseBuffer) {
            const source = this.context.createBufferSource();
            const filter = this.context.createBiquadFilter();
            const gain = this.context.createGain();
            source.buffer = this.noiseBuffer;
            filter.type = 'highpass';
            filter.frequency.value = 5200 + heat * 90;
            gain.gain.setValueAtTime(0.07, when);
            gain.gain.exponentialRampToValueAtTime(0.001, when + 0.045);
            source.connect(filter).connect(gain).connect(this.master);
            source.start(when);
            source.stop(when + 0.055);
        }

        // Soft bass tone makes the procedural beat feel musical.
        if (accent) {
            const bass = this.context.createOscillator();
            const bassGain = this.context.createGain();
            const notes = [55, 65.41, 73.42, 49];
            bass.type = 'triangle';
            bass.frequency.value = notes[Math.floor(beatIndex / 4) % notes.length];
            bassGain.gain.setValueAtTime(0.065, when);
            bassGain.gain.exponentialRampToValueAtTime(0.001, when + 0.3);
            bass.connect(bassGain).connect(this.master);
            bass.start(when);
            bass.stop(when + 0.32);
        }
    },

    hit(quality, special = false) {
        if (!this.ensure()) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = special ? 'triangle' : 'sine';
        const base = quality === 'perfect' ? 880 : quality === 'great' ? 660 : 520;
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(base * 1.22, now + 0.07);
        gain.gain.setValueAtTime(special ? 0.16 : 0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.connect(gain).connect(this.master);
        osc.start(now);
        osc.stop(now + 0.12);
    },

    miss() {
        if (!this.ensure()) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(58, now + 0.18);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain).connect(this.master);
        osc.start(now);
        osc.stop(now + 0.21);
    }
};

/* =========================================================
   BUILDING ECONOMY
========================================================= */

function getMilestoneMultiplier(amount) {
    if (amount >= 200) return 13;
    if (amount >= 100) return 8;
    if (amount >= 50) return 5;
    if (amount >= 25) return 3;
    if (amount >= 10) return 2;
    return 1;
}

function getNextMilestone(amount) {
    return [10, 25, 50, 100, 200].find(target => amount < target) ?? null;
}

function getManagerProductionMultiplier(type) {
    if (type === 'busker' && state.managers.buskerManager === 'producer') return 2;
    if (type === 'slots' && state.managers.slotsManager === 'loose') return 1.75;
    if (type === 'blackjack' && state.managers.blackjackManager === 'pit') return 1.75;
    if (type === 'vip' && state.managers.vipManager === 'host') return 2;
    if (type === 'highRoller' && state.managers.highRollerManager === 'whale') return 1.75;
    if (type === 'corporate' && state.managers.corporateManager === 'board') return 1.75;
    return 1;
}

function getGlobalBuildingMultiplier(type) {
    const corporateBoost = Math.min(0.5, getBuildingAmount('corporate') * 0.01);
    const empireBoost = Math.min(0.6, getBuildingAmount('empire') * 0.03);
    const managerSynergy = state.managers.corporateManager === 'synergy' && type !== 'corporate' && type !== 'empire' ? 0.15 : 0;
    return 1 + corporateBoost + empireBoost + managerSynergy;
}

function getBuildingIncome(type) {
    const def = BUILDINGS[type];
    const amount = getBuildingAmount(type);
    if (amount <= 0) return 0;

    const milestone = getMilestoneMultiplier(amount);
    const fameMilestone = 1 + getFameUpgradeLevel('mogulMilestones') * 0.05;
    return amount
        * def.baseIncome
        * milestone
        * fameMilestone
        * getManagerProductionMultiplier(type)
        * getGlobalBuildingMultiplier(type);
}

function getBaseCasinoIncome() {
    let total = state.baseIncome;
    for (const type of BUILDING_ORDER) total += getBuildingIncome(type);
    return total;
}

function getPermanentCasinoMultiplier() {
    const fame = 1 + getFameUpgradeLevel('mogulIncome') * 0.15;
    return fame * getAchievementMultiplier();
}

function getSustainableCasinoIncome() {
    return getBaseCasinoIncome() * getPermanentCasinoMultiplier();
}

function getIdleIncomePerSecond({ includeFever = true, includeCatchUp = true } = {}) {
    const fever = includeFever && state.feverActive ? 3 : 1;
    const catchUp = includeCatchUp ? getCatchUpMultiplier() : 1;
    return getSustainableCasinoIncome() * fever * catchUp;
}

function getBulkCost(type, quantity) {
    if (!Number.isFinite(quantity) || quantity <= 0) return 0;
    const def = BUILDINGS[type];
    const owned = getBuildingAmount(type);
    const r = def.costGrowth;
    const first = def.baseCost * (r ** owned);
    const total = r === 1 ? first * quantity : first * ((r ** quantity) - 1) / (r - 1);
    return Math.floor(total);
}

function getMaxAffordable(type) {
    const def = BUILDINGS[type];
    const owned = getBuildingAmount(type);
    const first = def.baseCost * (def.costGrowth ** owned);
    if (first > state.chips) return 0;

    const ratio = 1 + state.chips * (def.costGrowth - 1) / first;
    let quantity = Math.floor(Math.log(ratio) / Math.log(def.costGrowth));
    quantity = clamp(quantity, 0, 100_000);

    while (quantity < 100_000 && getBulkCost(type, quantity + 1) <= state.chips) quantity++;
    while (quantity > 0 && getBulkCost(type, quantity) > state.chips) quantity--;
    return quantity;
}

function getPurchaseQuantity(type) {
    if (state.buyMode === '10') return 10;
    if (state.buyMode === 'max') return getMaxAffordable(type);
    return 1;
}

function buyBuilding(type) {
    if (!isBuildingUnlocked(type)) return;
    const quantity = getPurchaseQuantity(type);
    if (quantity <= 0) {
        showMessage(`You cannot afford another ${BUILDINGS[type].shortName}.`, 'lose');
        return;
    }

    const cost = getBulkCost(type, quantity);
    if (!spendChips(cost)) {
        showMessage(`You need ${formatNumber(cost)} chips.`, 'lose');
        return;
    }

    const before = getBuildingAmount(type);
    state.buildings[type].amount += quantity;
    const after = getBuildingAmount(type);
    const milestone = [10, 25, 50, 100, 200].find(value => before < value && after >= value);

    if (milestone) {
        showJudgement(`${BUILDINGS[type].shortName.toUpperCase()} ×${getMilestoneMultiplier(after)}`, 'milestone');
        flashScreen('#ffd86b');
        triggerShake('medium');
    }

    showMessage(`Bought ${quantity} ${BUILDINGS[type].shortName} for ${formatNumber(cost)} chips.`, 'win');
    state.runtime.sceneDirty = true;
    checkAchievements();
    updateUI(true);
}

/* =========================================================
   VENUES / RANKS
========================================================= */

function getObjectiveCurrent(objective) {
    switch (objective.type) {
        case 'building': return getBuildingAmount(objective.key);
        case 'bestCombo': return state.stats.runBestCombo;
        case 'bestCashout': return state.stats.runBestCashout;
        case 'sustainableIncome': return getSustainableCasinoIncome();
        case 'completedContracts': return state.stats.runCompletedContracts;
        case 'perfectHits': return state.stats.runPerfectHits;
        case 'encores': return state.stats.runEncores;
        case 'prestiges': return state.stats.prestiges;
        default: return 0;
    }
}

function isObjectiveComplete(objective) {
    return getObjectiveCurrent(objective) >= objective.target;
}

function areVenueObjectivesComplete() {
    return getCurrentVenue().objectives.every(isObjectiveComplete);
}

function expandVenue() {
    const venue = getCurrentVenue();
    if (venue.expansionCost === null) return;
    if (!areVenueObjectivesComplete()) {
        showMessage('Complete every venue objective before expanding.', 'lose');
        return;
    }
    if (!spendChips(venue.expansionCost)) {
        showMessage(`Expansion requires ${formatNumber(venue.expansionCost)} chips.`, 'lose');
        return;
    }

    state.venueIndex++;
    state.bestVenueEver = Math.max(state.bestVenueEver, state.venueIndex);
    state.runtime.contentDirty = true;
    state.runtime.sceneDirty = true;

    const newVenue = getCurrentVenue();
    showJudgement(`RANK ${state.venueIndex + 1}`, 'milestone');
    showMessage(`${newVenue.name} unlocked! New buildings, contracts and note types are available.`, 'win');
    showToast(`${newVenue.name} unlocked`, 'gold');
    flashScreen('#ffd86b');
    triggerShake('big');
    checkAchievements();
    renderContent();
    updateUI(true);
}

/* =========================================================
   PRESTIGE + FAME
========================================================= */

function getPrestigeStatus() {
    const requirements = [
        { current: state.venueIndex, target: 3, label: 'Reach the Luxury Resort' },
        { current: state.stats.runChipsEarned, target: 100_000_000, label: 'Earn 100M chips this run' },
        { current: state.stats.runCompletedContracts, target: 5, label: 'Complete 5 contracts this run' },
        { current: state.stats.runBestCombo, target: 30, label: 'Reach a 30 combo this run' }
    ];
    return { requirements, ready: requirements.every(req => req.current >= req.target) };
}

function calculatePrestigeFame() {
    const status = getPrestigeStatus();
    if (!status.ready) return 0;
    const wealthBonus = Math.max(0, Math.floor(Math.log10(Math.max(1, state.stats.runChipsEarned / 100_000_000)) * 2));
    const venueBonus = Math.max(0, state.venueIndex - 3);
    return 1 + wealthBonus + venueBonus;
}

function performPrestige() {
    const gain = calculatePrestigeFame();
    if (gain <= 0) return;

    const confirmed = window.confirm(
        `Sell the casino for +${gain} Fame?\n\n` +
        'You lose chips, buildings, managers, venues, tempo and Jackpot progress. Career stats, achievements, Fame upgrades and your best venue are permanent.'
    );
    if (!confirmed) return;

    if (state.show.active) bustShow('The casino was sold during a performance.');

    const preserved = {
        bestVenueEver: state.bestVenueEver,
        fame: cloneSerializable(state.fame),
        achievements: cloneSerializable(state.achievements),
        stats: cloneSerializable(state.stats),
        settings: cloneSerializable(state.settings)
    };

    preserved.fame.unspent += gain;
    preserved.fame.total += gain;
    preserved.stats.prestiges += 1;
    preserved.stats.runChipsEarned = 0;
    preserved.stats.runBestCombo = 0;
    preserved.stats.runBestCashout = 0;
    preserved.stats.runCompletedContracts = 0;
    preserved.stats.runEncores = 0;
    preserved.stats.runPerfectHits = 0;

    state = createDefaultState();
    state.bestVenueEver = preserved.bestVenueEver;
    state.fame = preserved.fame;
    state.achievements = preserved.achievements;
    state.stats = preserved.stats;
    state.settings = preserved.settings;

    const starterBuskers = getFameUpgradeLevel('mogulStarter') * 5;
    state.buildings.busker.amount = starterBuskers;
    state.runtime.contentDirty = true;
    state.runtime.sceneDirty = true;
    state.runtime.lastTick = performance.now();

    showJudgement(`+${gain} FAME`, 'milestone');
    showMessage(`Casino sold. Catch-up production is ×5 until you return to ${VENUES[state.bestVenueEver].name}.`, 'win');
    showToast(`Prestige complete · +${gain} Fame`, 'gold');
    flashScreen('#ffd86b');
    triggerShake('big');
    checkAchievements();
    renderContent();
    updateUI(true);
    saveGame();
}

function getFameUpgradeDefinition(id) {
    for (const branch of Object.values(FAME_BRANCHES)) {
        const found = branch.upgrades.find(upgrade => upgrade.id === id);
        if (found) return found;
    }
    return null;
}

function buyFameUpgrade(id) {
    const def = getFameUpgradeDefinition(id);
    if (!def) return;
    const level = getFameUpgradeLevel(id);
    if (level >= def.max) return;
    const cost = def.costs[level];
    if (state.fame.unspent < cost) return;

    state.fame.unspent -= cost;
    state.fame.upgrades[id] = level + 1;
    showToast(`${def.name} upgraded to level ${level + 1}`, 'gold');
    renderFameTree();
    updateUI(true);
    saveGame();
}

/* =========================================================
   MANAGERS
========================================================= */

function isManagerUnlocked(id) {
    const def = MANAGERS[id];
    return getBuildingAmount(def.building) >= def.amountRequired;
}

function chooseManager(id, choice) {
    const def = MANAGERS[id];
    if (!def || state.managers[id] || !isManagerUnlocked(id)) return;
    if (!def.choices[choice]) return;
    if (!spendChips(def.cost)) {
        showToast(`You need ${formatNumber(def.cost)} chips for ${def.name}.`, 'danger');
        return;
    }

    state.managers[id] = choice;
    showToast(`${def.choices[choice].name} hired`, 'gold');
    renderManagerList();
    updateUI(true);
    saveGame();
}

/* =========================================================
   RHYTHM MATH
========================================================= */

function getTempoSpeed() {
    return state.tempo.baseSpeed + state.tempo.activeLevel * state.tempo.speedPerLevel;
}

function getTempoPotMultiplier() {
    return 1 + state.tempo.activeLevel * state.tempo.payoutPerLevel;
}

function getTempoUpgradeCost() {
    return Math.floor(state.tempo.baseCost * (state.tempo.costGrowth ** state.tempo.unlockedLevel));
}

function getHeatStep() {
    if (!state.show.active) return 0;
    const contract = getCurrentContract();
    const contractHeat = contract.startingHeat ?? 0;
    return clamp(contractHeat + state.show.encoreLevel * 2 + Math.floor(state.show.combo / 10), 0, 14);
}

function getHeatSpeedMultiplier() {
    return 1 + getHeatStep() * 0.025;
}

function getHeatPotMultiplier() {
    return 1 + getHeatStep() * 0.1;
}

function getEffectiveNoteSpeed() {
    return getTempoSpeed() * getHeatSpeedMultiplier();
}

function getCurrentBpm() {
    const contract = getCurrentContract();
    return Math.round(96 + state.tempo.activeLevel * 3 + getHeatStep() * 1.5 + (contract.bpmBonus ?? 0));
}

function getNoteLeadTime() {
    return clamp((TARGET_CENTER_Y - NOTE_SPAWN_Y) / getEffectiveNoteSpeed(), 0.82, 1.95);
}

function getChartInterval() {
    const contract = getCurrentContract();
    return (60 / getCurrentBpm()) / contract.density;
}

function getComboPotMultiplier() {
    return 1 + Math.min(1.25, Math.sqrt(Math.max(0, state.show.combo)) * 0.08);
}

function getEncoreMultiplier() {
    const fameBonus = getFameUpgradeLevel('gamblerEncore') * 0.1;
    return 1 + state.show.encoreLevel * (0.5 + fameBonus);
}

function getShowBuildingPotMultiplier(quality) {
    const buskerBonus = Math.min(0.15, getBuildingAmount('busker') * 0.002);
    const highRollerBonus = Math.min(0.2, getBuildingAmount('highRoller') * 0.002);
    const blackjackBonus = (quality === 'great' || quality === 'perfect')
        ? Math.min(0.2, getBuildingAmount('blackjack') * 0.002)
        : 0;
    return 1 + buskerBonus + highRollerBonus + blackjackBonus;
}

function getManagerPotMultiplier(quality) {
    let bonus = 0;
    if (state.managers.buskerManager === 'hype') bonus += 0.1;
    if (state.managers.blackjackManager === 'dealer' && (quality === 'great' || quality === 'perfect')) bonus += 0.2;
    if (state.managers.highRollerManager === 'promoter') bonus += 0.15;
    return 1 + bonus;
}

function getPotGrowthMultiplier(quality = 'good') {
    const contract = getCurrentContract();
    const fame = 1 + getFameUpgradeLevel('performerPot') * 0.08;
    return getTempoPotMultiplier()
        * getComboPotMultiplier()
        * getHeatPotMultiplier()
        * contract.multiplier
        * getEncoreMultiplier()
        * getShowBuildingPotMultiplier(quality)
        * getManagerPotMultiplier(quality)
        * fame
        * getAchievementMultiplier();
}

function getQualityData(timeDifference) {
    if (timeDifference <= PERFECT_WINDOW) {
        return { id: 'perfect', label: 'PERFECT', rate: 0.016, jackpot: 10, color: '#ffd86b', particles: 20, shake: 'medium' };
    }
    if (timeDifference <= GREAT_WINDOW) {
        return { id: 'great', label: 'GREAT', rate: 0.01, jackpot: 4, color: '#2bdfff', particles: 14, shake: 'small' };
    }
    return { id: 'good', label: 'GOOD', rate: 0.006, jackpot: 1, color: '#19ef8b', particles: 10, shake: 'small' };
}

function getMaxLives() {
    const contract = getCurrentContract();
    return contract.lives + getFameUpgradeLevel('performerLife');
}

function getBustRefundRate() {
    let rate = getFameUpgradeLevel('gamblerInsurance') * 0.05;
    if (state.managers.vipManager === 'insurance') rate += 0.2;
    return clamp(rate, 0, 0.65);
}

function getCashoutBonusRate() {
    return Math.min(0.15, getBuildingAmount('vip') * 0.0015);
}

function getJackpotGainMultiplier() {
    const slots = 1 + Math.min(0.5, getBuildingAmount('slots') * 0.005);
    const fame = 1 + getFameUpgradeLevel('gamblerJackpot') * 0.1;
    const manager = state.managers.slotsManager === 'network' ? 1.25 : 1;
    return slots * fame * manager;
}

function getFeverDuration() {
    const rouletteBonus = Math.min(10, getBuildingAmount('roulette') * 0.2);
    const fameBonus = getFameUpgradeLevel('performerFever') * 2;
    return 10 + rouletteBonus + fameBonus;
}

/* =========================================================
   CONTRACTS / SHOW POT
========================================================= */

function getRoundProgress() {
    const contract = getCurrentContract();
    if (!state.show.active) return 0;
    if (contract.objectiveType === 'perfects') return state.show.perfects - state.show.roundStart.perfects;
    if (contract.objectiveType === 'potMultiple') return state.show.pot / Math.max(1, state.show.wager);
    return state.show.hits - state.show.roundStart.hits;
}

function getRoundTarget() {
    const contract = getCurrentContract();
    return Math.ceil(contract.target * (1 + state.show.encoreLevel * 0.4));
}

function getContractProgressRatio() {
    if (!state.show.active) return 0;
    return clamp(getRoundProgress() / Math.max(1, getRoundTarget()), 0, 1);
}

function setSelectedContract(id) {
    if (state.show.active || !CONTRACTS[id] || !isContractUnlocked(id)) return;
    state.selectedContractId = id;
    renderContractCards();
    updateUI(true);
}

function setWagerFraction(fraction) {
    if (state.show.active) return;
    const amount = Math.max(1, Math.floor(state.chips * fraction));
    ui.wagerInput.value = state.chips > 0 ? amount : 1;
}

function startShow() {
    if (state.show.active) return;
    const contract = CONTRACTS[state.selectedContractId];
    if (!contract || !isContractUnlocked(state.selectedContractId)) return;
    if (state.tempo.activeLevel < contract.minTempo) {
        showMessage(`${contract.name} requires Tempo ${contract.minTempo}.`, 'lose');
        return;
    }

    const wager = Number.parseInt(ui.wagerInput.value, 10);
    if (!Number.isFinite(wager) || wager <= 0 || wager > state.chips) {
        showMessage('Enter a valid wager that you can afford.', 'lose');
        return;
    }

    if (!spendChips(wager)) return;
    clearAllNotes();

    state.show = createDefaultShow();
    state.show.active = true;
    state.show.contractId = state.selectedContractId;
    state.show.wager = wager;
    state.show.pot = wager;
    state.show.maxLives = getMaxLives();
    state.show.lives = state.show.maxLives;
    state.show.roundTarget = getRoundTarget();
    state.show.startedAt = getNowSeconds();
    state.show.nextHitTime = getNowSeconds() + getNoteLeadTime() + 0.55;

    audioEngine.ensure();
    showJudgement('READY', 'good');
    showMessage(`${contract.name} started. Your ${formatNumber(wager)}-chip wager is now unbanked.`, 'win');
    updateUI(true);
    focusStageOnMobile();
}

function calculateHitPotGain(note, quality, isHold = false) {
    let rate = quality.rate;
    if (isHold) rate *= 2.2;
    if (note.type === 'gold') rate *= 2.8;
    if (note.type === 'recovery') rate *= 0.55;
    if (note.isChord) rate *= 1.08;
    return Math.max(0.01, state.show.wager * rate * getPotGrowthMultiplier(quality.id));
}

function addJackpot(baseAmount) {
    if (state.feverActive) return;
    const amount = baseAmount * getJackpotGainMultiplier();
    const previous = state.jackpot;
    state.jackpot = Math.min(state.jackpotMax, state.jackpot + amount);
    state.show.jackpotGained += amount;

    if (previous < state.jackpotMax && state.jackpot >= state.jackpotMax) {
        showJudgement('JACKPOT READY', 'milestone');
        showToast('Jackpot full · Fever Time is ready', 'gold');
        flashScreen('#ffd86b');
    }
}

function activateFever() {
    if (state.feverActive || state.jackpot < state.jackpotMax) return;
    state.jackpot = 0;
    state.feverActive = true;
    state.feverRemaining = getFeverDuration();
    showJudgement('FEVER TIME', 'milestone');
    showMessage(`Fever Time! Casino income ×3 for ${state.feverRemaining.toFixed(1)} seconds.`, 'win');
    triggerShake('big');
    flashScreen('#ffd86b');
    updateUI(true);
}

function resolveSuccessfulNote(note, quality, isHold = false) {
    const previousBestCombo = state.stats.bestCombo;
    state.show.combo++;
    state.show.hits++;
    state.stats.totalHits++;
    state.stats.bestCombo = Math.max(state.stats.bestCombo, state.show.combo);
    state.stats.runBestCombo = Math.max(state.stats.runBestCombo, state.show.combo);
    state.stats.highestHeat = Math.max(state.stats.highestHeat, getHeatStep());

    if (quality.id === 'perfect') {
        state.show.perfects++;
        state.stats.perfectHits++;
        state.stats.runPerfectHits++;
    } else if (quality.id === 'great') {
        state.show.greats++;
        state.stats.greatHits++;
    } else {
        state.show.goods++;
        state.stats.goodHits++;
    }

    const potGain = calculateHitPotGain(note, quality, isHold);
    state.show.pot += potGain;

    let jackpot = quality.jackpot;
    if (note.type === 'gold') jackpot += 15;
    addJackpot(jackpot);

    if (note.type === 'recovery') {
        state.show.lives = Math.min(state.show.maxLives, state.show.lives + 1);
        showToast('Recovery Note · +1 life', 'gold');
    }

    playSuccessEffects(note.lane, quality, potGain, note.type === 'gold' ? 'GOLD' : isHold ? 'HOLD COMPLETE' : quality.label);
    audioEngine.hit(quality.id, note.type !== 'normal');

    if (state.show.combo > previousBestCombo) {
        if (state.show.combo >= 10 && state.show.combo % 10 === 0) showJudgement('NEW BEST', 'milestone');
    } else if (state.show.combo % 10 === 0) {
        showJudgement(`${state.show.combo} COMBO`, 'milestone');
    }

    checkAchievements();
    checkContractCompletion();
    updateUI(true);
}

function checkContractCompletion() {
    if (!state.show.active || state.show.paused) return;
    if (getRoundProgress() + 1e-9 < getRoundTarget()) return;

    const contract = getCurrentContract();
    const completionBonus = state.show.wager * 0.05 * contract.multiplier * getEncoreMultiplier();
    state.show.pot += completionBonus;
    state.show.paused = true;
    state.show.awaitingEncore = true;
    state.show.contractRoundsCompleted++;
    state.stats.completedContracts++;
    state.stats.runCompletedContracts++;
    state.stats.contractCompletions[contract.name] = (state.stats.contractCompletions[contract.name] ?? 0) + 1;
    clearAllNotes();

    ui.encoreOverlay.classList.remove('hidden');
    ui.encorePot.textContent = formatNumber(state.show.pot);
    ui.encoreSummary.textContent = `${contract.name} is complete. Bank the pot now, or accept a harder follow-up set.`;
    ui.encoreRiskText.textContent = `Heat +2 · target +40% · Encore growth +${Math.round((0.5 + getFameUpgradeLevel('gamblerEncore') * 0.1) * 100)}%`;

    showJudgement('CONTRACT COMPLETE', 'milestone');
    showMessage(`Contract complete. ${formatNumber(completionBonus)} chips were added to the unbanked pot.`, 'win');
    triggerShake('medium');
    flashScreen('#2bdfff');
    checkAchievements();
    updateUI(true);
}

function acceptEncore() {
    if (!state.show.active || !state.show.awaitingEncore) return;
    state.show.encoreLevel++;
    state.stats.encores++;
    state.stats.runEncores++;
    state.show.roundStart = {
        hits: state.show.hits,
        perfects: state.show.perfects,
        pot: state.show.pot
    };
    state.show.roundTarget = getRoundTarget();
    state.show.paused = false;
    state.show.awaitingEncore = false;
    state.show.nextHitTime = getNowSeconds() + getNoteLeadTime() + 0.45;
    state.show.beatIndex = 0;
    state.show.lives = Math.min(state.show.maxLives, state.show.lives + 1);
    ui.encoreOverlay.classList.add('hidden');

    showJudgement(`ENCORE ${state.show.encoreLevel}`, 'milestone');
    showMessage(`Encore accepted. Heat rises immediately, but Pot growth is much stronger.`, 'win');
    triggerShake('big');
    flashScreen('#ff3c70');
    checkAchievements();
    updateUI(true);
}

function cashOutShow() {
    if (!state.show.active) return;

    const cashoutBonus = state.show.pot * getCashoutBonusRate();
    const finalPot = state.show.pot + cashoutBonus;
    const profit = Math.max(0, finalPot - state.show.wager);

    addChips(finalPot, false);
    state.stats.runChipsEarned += profit;
    state.stats.lifetimeChipsEarned += profit;
    state.stats.totalShows++;
    state.stats.totalCashouts++;
    state.stats.bestCashout = Math.max(state.stats.bestCashout, finalPot);
    state.stats.runBestCashout = Math.max(state.stats.runBestCashout, finalPot);
    state.stats.largestProfit = Math.max(state.stats.largestProfit, profit);

    endShowState();
    showJudgement('CASHED OUT', 'milestone');
    showMessage(`Banked ${formatNumber(finalPot)} chips (${formatNumber(profit)} profit).`, 'win');
    showToast(`Show Pot banked · ${formatNumber(finalPot)}`, 'gold');
    triggerShake('small');
    flashScreen('#ffd86b');
    checkAchievements();
    updateUI(true);
}

function bustShow(reason) {
    if (!state.show.active) return;
    const lostPot = state.show.pot;
    const refund = state.show.wager * getBustRefundRate();
    if (refund > 0) addChips(refund, false);

    state.stats.totalShows++;
    state.stats.busts++;
    endShowState();

    audioEngine.miss();
    showJudgement('BUST', 'miss');
    showMessage(`${reason} The ${formatNumber(lostPot)}-chip Show Pot was lost${refund > 0 ? `, but insurance refunded ${formatNumber(refund)}` : ''}.`, 'lose');
    triggerShake('big');
    flashScreen('#ff3c70');
    updateUI(true);
}

function endShowState() {
    clearAllNotes();
    state.show = createDefaultShow();
    ui.encoreOverlay.classList.add('hidden');
}

function loseLife(reason, groupId = null) {
    if (!state.show.active || state.show.paused) return;
    if (groupId !== null) removeNoteGroup(groupId);

    state.show.combo = 0;
    state.show.lives--;
    audioEngine.miss();

    if (state.show.lives <= 0) {
        bustShow(reason);
        return;
    }

    showJudgement('MISS', 'miss');
    showMessage(`${reason} ${state.show.lives} ${state.show.lives === 1 ? 'life' : 'lives'} remaining.`, 'lose');
    triggerShake('small');
    flashScreen('#ff3c70');
    updateUI(true);
}

/* =========================================================
   BEAT-SYNCED NOTE SCHEDULER
========================================================= */

function getAvailableLanes(hitTime, excluded = []) {
    return Array.from({ length: LANE_COUNT }, (_, index) => index)
        .filter(index => !excluded.includes(index))
        .filter(index => (state.show.laneBusyUntil[index] ?? 0) <= hitTime + 0.01);
}

function chooseLane(hitTime, excluded = []) {
    const allowed = getAvailableLanes(hitTime, excluded);
    if (!allowed.length) return -1;
    const withoutLast = allowed.filter(index => index !== state.show.lastLane);
    const pool = withoutLast.length ? withoutLast : allowed;
    const lane = pool[Math.floor(Math.random() * pool.length)];
    state.show.lastLane = lane;
    return lane;
}

function scheduleUpcomingBeats(now) {
    if (!state.show.active || state.show.paused) return;

    let guard = 0;
    while (guard++ < 12) {
        const lead = getNoteLeadTime();
        if (state.show.nextHitTime - now > lead + 0.06) break;

        scheduleBeatPattern(state.show.nextHitTime, state.show.beatIndex);
        const interval = getChartInterval();
        state.show.nextHitTime += interval;
        state.show.beatIndex++;
    }
}

function scheduleBeatPattern(hitTime, beatIndex) {
    const heat = getHeatStep();
    const contract = getCurrentContract();
    audioEngine.scheduleBeat(hitTime, beatIndex, heat);

    const openingBeats = beatIndex < 3;
    const restChance = openingBeats ? 0 : Math.max(0.07, 0.22 - heat * 0.008 - (contract.density - 0.75) * 0.18);
    if (Math.random() < restChance) return;

    const chordChance = state.venueIndex >= 2 && heat >= 2 ? Math.min(0.16, 0.045 + heat * 0.008) : 0;
    const available = getAvailableLanes(hitTime);
    if (!available.length) return;

    const makeChord = available.length >= 2 && Math.random() < chordChance;
    const groupId = makeChord ? ++groupIdCounter : null;
    const firstLane = chooseLane(hitTime);
    if (firstLane < 0) return;

    createScheduledNote(firstLane, hitTime, groupId, makeChord);
    if (makeChord) {
        const secondLane = chooseLane(hitTime, [firstLane]);
        if (secondLane >= 0) createScheduledNote(secondLane, hitTime, groupId, true, true);
    }
}

function determineNoteType() {
    const contract = getCurrentContract();
    if (state.venueIndex >= 3 && state.show.lives < state.show.maxLives && Math.random() < 0.045) return 'recovery';
    const goldChance = state.venueIndex >= 1 ? 0.055 + (contract.goldChance ?? 0) : 0;
    if (Math.random() < goldChance) return 'gold';
    if (Math.random() < 0.2) return 'hold';
    return 'normal';
}

function createScheduledNote(lane, hitTime, groupId, isChord, forceNormal = false) {
    let type = forceNormal ? 'normal' : determineNoteType();
    if (isChord && type === 'hold') type = 'normal';

    const leadTime = getNoteLeadTime();
    const beatInterval = 60 / getCurrentBpm();
    const holdBeats = type === 'hold' ? (Math.random() < 0.65 ? 2 : 3) : 0;
    const holdDuration = holdBeats * beatInterval;
    const length = type === 'hold' ? Math.min(245, 95 + holdBeats * 52) : 0;

    if (type === 'hold') {
        state.show.laneBusyUntil[lane] = Math.max(
            state.show.laneBusyUntil[lane] ?? 0,
            hitTime + holdDuration + GOOD_WINDOW
        );
    }

    const head = document.createElement('div');
    head.id = `note-${noteIdCounter++}`;
    head.className = `note ${type === 'hold' ? '' : type} ${isChord ? 'chord' : ''}`.trim();
    head.dataset.symbol = type === 'gold' ? '★' : type === 'recovery' ? '+' : isChord ? '◆' : '';
    ui.lanes[lane].appendChild(head);

    let body = null;
    if (type === 'hold') {
        body = document.createElement('div');
        body.className = 'long-note-body';
        ui.lanes[lane].appendChild(body);
    }

    const note = {
        id: head.id,
        lane,
        type,
        groupId,
        isChord,
        hitTime,
        spawnTime: hitTime - leadTime,
        leadTime,
        holdDuration,
        holdElapsed: 0,
        length,
        hit: false,
        holding: false,
        quality: null,
        beatPulsed: false,
        head,
        body
    };

    state.show.notes.push(note);
}

function updateNotes(now, deltaTime) {
    for (let index = state.show.notes.length - 1; index >= 0; index--) {
        const note = state.show.notes[index];

        if (note.holding) {
            note.holdElapsed += deltaTime;
            const remaining = Math.max(0, 1 - note.holdElapsed / Math.max(0.01, note.holdDuration));
            note.head.style.top = `${TARGET_CENTER_Y - 12}px`;
            if (note.body) {
                const currentLength = note.length * remaining;
                note.body.style.top = `${TARGET_CENTER_Y - currentLength}px`;
                note.body.style.height = `${currentLength}px`;
            }

            if (note.holdElapsed >= note.holdDuration) {
                const quality = note.quality;
                removeNoteAt(index);
                resolveSuccessfulNote(note, quality, true);
            }
            continue;
        }

        const progress = (now - note.spawnTime) / Math.max(0.01, note.leadTime);
        let y;
        if (progress <= 1) {
            y = NOTE_SPAWN_Y + (TARGET_CENTER_Y - NOTE_SPAWN_Y) * progress;
        } else {
            const overdueProgress = (now - note.hitTime) / GOOD_WINDOW;
            y = TARGET_CENTER_Y + (MISS_Y - TARGET_CENTER_Y) * overdueProgress;
        }

        note.head.style.top = `${y - 12}px`;
        if (note.body) {
            note.body.style.top = `${y - note.length}px`;
            note.body.style.height = `${note.length}px`;
        }

        if (!note.beatPulsed && now >= note.hitTime) {
            note.beatPulsed = true;
            pulseBeatLine();
        }

        if (!note.hit && now > note.hitTime + GOOD_WINDOW) {
            const groupId = note.groupId;
            removeNoteAt(index);
            loseLife('Note missed.', groupId);
            // loseLife can remove the rest of a chord group and mutate the
            // note array, so stop this frame and resume safely next frame.
            break;
        }
    }
}

function removeNoteAt(index) {
    const note = state.show.notes[index];
    if (!note) return;
    note.head?.remove();
    note.body?.remove();
    if (note.holding) ui.targets[note.lane].classList.remove('holding');
    state.show.notes.splice(index, 1);
}

function removeNoteGroup(groupId) {
    if (groupId === null) return;
    for (let index = state.show.notes.length - 1; index >= 0; index--) {
        if (state.show.notes[index].groupId === groupId) removeNoteAt(index);
    }
}

function clearAllNotes() {
    if (!state.show?.notes) return;
    for (const note of state.show.notes) {
        note.head?.remove();
        note.body?.remove();
    }
    state.show.notes.length = 0;
    state.show.laneBusyUntil = Array(LANE_COUNT).fill(0);
    ui.targets.forEach(target => target.classList.remove('holding', 'active'));
}

function handleLanePress(lane) {
    if (!state.show.active || state.show.paused) return;
    ui.targets[lane].classList.add('active');
    window.setTimeout(() => ui.targets[lane].classList.remove('active'), 100);

    const now = getNowSeconds();
    let candidateIndex = -1;
    let candidateDifference = Infinity;

    for (let index = 0; index < state.show.notes.length; index++) {
        const note = state.show.notes[index];
        if (note.lane !== lane || note.hit || note.holding) continue;
        const difference = Math.abs(now - note.hitTime);
        if (difference < candidateDifference) {
            candidateDifference = difference;
            candidateIndex = index;
        }
    }

    if (candidateIndex < 0 || candidateDifference > GOOD_WINDOW) {
        if (state.show.combo > 0) {
            state.show.combo = 0;
            showJudgement('COMBO BREAK', 'miss');
            showMessage('Empty or early input. Combo reset, but no life was lost.', 'lose');
            updateUI(true);
        }
        return;
    }

    const note = state.show.notes[candidateIndex];
    const quality = getQualityData(candidateDifference);
    note.hit = true;
    note.quality = quality;

    if (note.type === 'hold') {
        note.holding = true;
        note.holdElapsed = 0;
        note.head.classList.add('held');
        note.body?.classList.add('held');
        ui.targets[lane].classList.add('holding');
        showJudgement('HOLD', 'hold');
        audioEngine.hit(quality.id, false);
        return;
    }

    removeNoteAt(candidateIndex);
    resolveSuccessfulNote(note, quality, false);
}

function handleLaneRelease(lane) {
    if (!state.show.active || state.show.paused) return;
    const index = state.show.notes.findIndex(note => note.lane === lane && note.holding);
    if (index < 0) return;
    const note = state.show.notes[index];
    const groupId = note.groupId;
    removeNoteAt(index);
    loseLife('Hold released too early.', groupId);
}

/* =========================================================
   RHYTHM EFFECTS
========================================================= */

function flashLane(lane, color) {
    const element = ui.lanes[lane];
    element.style.setProperty('--flash-color', color);
    element.classList.remove('hit-flash');
    void element.offsetWidth;
    element.classList.add('hit-flash');
}

function spawnParticles(lane, count, color) {
    const laneWidth = ui.highway.clientWidth / LANE_COUNT;
    const originX = lane * laneWidth + laneWidth / 2;
    const originY = TARGET_CENTER_Y;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const distance = 32 + Math.random() * 76;
        particle.className = 'particle';
        particle.style.setProperty('--x', `${originX}px`);
        particle.style.setProperty('--y', `${originY}px`);
        particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * distance - 20}px`);
        particle.style.setProperty('--rotation', `${Math.random() * 280 - 140}deg`);
        particle.style.setProperty('--size', `${3 + Math.random() * 6}px`);
        particle.style.setProperty('--particle-radius', Math.random() > 0.45 ? '50%' : '2px');
        particle.style.setProperty('--particle-color', color);
        ui.effectsLayer.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
}

function showFloatingScore(lane, text, color) {
    const laneWidth = ui.highway.clientWidth / LANE_COUNT;
    const score = document.createElement('div');
    score.className = 'floating-score';
    score.textContent = text;
    score.style.setProperty('--x', `${lane * laneWidth + laneWidth / 2}px`);
    score.style.setProperty('--y', `${TARGET_CENTER_Y - 18}px`);
    score.style.setProperty('--score-color', color);
    ui.effectsLayer.appendChild(score);
    score.addEventListener('animationend', () => score.remove(), { once: true });
}

function playSuccessEffects(lane, quality, potGain, text) {
    flashLane(lane, quality.color);
    spawnParticles(lane, quality.particles, quality.color);
    showFloatingScore(lane, `POT +${formatNumber(potGain)}`, quality.color);
    showJudgement(text, quality.id);
    triggerShake(quality.shake);
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

function checkAchievements() {
    let changed = false;
    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (state.achievements[id]) continue;
        if (!achievement.test(state)) continue;
        state.achievements[id] = true;
        changed = true;
        showToast(`Achievement unlocked: ${achievement.name}`, 'gold');
    }
    if (changed) updateUI(true);
}

/* =========================================================
   RENDERING: STATIC/DYNAMIC CONTENT
========================================================= */

function renderContent() {
    renderBuildingCards();
    renderContractCards();
    state.runtime.contentDirty = false;
    state.runtime.sceneDirty = true;
}

function renderBuildingCards() {
    const visibleTypes = BUILDING_ORDER.filter(type => BUILDINGS[type].unlockVenue <= state.venueIndex + 1);
    ui.buildingList.innerHTML = '';
    buildingRefs.clear();

    for (const type of visibleTypes) {
        const def = BUILDINGS[type];
        const locked = !isBuildingUnlocked(type);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `building-card ${locked ? 'locked' : ''}`;
        button.dataset.building = type;
        button.innerHTML = `
            <span class="building-icon">${def.icon}</span>
            <span class="building-copy">
                <strong>${def.name}</strong>
                <span class="building-income">0/sec · ×1 milestone</span>
                <span class="building-milestone">${locked ? `Unlocks at ${VENUES[def.unlockVenue].name}` : def.description}</span>
            </span>
            <span class="building-side">
                <strong class="building-owned">0</strong>
                <small class="building-cost">Cost 0</small>
            </span>
        `;
        ui.buildingList.appendChild(button);
        buildingRefs.set(type, {
            button,
            income: button.querySelector('.building-income'),
            milestone: button.querySelector('.building-milestone'),
            owned: button.querySelector('.building-owned'),
            cost: button.querySelector('.building-cost')
        });
    }
}

function renderContractCards() {
    ui.contractList.innerHTML = '';
    contractRefs.clear();
    const visible = Object.entries(CONTRACTS).filter(([, contract]) => contract.unlockVenue <= state.venueIndex + 1);

    for (const [id, contract] of visible) {
        const unlocked = isContractUnlocked(id);
        const selected = state.selectedContractId === id;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `contract-card ${unlocked ? 'unlocked' : 'locked'} ${selected ? 'selected' : ''}`;
        button.dataset.contract = id;
        button.innerHTML = `
            <span class="contract-icon">${contract.icon}</span>
            <span class="contract-copy">
                <strong>${contract.name}</strong>
                <span>${unlocked ? contract.description : `Unlocks at ${VENUES[contract.unlockVenue].name}`}</span>
            </span>
            <span class="contract-side">
                <strong>×${contract.multiplier.toFixed(2)}</strong>
                <span>TEMPO ${contract.minTempo}+</span>
            </span>
        `;
        ui.contractList.appendChild(button);
        contractRefs.set(id, button);
    }
}

function renderCasinoScene() {
    if (!state.runtime.sceneDirty) return;
    state.runtime.sceneDirty = false;

    const venue = getCurrentVenue();
    ui.casinoScene.className = `casino-scene venue-${state.venueIndex}`;
    ui.sceneVenueName.textContent = venue.sceneName;

    const totalBuildings = BUILDING_ORDER.reduce((sum, type) => sum + getBuildingAmount(type), 0);
    const litWindows = clamp(Math.floor(totalBuildings / 3) + state.venueIndex * 2, 2, 24);
    ui.sceneWindows.innerHTML = Array.from({ length: 24 }, (_, index) => `<span class="scene-window ${index < litWindows ? 'lit' : ''}"></span>`).join('');

    const propTypes = BUILDING_ORDER.filter(isBuildingUnlocked);
    const props = [];
    let propIndex = 0;
    for (const type of propTypes) {
        const count = Math.min(5, Math.ceil(getBuildingAmount(type) / 10));
        const colors = ['#19ef8b', '#ff3c70', '#2bdfff', '#ffd86b', '#a98bff', '#ff8d55', '#c5f36b', '#ffffff'];
        for (let i = 0; i < count; i++) {
            const left = 5 + ((propIndex * 13.7) % 89);
            props.push(`<span class="scene-prop" style="left:${left}%;--prop-color:${colors[BUILDING_ORDER.indexOf(type)]}"></span>`);
            propIndex++;
        }
    }
    ui.sceneFloor.innerHTML = props.join('');

    const crowdCount = clamp(Math.floor(totalBuildings / 6) + state.venueIndex * 3, 1, 28);
    ui.sceneCrowd.innerHTML = Array.from({ length: crowdCount }, (_, index) => {
        const left = 2 + ((index * 17.3) % 95);
        const height = 7 + (index % 4);
        return `<span class="scene-person" style="left:${left}%;height:${height}px"></span>`;
    }).join('');
}

function renderManagerList() {
    ui.managerList.innerHTML = '';
    for (const [id, manager] of Object.entries(MANAGERS)) {
        const unlocked = isManagerUnlocked(id);
        const selected = state.managers[id] ?? null;
        const card = document.createElement('article');
        card.className = `manager-card ${unlocked ? '' : 'locked'}`;
        const choices = Object.entries(manager.choices).map(([choiceId, choice]) => {
            const isSelected = selected === choiceId;
            return `
                <button class="manager-choice ${isSelected ? 'selected' : ''}" data-manager="${id}" data-manager-choice="${choiceId}" ${selected || !unlocked ? 'disabled' : ''}>
                    <strong>${choice.name}</strong>
                    <span>${choice.effect}</span>
                </button>
            `;
        }).join('');

        card.innerHTML = `
            <div class="manager-card-heading">
                <strong>${manager.name}</strong>
                <span>${selected ? 'HIRED' : formatNumber(manager.cost)}</span>
            </div>
            <p>${unlocked ? manager.description : `Requires ${manager.amountRequired} ${BUILDINGS[manager.building].shortName}.`}</p>
            <div class="manager-choices">${choices}</div>
        `;
        ui.managerList.appendChild(card);
    }
}

function renderFameTree() {
    ui.modalFameAvailable.textContent = `${state.fame.unspent} FAME`;
    ui.fameTree.innerHTML = '';

    for (const branch of Object.values(FAME_BRANCHES)) {
        const branchElement = document.createElement('section');
        branchElement.className = 'fame-branch';
        const upgrades = branch.upgrades.map(upgrade => {
            const level = getFameUpgradeLevel(upgrade.id);
            const maxed = level >= upgrade.max;
            const cost = maxed ? null : upgrade.costs[level];
            const affordable = !maxed && state.fame.unspent >= cost;
            return `
                <button class="fame-upgrade-button ${affordable ? 'affordable' : ''} ${maxed ? 'maxed' : ''}" data-fame-upgrade="${upgrade.id}" ${maxed ? 'disabled' : ''}>
                    <strong>${upgrade.name} · ${level}/${upgrade.max}</strong>
                    <span>${upgrade.effect}</span>
                    <small>${maxed ? 'MAXED' : `${cost} FAME`}</small>
                </button>
            `;
        }).join('');
        branchElement.innerHTML = `
            <div class="fame-branch-heading"><strong>${branch.name}</strong><span>${branch.description}</span></div>
            <div class="fame-upgrade-list">${upgrades}</div>
        `;
        ui.fameTree.appendChild(branchElement);
    }
}

function renderStatsModal() {
    const stats = [
        ['Lifetime Chips', formatNumber(state.stats.lifetimeChipsEarned)],
        ['Run Chips', formatNumber(state.stats.runChipsEarned)],
        ['Best Cashout', formatNumber(state.stats.bestCashout)],
        ['Largest Profit', formatNumber(state.stats.largestProfit)],
        ['Best Combo', formatNumber(state.stats.bestCombo)],
        ['Perfect Hits', formatNumber(state.stats.perfectHits)],
        ['Contracts', formatNumber(state.stats.completedContracts)],
        ['Encores', formatNumber(state.stats.encores)],
        ['Shows Played', formatNumber(state.stats.totalShows)],
        ['Cashouts', formatNumber(state.stats.totalCashouts)],
        ['Busts', formatNumber(state.stats.busts)],
        ['Prestiges', formatNumber(state.stats.prestiges)]
    ];

    ui.careerStats.innerHTML = stats.map(([label, value]) => `<div class="career-stat"><span>${label}</span><strong>${value}</strong></div>`).join('');
    ui.achievementList.innerHTML = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => `
        <article class="achievement-card ${state.achievements[id] ? 'unlocked' : ''}">
            <strong>${state.achievements[id] ? '✓ ' : '○ '}${achievement.name}</strong>
            <span>${achievement.description}${state.achievements[id] ? ' · +1% all gains' : ''}</span>
        </article>
    `).join('');
}

/* =========================================================
   UI UPDATE
========================================================= */

function updateVenueUI() {
    const venue = getCurrentVenue();
    ui.rankBadge.textContent = `RANK ${state.venueIndex + 1}`;
    ui.venueName.textContent = venue.name;
    ui.venueNumber.textContent = `${String(state.venueIndex + 1).padStart(2, '0')} / ${String(VENUES.length).padStart(2, '0')}`;
    ui.venueDescription.textContent = venue.description;
    ui.objectiveList.innerHTML = venue.objectives.map(objective => {
        const current = getObjectiveCurrent(objective);
        const complete = current >= objective.target;
        return `
            <div class="objective-row ${complete ? 'complete' : ''}">
                <span class="objective-check">${complete ? '✓' : '○'}</span>
                <span>${objective.label}</span>
                <strong>${formatNumber(Math.min(current, objective.target))} / ${formatNumber(objective.target)}</strong>
            </div>
        `;
    }).join('');

    if (venue.expansionCost === null) {
        ui.expandVenueBtn.disabled = true;
        ui.expandVenueLabel.textContent = areVenueObjectivesComplete() ? 'EMPIRE MASTERED' : 'FINAL VENUE';
        ui.expandVenueCost.textContent = areVenueObjectivesComplete() ? 'All objectives complete' : 'Complete the final objectives';
    } else {
        const ready = areVenueObjectivesComplete() && state.chips >= venue.expansionCost;
        ui.expandVenueBtn.disabled = !ready;
        ui.expandVenueLabel.textContent = `EXPAND TO ${VENUES[state.venueIndex + 1].name.toUpperCase()}`;
        ui.expandVenueCost.textContent = `Cost: ${formatNumber(venue.expansionCost)}`;
    }
}

function updateBuildingUI() {
    for (const [type, refs] of buildingRefs) {
        const def = BUILDINGS[type];
        const locked = !isBuildingUnlocked(type);
        const quantity = locked ? 0 : getPurchaseQuantity(type);
        const displayQuantity = quantity > 0 ? quantity : 1;
        const cost = getBulkCost(type, displayQuantity);
        const affordable = !locked && quantity > 0 && state.chips >= cost;
        const amount = getBuildingAmount(type);
        const nextMilestone = getNextMilestone(amount);

        refs.button.classList.toggle('locked', locked);
        refs.button.classList.toggle('affordable', affordable);
        refs.button.disabled = locked || !affordable;
        refs.owned.textContent = amount;
        refs.cost.textContent = locked ? 'LOCKED' : `${state.buyMode === 'max' && quantity > 0 ? `${quantity} × ` : ''}${formatNumber(cost)}`;
        refs.income.textContent = `${formatNumber(getBuildingIncome(type))}/sec · ×${getMilestoneMultiplier(amount)} milestone`;
        refs.milestone.textContent = locked
            ? `Unlocks at ${VENUES[def.unlockVenue].name}`
            : nextMilestone
                ? `${def.description} Next milestone: ${nextMilestone}.`
                : `${def.description} All milestones unlocked.`;
    }

    for (const button of ui.buyModeRow.querySelectorAll('[data-buy-mode]')) {
        button.classList.toggle('selected', button.dataset.buyMode === state.buyMode);
    }
}

function updateContractUI() {
    for (const [id, button] of contractRefs) {
        button.classList.toggle('selected', state.selectedContractId === id);
        button.disabled = state.show.active || !isContractUnlocked(id);
    }

    const contract = getCurrentContract();
    ui.startButtonSubtext.textContent = `${contract.name} · ${contract.lives + getFameUpgradeLevel('performerLife')} lives · Tempo ${contract.minTempo}+`;
}

function updateShowUI() {
    const show = state.show;
    const contract = getCurrentContract();
    const active = show.active;
    const maxLives = active ? show.maxLives : getMaxLives();
    const lives = active ? show.lives : maxLives;

    ui.livesRow.innerHTML = Array.from({ length: maxLives }, (_, index) => `<span class="life-pip ${index >= lives ? 'lost' : ''}"></span>`).join('');
    ui.showStatus.textContent = active ? (show.paused ? 'ENCORE DECISION' : `HEAT ${getHeatStep()}`) : 'NO SHOW ACTIVE';
    ui.comboDisplay.textContent = active ? show.combo : 0;
    ui.bestCombo.textContent = formatNumber(state.stats.bestCombo);
    ui.showPotDisplay.textContent = active ? formatNumber(show.pot) : '0';
    ui.showProfitDisplay.textContent = active ? `+${formatNumber(Math.max(0, show.pot - show.wager))} PROFIT` : '+0 PROFIT';
    ui.comboMultiplier.textContent = `×${(active ? getComboPotMultiplier() : 1).toFixed(2)}`;
    ui.heatMultiplier.textContent = `×${(active ? getHeatPotMultiplier() : 1).toFixed(2)}`;
    ui.contractMultiplier.textContent = `×${contract.multiplier.toFixed(2)}`;
    ui.potGrowthMultiplier.textContent = `×${(active ? getPotGrowthMultiplier('good') : getTempoPotMultiplier()).toFixed(2)}`;

    ui.activeContractName.textContent = contract.name;
    const progress = active ? getRoundProgress() : 0;
    const target = active ? getRoundTarget() : contract.target;
    ui.contractProgressText.textContent = `${formatNumber(progress)} / ${formatNumber(target)} ${contract.objectiveLabel}`;
    ui.contractProgressFill.style.width = `${(active ? getContractProgressRatio() : 0) * 100}%`;

    const wagerValue = Number.parseInt(ui.wagerInput.value, 10);
    const invalidWager = !Number.isFinite(wagerValue) || wagerValue <= 0 || wagerValue > state.chips;
    ui.startBtn.disabled = active || invalidWager || state.tempo.activeLevel < contract.minTempo;
    ui.cashOutBtn.disabled = !active;
    ui.wagerInput.disabled = active;
    ui.wagerInput.max = Math.max(1, Math.floor(state.chips));
}

function updateTempoUI() {
    const cost = getTempoUpgradeCost();
    const affordable = state.chips >= cost;
    ui.tempoUpgradeBtn.disabled = !affordable;
    ui.tempoUpgradeBtn.classList.toggle('affordable', affordable);
    ui.tempoUnlockedLevel.textContent = state.tempo.unlockedLevel;
    ui.tempoUpgradeCost.textContent = formatNumber(cost);
    ui.tempoLevelDisplay.textContent = `${state.tempo.activeLevel} / ${state.tempo.unlockedLevel}`;
    ui.tempoSpeedDisplay.textContent = Math.round(getTempoSpeed());
    ui.tempoBpmDisplay.textContent = getCurrentBpm();
    ui.tempoPayoutDisplay.textContent = `×${getTempoPotMultiplier().toFixed(2)}`;
    ui.tempoDownBtn.disabled = state.show.active || state.tempo.activeLevel <= 0;
    ui.tempoUpBtn.disabled = state.show.active || state.tempo.activeLevel >= state.tempo.unlockedLevel;
}

function updatePrestigeUI() {
    const status = getPrestigeStatus();
    const gain = calculatePrestigeFame();
    ui.prestigeReward.textContent = `+${gain} Fame`;
    ui.prestigeBtn.disabled = !status.ready;
    const missing = status.requirements.filter(req => req.current < req.target).map(req => req.label);
    ui.prestigeRequirementText.textContent = missing.length
        ? `Still required: ${missing.join(' · ')}.`
        : 'The casino is ready to sell. Fame can be spent on permanent upgrade branches.';
}

function updateUI(force = false) {
    if (state.runtime.contentDirty) renderContent();
    renderCasinoScene();

    const idle = getIdleIncomePerSecond();
    const base = getSustainableCasinoIncome();
    ui.topVenue.textContent = getCurrentVenue().name;
    ui.topFame.textContent = state.fame.unspent;
    ui.topChips.textContent = formatNumber(state.chips);
    ui.chips.textContent = formatNumber(state.chips);
    ui.idleIncome.textContent = formatNumber(idle);
    ui.baseCasinoIncome.textContent = `${formatNumber(base)}/sec`;
    ui.catchUpDisplay.textContent = `×${getCatchUpMultiplier()}`;
    ui.achievementBonusDisplay.textContent = `×${getAchievementMultiplier().toFixed(2)}`;
    ui.managerCount.textContent = `${Object.keys(state.managers).length} selected`;
    ui.fameAvailable.textContent = `${state.fame.unspent} available`;
    ui.achievementCount.textContent = `${getUnlockedAchievementCount()} achievements`;

    const modalActionsLocked = state.show.active;
    ui.openManagersBtn.disabled = modalActionsLocked;
    ui.openFameBtn.disabled = modalActionsLocked;
    ui.openStatsBtn.disabled = modalActionsLocked;
    ui.resetSaveBtn.disabled = modalActionsLocked;

    updateVenueUI();
    updateBuildingUI();
    updateContractUI();
    updateShowUI();
    updateTempoUI();
    updatePrestigeUI();

    const jackpotPercent = clamp(state.jackpot / state.jackpotMax, 0, 1);
    ui.jackpotText.textContent = `${Math.floor(state.jackpot)} / ${state.jackpotMax}`;
    ui.jackpotFill.style.width = `${jackpotPercent * 100}%`;
    if (state.feverActive) {
        ui.feverBtn.disabled = true;
        ui.feverBtn.textContent = `FEVER ×3 · ${state.feverRemaining.toFixed(1)}s`;
    } else if (state.jackpot >= state.jackpotMax) {
        ui.feverBtn.disabled = false;
        ui.feverBtn.textContent = 'ACTIVATE FEVER TIME';
    } else {
        ui.feverBtn.disabled = true;
        ui.feverBtn.textContent = `FEVER LOCKED · ${Math.floor(jackpotPercent * 100)}%`;
    }
    ui.gameShell.classList.toggle('fever-mode', state.feverActive);

    ui.audioToggleBtn.textContent = state.settings.audio ? 'AUDIO ON' : 'AUDIO OFF';
    ui.audioToggleBtn.classList.toggle('active', state.settings.audio);
    ui.bestCashoutStat.textContent = formatNumber(state.stats.bestCashout);
    ui.contractsStat.textContent = formatNumber(state.stats.completedContracts);
    ui.perfectHitsStat.textContent = formatNumber(state.stats.perfectHits);
    ui.encoresStat.textContent = formatNumber(state.stats.encores);

    updateMobileUI();
    if (force) {
        state.runtime.uiTimer = 0;
        refreshHighwayMetrics();
    }
}

/* =========================================================
   TEMPO CONTROL
========================================================= */

function buyTempoUpgrade() {
    const cost = getTempoUpgradeCost();
    if (!spendChips(cost)) {
        showMessage(`Tempo upgrade requires ${formatNumber(cost)} chips.`, 'lose');
        return;
    }

    state.tempo.unlockedLevel++;
    if (!state.show.active) state.tempo.activeLevel = state.tempo.unlockedLevel;
    showMessage(`Tempo ${state.tempo.unlockedLevel} unlocked. New speed: ${getTempoSpeed()}.`, 'win');
    flashScreen('#19ef8b');
    updateUI(true);
}

function changeTempo(direction) {
    if (state.show.active) return;
    const next = state.tempo.activeLevel + direction;
    if (next < 0 || next > state.tempo.unlockedLevel) return;
    state.tempo.activeLevel = next;
    showMessage(`Active Tempo set to ${next} (${getTempoSpeed()} speed, ${getCurrentBpm()} BPM).`, 'win');
    updateUI(true);
}

/* =========================================================
   MODALS / SAVE TOOLS
========================================================= */

function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeModal(modal) {
    modal.classList.add('hidden');
}

async function exportSave() {
    let raw = JSON.stringify(getSavePayload());
    if (persistenceAvailable) {
        try {
            raw = localStorage.getItem(SAVE_KEY) ?? raw;
        } catch {
            persistenceAvailable = false;
        }
    }

    try {
        await navigator.clipboard.writeText(raw);
        showToast('Save copied to clipboard');
    } catch {
        window.prompt('Copy your save:', raw);
    }
}

function importSave() {
    const raw = window.prompt('Paste a Goobers Goofy Casino save string:');
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        if (![SAVE_VERSION, 6].includes(parsed.version)) throw new Error('Wrong save version');
        if (!persistenceAvailable) throw new Error('Browser storage is unavailable');
        parsed.version = SAVE_VERSION;
        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
        suppressSave = true;
        location.reload();
    } catch (error) {
        showToast(`Import failed: ${error.message}`, 'danger');
    }
}

function resetSave() {
    const confirmed = window.confirm('Delete all Goobers Goofy Casino progress from this browser? This cannot be undone.');
    if (!confirmed) return;
    suppressSave = true;
    try {
        if (persistenceAvailable) {
            localStorage.removeItem(SAVE_KEY);
            for (const legacyKey of LEGACY_SAVE_KEYS) localStorage.removeItem(legacyKey);
        }
    } catch {
        persistenceAvailable = false;
    }
    location.reload();
}

/* =========================================================
   SAVE / LOAD
========================================================= */

function getSavePayload() {
    return {
        version: SAVE_VERSION,
        chips: state.chips,
        baseIncome: state.baseIncome,
        venueIndex: state.venueIndex,
        bestVenueEver: state.bestVenueEver,
        buyMode: state.buyMode,
        selectedContractId: state.selectedContractId,
        buildings: state.buildings,
        managers: state.managers,
        tempo: state.tempo,
        jackpot: state.jackpot,
        fame: state.fame,
        achievements: state.achievements,
        stats: state.stats,
        settings: state.settings,
        savedAt: Date.now()
    };
}

function saveGame() {
    if (suppressSave || !persistenceAvailable) return;
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(getSavePayload()));
    } catch (error) {
        persistenceAvailable = false;
        console.warn('Persistent browser storage is unavailable; progress will last for this session only.', error);
    }
}

function mergeLoadedState(save) {
    const fresh = createDefaultState();
    fresh.chips = Number.isFinite(save.chips) ? Math.max(0, save.chips) : fresh.chips;
    fresh.baseIncome = Number.isFinite(save.baseIncome) ? Math.max(0, save.baseIncome) : fresh.baseIncome;
    fresh.venueIndex = clamp(Number(save.venueIndex) || 0, 0, VENUES.length - 1);
    fresh.bestVenueEver = clamp(Number(save.bestVenueEver) || fresh.venueIndex, fresh.venueIndex, VENUES.length - 1);
    fresh.buyMode = ['1', '10', 'max'].includes(save.buyMode) ? save.buyMode : '1';
    fresh.selectedContractId = CONTRACTS[save.selectedContractId] ? save.selectedContractId : 'openMic';

    for (const type of BUILDING_ORDER) {
        const amount = save.buildings?.[type]?.amount;
        fresh.buildings[type].amount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
    }

    fresh.managers = {};
    for (const [id, choice] of Object.entries(save.managers ?? {})) {
        if (MANAGERS[id]?.choices[choice]) fresh.managers[id] = choice;
    }

    Object.assign(fresh.tempo, save.tempo ?? {});
    fresh.tempo.activeLevel = clamp(Math.floor(fresh.tempo.activeLevel || 0), 0, Math.floor(fresh.tempo.unlockedLevel || 0));
    fresh.tempo.unlockedLevel = Math.max(0, Math.floor(fresh.tempo.unlockedLevel || 0));
    fresh.jackpot = clamp(Number(save.jackpot) || 0, 0, fresh.jackpotMax);

    fresh.fame.unspent = Math.max(0, Math.floor(save.fame?.unspent || 0));
    fresh.fame.total = Math.max(fresh.fame.unspent, Math.floor(save.fame?.total || 0));
    for (const id of Object.keys(fresh.fame.upgrades)) {
        const def = getFameUpgradeDefinition(id);
        fresh.fame.upgrades[id] = clamp(Math.floor(save.fame?.upgrades?.[id] || 0), 0, def.max);
    }

    fresh.achievements = { ...(save.achievements ?? {}) };
    fresh.stats = { ...fresh.stats, ...(save.stats ?? {}) };
    fresh.stats.contractCompletions = { ...(save.stats?.contractCompletions ?? {}) };
    fresh.settings = { ...fresh.settings, ...(save.settings ?? {}) };
    fresh.show = createDefaultShow();
    fresh.runtime = createDefaultState().runtime;
    return fresh;
}

function loadGame() {
    let raw = null;
    let migratedLegacySave = false;

    try {
        raw = localStorage.getItem(SAVE_KEY);
        if (!raw) {
            for (const legacyKey of LEGACY_SAVE_KEYS) {
                const candidate = localStorage.getItem(legacyKey);
                if (candidate) {
                    raw = candidate;
                    migratedLegacySave = true;
                    break;
                }
            }
        }
    } catch (error) {
        persistenceAvailable = false;
        console.warn('Persistent browser storage is unavailable; the game will still run for this session.', error);
        return;
    }
    if (!raw) return;

    try {
        const save = JSON.parse(raw);
        if (![SAVE_VERSION, 6].includes(save.version)) return;
        state = mergeLoadedState(save);

        const secondsAway = clamp((Date.now() - (save.savedAt || Date.now())) / 1000, 0, OFFLINE_CAP_SECONDS);
        if (secondsAway >= 5) {
            const offlineRate = getIdleIncomePerSecond({ includeFever: false });
            const reward = offlineRate * secondsAway * OFFLINE_EFFICIENCY;
            addChips(reward, true);
            showToast(`Offline earnings: ${formatNumber(reward)} chips (${Math.round(secondsAway / 60)} min at 50% efficiency)`, 'gold');
        }

        if (migratedLegacySave || save.version !== SAVE_VERSION) saveGame();
    } catch (error) {
        console.error('Load failed:', error);
    }
}

/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(currentTick) {
    const elapsed = Math.max(0, (currentTick - state.runtime.lastTick) / 1000);
    const rhythmDelta = Math.min(elapsed, 0.05);
    const normalDelta = Math.min(elapsed, 1);
    state.runtime.lastTick = currentTick;

    // Browsers pause requestAnimationFrame in background tabs. Treat a
    // gap longer than five seconds like offline time: capped at eight
    // hours, paid at 50% efficiency, and never multiplied by Fever.
    if (elapsed > 5) {
        const offlineSeconds = Math.min(elapsed, OFFLINE_CAP_SECONDS);
        addChips(
            getIdleIncomePerSecond({ includeFever: false }) * offlineSeconds * OFFLINE_EFFICIENCY,
            true
        );
        state.feverRemaining = 0;
        state.feverActive = false;
    } else {
        addChips(getIdleIncomePerSecond() * elapsed, true);
    }

    if (state.feverActive) {
        state.feverRemaining -= elapsed;
        if (state.feverRemaining <= 0) {
            state.feverRemaining = 0;
            state.feverActive = false;
            showMessage('Fever Time ended. Fill the Jackpot again through accurate play.', 'win');
        }
    }

    if (state.show.active && !state.show.paused) {
        const now = getNowSeconds();
        scheduleUpcomingBeats(now);
        updateNotes(now, rhythmDelta);
    }

    state.runtime.saveTimer += normalDelta;
    if (state.runtime.saveTimer >= SAVE_INTERVAL) {
        state.runtime.saveTimer = 0;
        saveGame();
    }

    state.runtime.uiTimer += normalDelta;
    if (state.runtime.uiTimer >= UI_INTERVAL) {
        state.runtime.uiTimer = 0;
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

/* =========================================================
   EVENTS
========================================================= */

ui.buildingList.addEventListener('click', event => {
    const button = event.target.closest('[data-building]');
    if (!button || button.disabled) return;
    buyBuilding(button.dataset.building);
});

ui.buyModeRow.addEventListener('click', event => {
    const button = event.target.closest('[data-buy-mode]');
    if (!button) return;
    state.buyMode = button.dataset.buyMode;
    updateUI(true);
});

ui.contractList.addEventListener('click', event => {
    const button = event.target.closest('[data-contract]');
    if (!button || button.disabled) return;
    setSelectedContract(button.dataset.contract);
});

document.querySelector('.wager-quick-row').addEventListener('click', event => {
    const button = event.target.closest('[data-wager-fraction]');
    if (!button) return;
    setWagerFraction(Number(button.dataset.wagerFraction));
});

ui.wagerInput.addEventListener('input', () => updateUI(true));

ui.expandVenueBtn.addEventListener('click', expandVenue);
ui.prestigeBtn.addEventListener('click', performPrestige);
ui.startBtn.addEventListener('click', startShow);
ui.cashOutBtn.addEventListener('click', cashOutShow);
ui.encoreCashOutBtn.addEventListener('click', cashOutShow);
ui.acceptEncoreBtn.addEventListener('click', acceptEncore);
ui.feverBtn.addEventListener('click', activateFever);
ui.tempoUpgradeBtn.addEventListener('click', buyTempoUpgrade);
ui.tempoDownBtn.addEventListener('click', () => changeTempo(-1));
ui.tempoUpBtn.addEventListener('click', () => changeTempo(1));

ui.audioToggleBtn.addEventListener('click', () => {
    state.settings.audio = !state.settings.audio;
    if (state.settings.audio) audioEngine.ensure();
    updateUI(true);
});

ui.openManagersBtn.addEventListener('click', () => {
    if (state.show.active) return;
    renderManagerList();
    openModal(ui.managersModal);
});
ui.openFameBtn.addEventListener('click', () => {
    if (state.show.active) return;
    renderFameTree();
    openModal(ui.fameModal);
});
ui.openStatsBtn.addEventListener('click', () => {
    if (state.show.active) return;
    renderStatsModal();
    openModal(ui.statsModal);
});
ui.resetSaveBtn.addEventListener('click', () => {
    if (!state.show.active) openModal(ui.resetModal);
});
ui.confirmResetBtn.addEventListener('click', resetSave);
ui.exportSaveBtn.addEventListener('click', exportSave);
ui.importSaveBtn.addEventListener('click', importSave);

ui.managerList.addEventListener('click', event => {
    const button = event.target.closest('[data-manager-choice]');
    if (!button || button.disabled) return;
    chooseManager(button.dataset.manager, button.dataset.managerChoice);
});

ui.fameTree.addEventListener('click', event => {
    const button = event.target.closest('[data-fame-upgrade]');
    if (!button || button.disabled) return;
    buyFameUpgrade(button.dataset.fameUpgrade);
});

document.addEventListener('click', event => {
    const closeButton = event.target.closest('[data-close-modal]');
    if (closeButton) {
        const modal = document.getElementById(closeButton.dataset.closeModal);
        if (modal) closeModal(modal);
        return;
    }

    if (event.target.classList.contains('modal-backdrop')) closeModal(event.target);
});

ui.mobileNav?.addEventListener('click', event => {
    const button = event.target.closest('[data-scroll-target]');
    if (!button) return;
    const target = document.getElementById(button.dataset.scrollTarget);
    setActiveMobileNav(button.dataset.scrollTarget);
    scrollToGameSection(target);
});

ui.mobileSetupBtn?.addEventListener('click', () => {
    setActiveMobileNav('showControlPanel');
    scrollToGameSection(ui.showControlPanel);
});

ui.mobileStartBtn?.addEventListener('click', startShow);
ui.mobileCashOutBtn?.addEventListener('click', cashOutShow);
ui.mobileFeverBtn?.addEventListener('click', activateFever);
ui.mobileEncoreCashOutBtn?.addEventListener('click', cashOutShow);
ui.mobileAcceptEncoreBtn?.addEventListener('click', acceptEncore);

function bindPointerLaneControl(element, laneIndex) {
    if (!element) return;
    element.addEventListener('contextmenu', event => event.preventDefault());
    element.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        element.setPointerCapture?.(event.pointerId);
        element.classList.add('pressed');
        handleLanePress(laneIndex);
    });

    const release = event => {
        event.preventDefault();
        element.classList.remove('pressed');
        handleLaneRelease(laneIndex);
    };

    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', () => element.classList.remove('pressed'));
}

for (const button of ui.mobileLaneButtons) {
    bindPointerLaneControl(button, Number(button.dataset.mobileLane));
}

const mobileSectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        if (!isMobileLayout()) return;
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveMobileNav(visible.target.id);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] })
    : null;

if (mobileSectionObserver) {
    [ui.showControlPanel, ui.rhythmStage, ui.casinoPanel].forEach(section => section && mobileSectionObserver.observe(section));
}

const keyMap = { KeyD: 0, KeyF: 1, KeyJ: 2, KeyK: 3 };

document.addEventListener('keydown', event => {
    if (event.code in keyMap && !event.repeat) {
        event.preventDefault();
        handleLanePress(keyMap[event.code]);
        return;
    }

    if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        if (state.show.active) cashOutShow();
        return;
    }

    if ((event.code === 'Enter' || event.code === 'KeyE') && !event.repeat && state.show.awaitingEncore) {
        event.preventDefault();
        acceptEncore();
    }

    if (event.code === 'Escape') {
        document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(closeModal);
    }
});

document.addEventListener('keyup', event => {
    if (event.code in keyMap) {
        event.preventDefault();
        handleLaneRelease(keyMap[event.code]);
    }
});

ui.lanes.forEach((laneElement, laneIndex) => {
    bindPointerLaneControl(laneElement, laneIndex);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseShowForVisibility();
        saveGame();
        return;
    }

    resumeShowFromVisibility();
});

window.addEventListener('resize', () => window.requestAnimationFrame(refreshHighwayMetrics));
window.addEventListener('orientationchange', () => window.setTimeout(refreshHighwayMetrics, 120));

window.addEventListener('beforeunload', saveGame);

/* =========================================================
   STARTUP
========================================================= */

loadGame();
if (!isContractUnlocked(state.selectedContractId)) state.selectedContractId = 'openMic';
state.runtime.lastTick = performance.now();
state.runtime.contentDirty = true;
state.runtime.sceneDirty = true;
renderContent();
refreshHighwayMetrics();
checkAchievements();
updateUI(true);
requestAnimationFrame(gameLoop);

