const SAVE_KEY = 'allInCrescendoSave_v4';
const OLD_SAVE_KEY = 'allInCrescendoSave_v3';

const OFFLINE_CAP_SECONDS =
    8 * 60 * 60;


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


const state = {

    chips: 100,

    lastTick:
        performance.now(),

    autosaveTimer: 0,


    // =========================
    // PRESTIGE
    // =========================

    fame: 0,

    runChipsEarned: 0,

    lifetimeChipsEarned: 0,


    // =========================
    // RHYTHM GAME
    // =========================

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

    keysHeld: [
        false,
        false,
        false,
        false
    ],

    activeHoldNote: [
        null,
        null,
        null,
        null
    ],


    // =========================
    // TEMPO SYSTEM
    // =========================

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


    // =========================
    // CASINO
    // =========================

    baseIncome: 1,

    buyMode: '1',

    casino: {

        buildings: {

            busker: {

                name:
                    'Street Busker',

                amount:
                    0,

                baseCost:
                    15,

                baseIncome:
                    1,

                costGrowth:
                    1.15

            },


            slots: {

                name:
                    'Slot Machine',

                amount:
                    0,

                baseCost:
                    100,

                baseIncome:
                    8,

                costGrowth:
                    1.15

            },


            blackjack: {

                name:
                    'Blackjack Table',

                amount:
                    0,

                baseCost:
                    750,

                baseIncome:
                    55,

                costGrowth:
                    1.15

            },


            roulette: {

                name:
                    'Roulette Table',

                amount:
                    0,

                baseCost:
                    5000,

                baseIncome:
                    320,

                costGrowth:
                    1.15

            },


            vip: {

                name:
                    'VIP Lounge',

                amount:
                    0,

                baseCost:
                    35000,

                baseIncome:
                    1800,

                costGrowth:
                    1.15

            },


            highRoller: {

                name:
                    'High Roller Suite',

                amount:
                    0,

                baseCost:
                    250000,

                baseIncome:
                    11000,

                costGrowth:
                    1.15

            },


            corporate: {

                name:
                    'Corporate Endorsement',

                amount:
                    0,

                baseCost:
                    2000000,

                baseIncome:
                    75000,

                costGrowth:
                    1.15

            },


            empire: {

                name:
                    'Casino Empire',

                amount:
                    0,

                baseCost:
                    20000000,

                baseIncome:
                    550000,

                costGrowth:
                    1.15

            }

        }

    },


    // =========================
    // JACKPOT
    // =========================

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

    const upgradeList =
        document.querySelector(
            '.upgrade-list'
        );


    const highway =
        document.getElementById(
            'highway'
        );


    if (
        !upgradeList ||
        !highway
    ) {

        return;

    }


    const buildingButtons =

        BUILDING_ORDER
            .map(
                type => {

                    const building =
                        state
                            .casino
                            .buildings[
                                type
                            ];


                    return `

                        <button
                            class="casino-building"
                            id="building-${type}"
                            onclick="buyBuilding('${type}')"
                        >

                            <span>

                                <span class="building-name">
                                    ${building.name}
                                </span>

                                <span class="building-details">

                                    <span id="building-${type}-income">
                                        0/sec
                                    </span>

                                    <br>

                                    Cost:
                                    <span id="building-${type}-cost">
                                        0
                                    </span>

                                    <br>

                                    <span id="building-${type}-milestone">
                                        Next milestone: 10
                                    </span>

                                </span>

                            </span>


                            <span
                                class="building-owned"
                                id="building-${type}-owned"
                            >
                                0
                            </span>

                        </button>

                    `;

                }
            )
            .join('');


    upgradeList.innerHTML = `

        <div class="economy-summary">

            <div class="economy-stat">

                Casino Income

                <strong id="casinoIncomeDisplay">
                    1/sec
                </strong>

            </div>


            <div class="economy-stat">

                Fame Bonus

                <strong id="fameMultiplierMini">
                    x1
                </strong>

            </div>

        </div>


        <div class="buy-mode-row">

            <button
                id="buyMode1"
                class="selected"
                onclick="setBuyMode('1')"
            >
                BUY 1
            </button>


            <button
                id="buyMode10"
                onclick="setBuyMode('10')"
            >
                BUY 10
            </button>


            <button
                id="buyModeMax"
                onclick="setBuyMode('max')"
            >
                BUY MAX
            </button>

        </div>


        ${buildingButtons}

    `;


    upgradeList.insertAdjacentHTML(

        'afterend',

        `

            <div
                class="prestige-panel"
                id="prestigePanel"
            >

                <h4>
                    ★ SELL THE CASINO
                </h4>

                <p>

                    Sell everything and restart stronger.

                    Fame permanently multiplies
                    casino and rhythm income.

                </p>


                <p>

                    Fame:

                    <strong id="fameDisplay">
                        0
                    </strong>

                    •

                    Multiplier:

                    <strong id="fameMultiplierDisplay">
                        x1
                    </strong>

                </p>


                <p>

                    Run Earnings:

                    <strong id="runEarnedDisplay">
                        0
                    </strong>

                    <br>

                    Sell Reward:

                    <strong id="fameGainDisplay">
                        +0 Fame
                    </strong>

                </p>


                <button
                    id="sellCasinoBtn"
                    onclick="sellCasino()"
                    disabled
                >

                    SELL THE CASINO

                </button>

            </div>

        `

    );


    highway.insertAdjacentHTML(

        'beforebegin',

        `

            <div
                class="jackpot-panel"
                id="jackpotPanel"
            >

                <div class="jackpot-header">

                    <span>
                        JACKPOT METER
                    </span>

                    <span id="jackpotText">
                        0 / 100
                    </span>

                </div>


                <div class="jackpot-track">

                    <div id="jackpotFill">
                    </div>

                </div>


                <button
                    id="feverBtn"
                    onclick="activateFever()"
                    disabled
                >

                    FEVER LOCKED

                </button>


                <div class="fever-subtext">

                    PERFECT +10
                    •
                    GREAT +4
                    •
                    GOOD +1

                </div>

            </div>

        `

    );

}


/* =========================================================
   TEMPO CONTROL UI
========================================================= */

function injectTempoControls() {

    const upgrade =
        document.getElementById(
            'rightSpeedUpgrade'
        );


    if (
        !upgrade
    ) {

        return;

    }


    /*
        Rewrite text of existing
        Increase Tempo purchase.
    */

    const info =
        upgrade.querySelector(
            '.rhythm-upgrade-info'
        );


    if (
        info
    ) {

        info.innerHTML = `

            <strong>
                Unlock Higher Tempo
            </strong>

            <span>
                +20 maximum note speed
            </span>

            <span>
                +0.15× maximum rhythm payout
            </span>

        `;

    }


    if (
        document.getElementById(
            'tempoSelector'
        )
    ) {

        return;

    }


    upgrade.insertAdjacentHTML(

        'afterend',

        `

            <div
                id="tempoSelector"
                class="tempo-selector"
            >

                <div class="tempo-selector-heading">

                    <span>
                        ACTIVE TEMPO
                    </span>

                    <strong id="tempoLevelDisplay">
                        0 / 0
                    </strong>

                </div>


                <div class="tempo-control-row">

                    <button
                        id="tempoDownBtn"
                        onclick="changeTempo(-1)"
                    >

                        −

                        <span>
                            SLOWER
                        </span>

                    </button>


                    <div class="tempo-current">

                        <strong id="tempoSpeedDisplay">
                            300
                        </strong>

                        <span>
                            SPEED
                        </span>

                    </div>


                    <button
                        id="tempoUpBtn"
                        onclick="changeTempo(1)"
                    >

                        +

                        <span>
                            FASTER
                        </span>

                    </button>

                </div>


                <div class="tempo-payout-line">

                    Rhythm payout at this tempo:

                    <strong id="tempoPayoutDisplay">
                        x1.00
                    </strong>

                </div>

            </div>

        `

    );


    injectTempoStyles();

}


function injectTempoStyles() {

    if (
        document.getElementById(
            'tempoStyles'
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            'style'
        );


    style.id =
        'tempoStyles';


    style.textContent = `

        .tempo-selector {

            margin-top: 9px;

            padding: 10px;

            background:
                rgba(255,255,255,0.018);

            border:
                1px solid
                rgba(255,255,255,0.065);

            border-radius: 9px;

        }


        .tempo-selector-heading {

            display: flex;

            justify-content: space-between;

            align-items: center;

            margin-bottom: 8px;

            color: #666f76;

            font-size: 8px;

            font-weight: 900;

            letter-spacing: 1px;

        }


        .tempo-selector-heading strong {

            color: #aeb7bd;

            font-size: 9px;

        }


        .tempo-control-row {

            display: grid;

            grid-template-columns:
                1fr 72px 1fr;

            gap: 6px;

            align-items: stretch;

        }


        .tempo-control-row button {

            min-height: 47px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            gap: 2px;

            background:
                rgba(24,242,139,0.07);

            color:
                #18f28b;

            border:
                1px solid
                rgba(24,242,139,0.25);

            border-radius: 7px;

            font-size: 17px;

            font-weight: 900;

            cursor: pointer;

            transition:
                0.15s ease;

        }


        .tempo-control-row button span {

            font-size: 7px;

            letter-spacing: 0.8px;

        }


        .tempo-control-row button:not(:disabled):hover {

            transform:
                translateY(-1px);

            background:
                rgba(24,242,139,0.13);

            border-color:
                #18f28b;

        }


        .tempo-control-row button:disabled {

            color: #4c555b;

            background: #14181b;

            border-color: #292f34;

            opacity: 0.55;

            cursor: not-allowed;

        }


        .tempo-current {

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            background: #090c0f;

            border:
                1px solid
                rgba(255,255,255,0.08);

            border-radius: 7px;

        }


        .tempo-current strong {

            color: #fff;

            font-size: 16px;

        }


        .tempo-current span {

            margin-top: 1px;

            color: #596168;

            font-size: 7px;

            font-weight: 900;

            letter-spacing: 1px;

        }


        .tempo-payout-line {

            margin-top: 7px;

            text-align: center;

            color: #606970;

            font-size: 8px;

        }


        .tempo-payout-line strong {

            color: #18f28b;

        }

    `;


    document.head.appendChild(
        style
    );

}


injectCasinoUI();

injectTempoControls();


/* =========================================================
   UI REFERENCES
========================================================= */

const ui = {

    gameShell:
        document.getElementById(
            'gameShell'
        ),

    screenFlash:
        document.getElementById(
            'screenFlash'
        ),

    highway:
        document.getElementById(
            'highway'
        ),

    effectsLayer:
        document.getElementById(
            'effectsLayer'
        ),

    judgement:
        document.getElementById(
            'judgement'
        ),

    chips:
        document.getElementById(
            'chips'
        ),

    idleIncome:
        document.getElementById(
            'idleIncome'
        ),

    startBtn:
        document.getElementById(
            'startBtn'
        ),

    message:
        document.getElementById(
            'message'
        ),

    wagerInput:
        document.getElementById(
            'wager'
        ),

    comboCard:
        document.getElementById(
            'comboCard'
        ),

    comboDisplay:
        document.getElementById(
            'comboDisplay'
        ),

    bestCombo:
        document.getElementById(
            'bestCombo'
        ),

    comboMultiplier:
        document.getElementById(
            'comboMultiplier'
        ),

    totalMultiplier:
        document.getElementById(
            'totalMultiplier'
        ),

    lanes: [
        document.getElementById('lane-0'),
        document.getElementById('lane-1'),
        document.getElementById('lane-2'),
        document.getElementById('lane-3')
    ],

    targets: [
        document.getElementById('target-0'),
        document.getElementById('target-1'),
        document.getElementById('target-2'),
        document.getElementById('target-3')
    ]

};


/* =========================================================
   TEMPO MATH
========================================================= */

function syncTempoStats() {

    state.noteSpeed =

        state.baseNoteSpeed

        +

        (
            state.tempo.activeLevel

            *

            state.tempo.speedPerLevel
        );


    state.payoutMultiplier =

        1

        +

        (
            state.tempo.activeLevel

            *

            state.tempo.payoutPerLevel
        );

}


function changeTempo(
    direction
) {

    if (
        state.isPlaying
    ) {

        showMessage(

            'You cannot change tempo during a show!',

            'lose'

        );


        return;

    }


    const newLevel =

        state.tempo.activeLevel

        +

        direction;


    if (
        newLevel < 0
    ) {

        return;

    }


    if (
        newLevel
        >
        state.tempo.unlockedLevel
    ) {

        return;

    }


    state.tempo.activeLevel =
        newLevel;


    syncTempoStats();


    showMessage(

        `Tempo set to level ${state.tempo.activeLevel}. Speed ${state.noteSpeed}.`,

        'win'

    );


    updateUI();

}


/* =========================================================
   FORMAT NUMBERS
========================================================= */

function formatNumber(
    value
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return '∞';

    }


    if (
        value < 1000
    ) {

        return (

            Math.floor(
                value * 10
            )

            /

            10

        );

    }


    const suffixes = [
        '',
        'K',
        'M',
        'B',
        'T',
        'Qa',
        'Qi',
        'Sx',
        'Sp',
        'Oc',
        'No'
    ];


    const tier =

        Math.floor(

            Math.log10(
                value
            )

            /

            3

        );


    if (
        tier
        >=
        suffixes.length
    ) {

        return value.toExponential(
            2
        );

    }


    const scaled =

        value

        /

        Math.pow(
            1000,
            tier
        );


    return (

        scaled.toFixed(

            scaled >= 100
                ?
                0
                :
                scaled >= 10
                    ?
                    1
                    :
                    2

        )

        +

        suffixes[
            tier
        ]

    );

}


/* =========================================================
   CHIP ECONOMY
========================================================= */

function addChips(
    amount,
    countAsEarned = true
) {

    if (
        !Number.isFinite(
            amount
        )
        ||
        amount <= 0
    ) {

        return;

    }


    state.chips +=
        amount;


    if (
        countAsEarned
    ) {

        state.runChipsEarned +=
            amount;


        state.lifetimeChipsEarned +=
            amount;

    }

}


function getFameMultiplier() {

    return (

        1

        +

        state.fame
        *
        4

    );

}


function calculateFameGain() {

    if (
        state.runChipsEarned
        <
        100000
    ) {

        return 0;

    }


    return Math.floor(

        Math.sqrt(

            state.runChipsEarned

            /

            100000

        )

    );

}


/* =========================================================
   CASINO BUILDING MATH
========================================================= */

function getBuildingMilestoneMultiplier(
    amount
) {

    let multiplier =
        1;


    if (
        amount >= 10
    ) {

        multiplier *= 2;

    }


    if (
        amount >= 25
    ) {

        multiplier *= 2;

    }


    if (
        amount >= 50
    ) {

        multiplier *= 2;

    }


    if (
        amount >= 100
    ) {

        multiplier *= 3;

    }


    return multiplier;

}


function getNextMilestone(
    amount
) {

    if (
        amount < 10
    ) {

        return 10;

    }


    if (
        amount < 25
    ) {

        return 25;

    }


    if (
        amount < 50
    ) {

        return 50;

    }


    if (
        amount < 100
    ) {

        return 100;

    }


    return null;

}


function getBuildingIncome(
    building
) {

    return (

        building.amount

        *

        building.baseIncome

        *

        getBuildingMilestoneMultiplier(
            building.amount
        )

    );

}


function calculateBaseCasinoIncome() {

    let total =
        state.baseIncome;


    for (
        const building
        of
        Object.values(
            state.casino.buildings
        )
    ) {

        total +=
            getBuildingIncome(
                building
            );

    }


    return total;

}


function getIdleIncomePerSecond() {

    return (

        calculateBaseCasinoIncome()

        *

        getFameMultiplier()

        *

        (
            state.feverActive

                ?

                state.feverMultiplier

                :

                1
        )

    );

}


function getBulkCost(
    type,
    amount
) {

    const building =
        state
            .casino
            .buildings[
                type
            ];


    let total =
        0;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        total +=

            building.baseCost

            *

            Math.pow(

                building.costGrowth,

                building.amount
                +
                i

            );

    }


    return Math.floor(
        total
    );

}


function getMaxAffordable(
    type
) {

    let amount =
        0;


    while (
        amount < 10000
    ) {

        const cost =
            getBulkCost(
                type,
                amount + 1
            );


        if (
            cost > state.chips
        ) {

            break;

        }


        amount++;

    }


    return amount;

}


function getPurchaseQuantity(
    type
) {

    if (
        state.buyMode === '10'
    ) {

        return 10;

    }


    if (
        state.buyMode === 'max'
    ) {

        return getMaxAffordable(
            type
        );

    }


    return 1;

}


function setBuyMode(
    mode
) {

    state.buyMode =
        mode;


    updateUI();

}


function buyBuilding(
    type
) {

    const building =
        state
            .casino
            .buildings[
                type
            ];


    const quantity =
        getPurchaseQuantity(
            type
        );


    if (
        quantity <= 0
    ) {

        showMessage(
            'Not enough chips!',
            'lose'
        );


        return;

    }


    const cost =
        getBulkCost(
            type,
            quantity
        );


    if (
        state.chips < cost
    ) {

        showMessage(
            'Not enough chips!',
            'lose'
        );


        return;

    }


    state.chips -=
        cost;


    building.amount +=
        quantity;


    showMessage(

        `Bought ${quantity} ${building.name}!`,

        'win'

    );


    updateUI();

}


/* =========================================================
   PRESTIGE
========================================================= */

function sellCasino() {

    const fameGain =
        calculateFameGain();


    if (
        fameGain <= 0
    ) {

        return;

    }


    const confirmed =

        confirm(

            `Sell the casino for +${fameGain} Fame?`

        );


    if (
        !confirmed
    ) {

        return;

    }


    clearAllNotes();


    state.isPlaying =
        false;


    state.fame +=
        fameGain;


    state.chips =
        0;


    state.runChipsEarned =
        0;


    state.combo =
        0;


    state.jackpot =
        0;


    state.feverActive =
        false;


    state.feverTimeRemaining =
        0;


    state.tempo.unlockedLevel =
        0;


    state.tempo.activeLevel =
        0;


    state.tempo.cost =
        state.tempo.baseCost;


    state.spawnInterval =
        1.2;


    syncTempoStats();


    for (
        const building
        of
        Object.values(
            state.casino.buildings
        )
    ) {

        building.amount =
            0;

    }


    ui.startBtn.disabled =
        false;


    showJudgement(

        `+${fameGain} FAME`,

        'milestone'

    );


    showMessage(

        `Casino sold! Permanent multiplier is now x${getFameMultiplier()}.`,

        'win'

    );


    updateUI();

}


/* =========================================================
   JACKPOT
========================================================= */

function addJackpot(
    amount
) {

    if (
        state.feverActive
    ) {

        return;

    }


    const oldValue =
        state.jackpot;


    state.jackpot =

        Math.min(

            state.jackpotMax,

            state.jackpot
            +
            amount

        );


    if (

        oldValue
        <
        state.jackpotMax

        &&

        state.jackpot
        >=
        state.jackpotMax

    ) {

        showJudgement(

            'JACKPOT READY!',

            'milestone'

        );


        showMessage(

            'Jackpot ready! Activate Fever!',

            'win'

        );

    }

}


function activateFever() {

    if (
        state.jackpot
        <
        state.jackpotMax
    ) {

        return;

    }


    if (
        state.feverActive
    ) {

        return;

    }


    state.jackpot =
        0;


    state.feverActive =
        true;


    state.feverTimeRemaining =
        state.feverDuration;


    showJudgement(

        'FEVER TIME!',

        'milestone'

    );


    showMessage(

        'FEVER TIME! Idle income x3!',

        'win'

    );


    triggerShake(
        'big'
    );


    flashScreen(
        '#ffd86b'
    );

}


/* =========================================================
   RHYTHM MULTIPLIERS
========================================================= */

function getComboMultiplier() {

    return Math.min(

        3,

        1

        +

        Math.floor(
            state.combo
            /
            5
        )

        *

        0.25

    );

}


function getTotalPayoutMultiplier() {

    return (

        state.payoutMultiplier

        *

        getComboMultiplier()

        *

        getFameMultiplier()

    );

}


/* =========================================================
   BUY TEMPO UPGRADE
========================================================= */

function buyUpgrade(
    type
) {

    if (
        type !== 'speed'
    ) {

        return;

    }


    const upgrade =
        state.tempo;


    if (
        state.chips
        <
        upgrade.cost
    ) {

        showMessage(

            'Not enough chips for the tempo upgrade!',

            'lose'

        );


        return;

    }


    state.chips -=
        upgrade.cost;


    upgrade.unlockedLevel++;


    /*
        Automatically move to
        newly unlocked tempo.

        The player can immediately
        lower it again for free.
    */

    upgrade.activeLevel =
        upgrade.unlockedLevel;


    upgrade.cost =

        Math.floor(

            upgrade.cost

            *

            upgrade.costMult

        );


    syncTempoStats();


    showMessage(

        `Tempo ${upgrade.unlockedLevel} unlocked! Speed is now ${state.noteSpeed}. You can lower it whenever you want.`,

        'win'

    );


    flashScreen(
        '#18f28b'
    );


    updateUI();

}


/* =========================================================
   HIT JUDGEMENT
========================================================= */

function getHitJudgement(
    noteCenter
) {

    const targetCenter =

        (
            state.targetStart
            +
            state.targetEnd
        )

        /

        2;


    const distance =

        Math.abs(

            noteCenter
            -
            targetCenter

        );


    if (
        distance <= 8
    ) {

        return {

            label:
                'PERFECT',

            className:
                'perfect',

            rewardMultiplier:
                1.25,

            color:
                '#ffd86b',

            particles:
                20,

            shake:
                'medium',

            jackpot:
                10

        };

    }


    if (
        distance <= 20
    ) {

        return {

            label:
                'GREAT',

            className:
                'great',

            rewardMultiplier:
                1.1,

            color:
                '#24dfff',

            particles:
                14,

            shake:
                'small',

            jackpot:
                4

        };

    }


    return {

        label:
            'GOOD',

        className:
            'good',

        rewardMultiplier:
            1,

        color:
            '#18f28b',

        particles:
            10,

        shake:
            'small',

        jackpot:
            1

    };

}


/* =========================================================
   NOTE SUCCESS
========================================================= */

function awardSuccessfulNote(
    quality,
    laneIndex,
    isLong,
    holdEarned = 0
) {

    state.combo++;


    state.bestCombo =

        Math.max(

            state.bestCombo,

            state.combo

        );


    addJackpot(
        quality.jackpot
    );


    const reward =

        Math.max(

            1,

            Math.floor(

                state.wager

                *

                (
                    isLong
                        ?
                        0.1
                        :
                        0.2
                )

                *

                getTotalPayoutMultiplier()

                *

                quality.rewardMultiplier

            )

        );


    addChips(
        reward
    );


    playSuccessEffects(

        laneIndex,

        quality,

        reward
        +
        Math.floor(
            holdEarned
        ),

        isLong
            ?
            'LONG COMPLETE'
            :
            quality.label

    );


    if (
        state.combo % 5 === 0
    ) {

        showJudgement(

            `${state.combo} COMBO!`,

            'milestone'

        );

    }


    updateUI();

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(
    currentTick
) {

    const rawDeltaTime =

        (
            currentTick
            -
            state.lastTick
        )

        /

        1000;


    const rhythmDeltaTime =

        Math.min(

            rawDeltaTime,

            0.05

        );


    state.lastTick =
        currentTick;


    addChips(

        getIdleIncomePerSecond()

        *

        rawDeltaTime

    );


    if (
        state.feverActive
    ) {

        state.feverTimeRemaining -=
            rawDeltaTime;


        if (
            state.feverTimeRemaining <= 0
        ) {

            state.feverActive =
                false;


            state.feverTimeRemaining =
                0;


            showMessage(

                'Fever Time ended.',

                'win'

            );

        }

    }


    if (
        state.isPlaying
    ) {

        state.spawnTimer +=
            rhythmDeltaTime;


        if (
            state.spawnTimer
            >=
            state.spawnInterval
        ) {

            state.spawnTimer =
                0;


            spawnNote();

        }


        for (

            let i =
                state.notes.length - 1;

            i >= 0;

            i--

        ) {

            const note =
                state.notes[i];


            note.y +=

                state.noteSpeed

                *

                rhythmDeltaTime;


            const head =

                document.getElementById(
                    note.id
                );


            if (
                head
            ) {

                head.style.top =
                    note.y
                    +
                    'px';

            }


            if (
                note.isLong
            ) {

                const body =

                    document.getElementById(

                        note.id
                        +
                        '-body'

                    );


                if (
                    body
                ) {

                    body.style.top =

                        (
                            note.y
                            -
                            note.length
                        )

                        +
                        'px';


                    body.style.height =
                        note.length
                        +
                        'px';

                }

            }


            if (
                note.isHolding
            ) {

                const reward =

                    state.holdRewardPerSecond

                    *

                    rhythmDeltaTime

                    *

                    getTotalPayoutMultiplier();


                addChips(
                    reward
                );


                note.holdEarned +=
                    reward;

            }


            if (

                !note.hit

                &&

                note.y
                >
                state.missThreshold

            ) {

                cleanupNoteCompletely(
                    i
                );


                finishGame(

                    false,

                    'Note missed!'

                );


                break;

            }


            if (
                note.isHolding
            ) {

                const tailY =

                    note.y
                    -
                    note.length;


                if (
                    tailY
                    >
                    state.targetEnd
                ) {

                    const lane =
                        note.lane;


                    const quality =
                        note.hitQuality;


                    const earnings =
                        note.holdEarned;


                    cleanupNoteCompletely(
                        i
                    );


                    awardSuccessfulNote(

                        quality,

                        lane,

                        true,

                        earnings

                    );

                }

            }

        }

    }


    state.autosaveTimer +=
        rawDeltaTime;


    if (
        state.autosaveTimer >= 10
    ) {

        state.autosaveTimer =
            0;


        saveGame();

    }


    updateUI();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   SPAWN NOTE
========================================================= */

function spawnNote() {

    const lane =

        Math.floor(

            Math.random()
            *
            4

        );


    const isLong =

        Math.random()
        <
        0.3;


    const note = {

        id:
            `note-${noteIdCounter++}`,

        lane:
            lane,

        y:
            -30,

        isLong:
            isLong,

        length:
            isLong
                ?
                150
                :
                0,

        hit:
            false,

        isHolding:
            false,

        hitQuality:
            null,

        holdEarned:
            0

    };


    state.notes.push(
        note
    );


    if (
        isLong
    ) {

        const body =
            document.createElement(
                'div'
            );


        body.id =
            note.id
            +
            '-body';


        body.className =
            'long-note-body';


        ui.lanes[
            lane
        ].appendChild(
            body
        );

    }


    const head =
        document.createElement(
            'div'
        );


    head.id =
        note.id;


    head.className =
        'note';


    ui.lanes[
        lane
    ].appendChild(
        head
    );

}


/* =========================================================
   NOTE CLEANUP
========================================================= */

function cleanupNoteCompletely(
    index
) {

    const note =
        state.notes[
            index
        ];


    if (
        !note
    ) {

        return;

    }


    document
        .getElementById(
            note.id
        )
        ?.remove();


    document
        .getElementById(
            note.id
            +
            '-body'
        )
        ?.remove();


    if (

        state.activeHoldNote[
            note.lane
        ]

        ===

        note

    ) {

        state.activeHoldNote[
            note.lane
        ]
        =
        null;


        ui.targets[
            note.lane
        ].classList.remove(
            'holding'
        );

    }


    state.notes.splice(
        index,
        1
    );

}


function clearAllNotes() {

    state.notes.forEach(

        note => {

            document
                .getElementById(
                    note.id
                )
                ?.remove();


            document
                .getElementById(
                    note.id
                    +
                    '-body'
                )
                ?.remove();

        }

    );


    state.notes =
        [];


    state.activeHoldNote = [
        null,
        null,
        null,
        null
    ];


    ui.targets.forEach(

        target => {

            target.classList.remove(
                'holding',
                'active'
            );

        }

    );

}


/* =========================================================
   INPUT
========================================================= */

function handleKeyDown(
    laneIndex
) {

    if (
        !state.isPlaying
    ) {

        return;

    }


    ui.targets[
        laneIndex
    ].classList.add(
        'active'
    );


    setTimeout(

        () => {

            ui.targets[
                laneIndex
            ].classList.remove(
                'active'
            );

        },

        100

    );


    const index =

        state.notes.findIndex(

            note =>

                note.lane
                ===
                laneIndex

                &&

                !note.hit

        );


    if (
        index === -1
    ) {

        state.combo =
            0;


        return;

    }


    const note =
        state.notes[
            index
        ];


    const center =
        note.y
        +
        12.5;


    if (

        center
        >=
        state.targetStart

        &&

        center
        <=
        state.targetEnd

    ) {

        const quality =

            getHitJudgement(
                center
            );


        note.hit =
            true;


        note.hitQuality =
            quality;


        if (
            note.isLong
        ) {

            note.isHolding =
                true;


            state.activeHoldNote[
                laneIndex
            ]
            =
            note;


            ui.targets[
                laneIndex
            ].classList.add(
                'holding'
            );


            showJudgement(

                'HOLD',

                'hold'

            );

        }

        else {

            cleanupNoteCompletely(
                index
            );


            awardSuccessfulNote(

                quality,

                laneIndex,

                false

            );

        }

    }

    else if (
        center
        <
        state.targetStart
    ) {

        state.combo =
            0;

    }

    else {

        finishGame(

            false,

            'Too late!'

        );

    }

}


function handleKeyUp(
    laneIndex
) {

    const note =

        state.activeHoldNote[
            laneIndex
        ];


    if (
        !note
    ) {

        return;

    }


    const index =

        state.notes.findIndex(

            n =>
                n.id
                ===
                note.id

        );


    if (
        index !== -1
    ) {

        cleanupNoteCompletely(
            index
        );


        finishGame(

            false,

            'Released too early!'

        );

    }

}


/* =========================================================
   START / FINISH
========================================================= */

function startConcert() {

    const wager =

        parseInt(

            ui.wagerInput.value,

            10

        );


    if (

        wager <= 0

        ||

        wager > state.chips

        ||

        Number.isNaN(
            wager
        )

    ) {

        showMessage(

            'Invalid wager!',

            'lose'

        );


        return;

    }


    state.chips -=
        wager;


    state.wager =
        wager;


    state.combo =
        0;


    state.spawnTimer =
        0;


    clearAllNotes();


    state.isPlaying =
        true;


    ui.startBtn.disabled =
        true;


    showJudgement(

        'READY',

        'good'

    );


    showMessage(

        `Show started at Tempo ${state.tempo.activeLevel}!`,

        'win'

    );

}


function finishGame(
    won,
    text
) {

    state.isPlaying =
        false;


    clearAllNotes();


    if (
        !won
    ) {

        state.combo =
            0;


        showJudgement(

            'BUST!',

            'miss'

        );


        triggerShake(
            'big'
        );


        flashScreen(
            '#ff376f'
        );

    }


    state.wager =
        0;


    ui.startBtn.disabled =
        false;


    showMessage(

        text,

        won
            ?
            'win'
            :
            'lose'

    );

}


/* =========================================================
   EFFECTS
========================================================= */

function playSuccessEffects(
    lane,
    quality,
    reward,
    text
) {

    flashLane(

        lane,

        quality.color

    );


    spawnParticles(

        lane,

        quality.particles,

        quality.color

    );


    showFloatingScore(

        lane,

        `+${formatNumber(reward)}`,

        quality.color

    );


    showJudgement(

        text,

        quality.className

    );


    triggerShake(
        quality.shake
    );

}


function flashLane(
    lane,
    color
) {

    const element =
        ui.lanes[
            lane
        ];


    element.style.setProperty(

        '--flash-color',

        color

    );


    element.classList.remove(
        'hit-flash'
    );


    void element.offsetWidth;


    element.classList.add(
        'hit-flash'
    );

}


function spawnParticles(
    lane,
    count,
    color
) {

    const width =

        ui.highway.clientWidth

        /

        4;


    const x =

        lane * width

        +

        width / 2;


    const y =

        (
            state.targetStart
            +
            state.targetEnd
        )

        /

        2;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =

            document.createElement(
                'div'
            );


        const angle =

            Math.random()

            *

            Math.PI

            *

            2;


        const distance =

            30

            +

            Math.random()
            *
            70;


        particle.className =
            'particle';


        particle.style.setProperty(
            '--x',
            `${x}px`
        );


        particle.style.setProperty(
            '--y',
            `${y}px`
        );


        particle.style.setProperty(
            '--dx',
            `${Math.cos(angle) * distance}px`
        );


        particle.style.setProperty(
            '--dy',
            `${Math.sin(angle) * distance}px`
        );


        particle.style.setProperty(
            '--rotation',
            `${Math.random() * 180}deg`
        );


        particle.style.setProperty(
            '--size',
            `${3 + Math.random() * 6}px`
        );


        particle.style.setProperty(
            '--radius',
            '50%'
        );


        particle.style.setProperty(
            '--particle-color',
            color
        );


        ui.effectsLayer.appendChild(
            particle
        );


        setTimeout(

            () =>
                particle.remove(),

            700

        );

    }

}


function showFloatingScore(
    lane,
    text,
    color
) {

    const width =

        ui.highway.clientWidth

        /

        4;


    const score =

        document.createElement(
            'div'
        );


    score.className =
        'floating-score';


    score.innerText =
        text;


    score.style.setProperty(

        '--x',

        `${lane * width + width / 2}px`

    );


    score.style.setProperty(

        '--y',

        `${state.targetStart}px`

    );


    score.style.setProperty(

        '--score-color',

        color

    );


    ui.effectsLayer.appendChild(
        score
    );


    setTimeout(

        () =>
            score.remove(),

        800

    );

}


function showJudgement(
    text,
    className
) {

    ui.judgement.innerText =
        text;


    ui.judgement.className =
        '';


    void ui.judgement.offsetWidth;


    ui.judgement.classList.add(

        className,

        'show'

    );

}


function triggerShake(
    strength
) {

    ui.gameShell.classList.remove(

        'shake-small',

        'shake-medium',

        'shake-big'

    );


    void ui.gameShell.offsetWidth;


    ui.gameShell.classList.add(

        `shake-${strength}`

    );

}


function flashScreen(
    color
) {

    ui.screenFlash.style.setProperty(

        '--screen-flash-color',

        color

    );


    ui.screenFlash.classList.remove(
        'fire'
    );


    void ui.screenFlash.offsetWidth;


    ui.screenFlash.classList.add(
        'fire'
    );

}


function showMessage(
    text,
    type
) {

    ui.message.innerText =
        text;


    ui.message.className =
        type;

}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    const idleIncome =
        getIdleIncomePerSecond();


    const fameMultiplier =
        getFameMultiplier();


    const fameGain =
        calculateFameGain();


    ui.chips.innerText =
        formatNumber(
            state.chips
        );


    ui.idleIncome.innerText =
        formatNumber(
            idleIncome
        );


    ui.comboDisplay.innerText =
        state.combo;


    ui.bestCombo.innerText =
        state.bestCombo;


    ui.comboMultiplier.innerText =

        `x${getComboMultiplier().toFixed(2)}`;


    ui.totalMultiplier.innerText =

        `x${getTotalPayoutMultiplier().toFixed(2)}`;


    document
        .getElementById(
            'casinoIncomeDisplay'
        )
        .innerText =

        `${formatNumber(idleIncome)}/sec`;


    document
        .getElementById(
            'fameMultiplierMini'
        )
        .innerText =

        `x${fameMultiplier}`;


    document
        .getElementById(
            'fameDisplay'
        )
        .innerText =
        state.fame;


    document
        .getElementById(
            'fameMultiplierDisplay'
        )
        .innerText =

        `x${fameMultiplier}`;


    document
        .getElementById(
            'runEarnedDisplay'
        )
        .innerText =

        formatNumber(
            state.runChipsEarned
        );


    document
        .getElementById(
            'fameGainDisplay'
        )
        .innerText =

        `+${fameGain} Fame`;


    document
        .getElementById(
            'sellCasinoBtn'
        )
        .disabled =

        fameGain <= 0;


    /* =========================
       BUILDINGS
    ========================= */

    for (
        const type
        of
        BUILDING_ORDER
    ) {

        const building =

            state
                .casino
                .buildings[
                    type
                ];


        const quantity =
            getPurchaseQuantity(
                type
            );


        const cost =

            quantity > 0

                ?

                getBulkCost(
                    type,
                    quantity
                )

                :

                getBulkCost(
                    type,
                    1
                );


        document
            .getElementById(
                `building-${type}-owned`
            )
            .innerText =
            building.amount;


        document
            .getElementById(
                `building-${type}-cost`
            )
            .innerText =

            formatNumber(
                cost
            );


        document
            .getElementById(
                `building-${type}-income`
            )
            .innerText =

            `${formatNumber(getBuildingIncome(building))}/sec • x${getBuildingMilestoneMultiplier(building.amount)}`;


        const next =
            getNextMilestone(
                building.amount
            );


        document
            .getElementById(
                `building-${type}-milestone`
            )
            .innerText =

            next

                ?

                `Next milestone: ${next}`

                :

                'All milestones unlocked';


        document
            .getElementById(
                `building-${type}`
            )
            .disabled =

            quantity <= 0

            ||

            state.chips < cost;

    }


    /* =========================
       BUY MODES
    ========================= */

    document
        .getElementById(
            'buyMode1'
        )
        .classList.toggle(

            'selected',

            state.buyMode === '1'

        );


    document
        .getElementById(
            'buyMode10'
        )
        .classList.toggle(

            'selected',

            state.buyMode === '10'

        );


    document
        .getElementById(
            'buyModeMax'
        )
        .classList.toggle(

            'selected',

            state.buyMode === 'max'

        );


    /* =========================
       TEMPO PURCHASE
    ========================= */

    const speedUpgrade =

        document.getElementById(
            'rightSpeedUpgrade'
        );


    speedUpgrade.disabled =

        state.chips
        <
        state.tempo.cost;


    document
        .getElementById(
            'rightSpeedCost'
        )
        .innerText =

        formatNumber(
            state.tempo.cost
        );


    document
        .getElementById(
            'rightSpeedLevel'
        )
        .innerText =

        state.tempo.unlockedLevel;


    /* =========================
       TEMPO SELECTOR
    ========================= */

    document
        .getElementById(
            'tempoLevelDisplay'
        )
        .innerText =

        `${state.tempo.activeLevel} / ${state.tempo.unlockedLevel}`;


    document
        .getElementById(
            'tempoSpeedDisplay'
        )
        .innerText =

        Math.round(
            state.noteSpeed
        );


    document
        .getElementById(
            'tempoPayoutDisplay'
        )
        .innerText =

        `x${state.payoutMultiplier.toFixed(2)}`;


    document
        .getElementById(
            'tempoDownBtn'
        )
        .disabled =

        state.isPlaying

        ||

        state.tempo.activeLevel <= 0;


    document
        .getElementById(
            'tempoUpBtn'
        )
        .disabled =

        state.isPlaying

        ||

        state.tempo.activeLevel
        >=
        state.tempo.unlockedLevel;


    /* =========================
       PERFORMANCE
    ========================= */

    document
        .getElementById(
            'tempoStat'
        )
        .innerText =

        Math.round(
            state.noteSpeed
        );


    document
        .getElementById(
            'payoutStat'
        )
        .innerText =

        `x${state.payoutMultiplier.toFixed(2)}`;


    document
        .getElementById(
            'rightBestCombo'
        )
        .innerText =

        state.bestCombo;


    document
        .getElementById(
            'rightFameMultiplier'
        )
        .innerText =

        `x${fameMultiplier}`;


    /* =========================
       JACKPOT
    ========================= */

    const jackpotPercent =

        state.jackpot

        /

        state.jackpotMax

        *

        100;


    document
        .getElementById(
            'jackpotFill'
        )
        .style.width =

        `${jackpotPercent}%`;


    document
        .getElementById(
            'jackpotText'
        )
        .innerText =

        `${Math.floor(state.jackpot)} / ${state.jackpotMax}`;


    const feverButton =

        document.getElementById(
            'feverBtn'
        );


    if (
        state.feverActive
    ) {

        feverButton.disabled =
            true;


        feverButton.innerText =

            `FEVER x3 • ${state.feverTimeRemaining.toFixed(1)}s`;

    }

    else if (
        state.jackpot
        >=
        state.jackpotMax
    ) {

        feverButton.disabled =
            false;


        feverButton.innerText =
            'ACTIVATE FEVER';

    }

    else {

        feverButton.disabled =
            true;


        feverButton.innerText =

            `FEVER LOCKED • ${Math.floor(jackpotPercent)}%`;

    }

}


/* =========================================================
   SAVE
========================================================= */

function saveGame() {

    try {

        localStorage.setItem(

            SAVE_KEY,

            JSON.stringify({

                chips:
                    state.chips,

                fame:
                    state.fame,

                runChipsEarned:
                    state.runChipsEarned,

                lifetimeChipsEarned:
                    state.lifetimeChipsEarned,

                bestCombo:
                    state.bestCombo,

                casino:
                    state.casino,

                buyMode:
                    state.buyMode,

                tempo:
                    state.tempo,

                jackpot:
                    state.jackpot,

                savedAt:
                    Date.now()

            })

        );

    }

    catch (
        error
    ) {

        console.error(

            'Save failed:',

            error

        );

    }

}


/* =========================================================
   LOAD
========================================================= */

function loadGame() {

    let raw =

        localStorage.getItem(
            SAVE_KEY
        );


    /*
        Try old V3 save so existing
        progress isn't automatically lost.
    */

    if (
        !raw
    ) {

        raw =
            localStorage.getItem(
                OLD_SAVE_KEY
            );

    }


    if (
        !raw
    ) {

        syncTempoStats();

        return;

    }


    try {

        const save =
            JSON.parse(
                raw
            );


        state.chips =
            save.chips
            ??
            state.chips;


        state.fame =
            save.fame
            ??
            0;


        state.runChipsEarned =
            save.runChipsEarned
            ??
            0;


        state.lifetimeChipsEarned =
            save.lifetimeChipsEarned
            ??
            0;


        state.bestCombo =
            save.bestCombo
            ??
            0;


        state.buyMode =
            save.buyMode
            ??
            '1';


        if (
            save.casino
        ) {

            for (
                const type
                of
                BUILDING_ORDER
            ) {

                const savedBuilding =

                    save
                        .casino
                        .buildings
                        ?.[type];


                if (
                    savedBuilding
                ) {

                    Object.assign(

                        state
                            .casino
                            .buildings[
                                type
                            ],

                        savedBuilding

                    );

                }

            }

        }


        /* =========================
           NEW TEMPO SAVE
        ========================= */

        if (
            save.tempo
        ) {

            Object.assign(

                state.tempo,

                save.tempo

            );

        }


        /* =========================
           MIGRATE OLD TEMPO SAVE
        ========================= */

        else if (
            save.upgrades
            ?.speed
        ) {

            const oldLevel =

                save
                    .upgrades
                    .speed
                    .level

                ??
                0;


            state.tempo.unlockedLevel =
                oldLevel;


            state.tempo.activeLevel =
                Math.min(

                    oldLevel,

                    5

                );


            /*
                Recalculate price based
                on new gentler system.
            */

            state.tempo.cost =

                Math.floor(

                    state.tempo.baseCost

                    *

                    Math.pow(

                        state.tempo.costMult,

                        oldLevel

                    )

                );

        }


        state.jackpot =
            save.jackpot
            ??
            0;


        state.feverActive =
            false;


        state.feverTimeRemaining =
            0;


        syncTempoStats();


        if (
            save.savedAt
        ) {

            const secondsAway =

                Math.min(

                    OFFLINE_CAP_SECONDS,

                    Math.max(

                        0,

                        (
                            Date.now()
                            -
                            save.savedAt
                        )

                        /

                        1000

                    )

                );


            if (
                secondsAway > 5
            ) {

                const reward =

                    getIdleIncomePerSecond()

                    *

                    secondsAway;


                addChips(
                    reward
                );


                showMessage(

                    `Offline earnings: ${formatNumber(reward)} chips!`,

                    'win'

                );

            }

        }

    }

    catch (
        error
    ) {

        console.error(

            'Load failed:',

            error

        );


        syncTempoStats();

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

const keyMap = {

    KeyD: 0,

    KeyF: 1,

    KeyJ: 2,

    KeyK: 3

};


document.addEventListener(

    'keydown',

    event => {

        if (

            event.code
            in
            keyMap

            &&

            !event.repeat

        ) {

            event.preventDefault();


            handleKeyDown(

                keyMap[
                    event.code
                ]

            );

        }

    }

);


document.addEventListener(

    'keyup',

    event => {

        if (
            event.code
            in
            keyMap
        ) {

            event.preventDefault();


            handleKeyUp(

                keyMap[
                    event.code
                ]

            );

        }

    }

);


document.addEventListener(

    'visibilitychange',

    () => {

        if (

            document.hidden

            &&

            state.isPlaying

        ) {

            finishGame(

                false,

                'Stage abandoned!'

            );

        }

    }

);


window.addEventListener(

    'beforeunload',

    saveGame

);


/* =========================================================
   START
========================================================= */

loadGame();


state.lastTick =
    performance.now();


updateUI();


requestAnimationFrame(
    gameLoop
);