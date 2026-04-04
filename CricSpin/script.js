// Game State
let gameState = {
    team1: {
        name: 'Team 1',
        score: 0,
        wickets: 0,
        ballsPlayed: 0,
        batters: [],
        bowlers: [],
        currentBatterIndex: 0,
        currentBowlerIndex: 0
    },
    team2: {
        name: 'Team 2',
        score: 0,
        wickets: 0,
        ballsPlayed: 0,
        batters: [],
        bowlers: [],
        currentBatterIndex: 0,
        currentBowlerIndex: 0
    },
    battingTeam: null,
    bowlingTeam: null,
    firstBattingTeam: null,
    overs: 2,
    wicketsSetting: 2,
    currentInnings: 1,
    target: null,
    isFreeHit: false,
    isSuperOver: false,
    superOverCount: 0,
    tossWinner: null,
    tossLoser: null
};

// Wheel Segments - MIXED UP (runs, outs, extras shuffled)
const segments = [
    { value: '0', type: 'run', label: 'Dot Ball', short: '0' },
    { value: '6', type: 'run', label: '6 Runs', short: '6' },
    { value: 'runout', type: 'out', label: 'Run Out', short: 'RO' },
    { value: 'wide', type: 'extra', label: 'Wide', short: 'WD' },
    { value: '4', type: 'run', label: '4 Runs', short: '4' },
    { value: 'noball', type: 'extra', label: 'No Ball', short: 'NB' },
    { value: 'catch', type: 'out', label: 'Catch Out', short: 'C' },
    { value: '2', type: 'run', label: '2 Runs', short: '2' },
    { value: 'legby', type: 'extra', label: 'Leg By', short: 'LB' },
    { value: 'bowled', type: 'out', label: 'Bowled Out', short: 'B' },
    { value: '3', type: 'run', label: '3 Runs', short: '3' },
    { value: 'stumped', type: 'out', label: 'Stumped', short: 'ST' },
    { value: '1', type: 'run', label: '1 Run', short: '1' },
    { value: 'hitout', type: 'out', label: 'Hit Out', short: 'HO' }
];

// DOM Elements
const elements = {
    homeScreen: document.getElementById('homeScreen'),
    tossScreen: document.getElementById('tossScreen'),
    gameScreen: document.getElementById('gameScreen'),
    rulesModal: document.getElementById('rulesModal'),
    tossResultModal: document.getElementById('tossResultModal'),
    freeHitModal: document.getElementById('freeHitModal'),
    inningsBreakModal: document.getElementById('inningsBreakModal'),
    resultModal: document.getElementById('resultModal'),
    
    team1NameInput: document.getElementById('team1Name'),
    team2NameInput: document.getElementById('team2Name'),
    oversValue: document.getElementById('oversValue'),
    wicketsValue: document.getElementById('wicketsValue'),
    
    startMatchBtn: document.getElementById('startMatchBtn'),
    rulesBtn: document.getElementById('rulesBtn'),
    closeRulesBtn: document.getElementById('closeRulesBtn'),
    
    oversMinus: document.getElementById('oversMinus'),
    oversPlus: document.getElementById('oversPlus'),
    wicketsMinus: document.getElementById('wicketsMinus'),
    wicketsPlus: document.getElementById('wicketsPlus'),
    
    tossCaller: document.getElementById('tossCaller'),
    headBtn: document.getElementById('headBtn'),
    tailBtn: document.getElementById('tailBtn'),
    
    tossResultText: document.getElementById('tossResultText'),
    tossWinnerText: document.getElementById('tossWinnerText'),
    choiceButtons: document.getElementById('choiceButtons'),
    waitingText: document.getElementById('waitingText'),
    batFirstBtn: document.getElementById('batFirstBtn'),
    bowlFirstBtn: document.getElementById('bowlFirstBtn'),
    
    battingTeamName: document.getElementById('battingTeamName'),
    battingIndicator: document.getElementById('battingIndicator'),
    inningsText: document.getElementById('inningsText'),
    teamScore: document.getElementById('teamScore'),
    teamWickets: document.getElementById('teamWickets'),
    wktsLeft: document.getElementById('wktsLeft'),
    ballsLeft: document.getElementById('ballsLeft'),
    
    battersList: document.getElementById('battersList'),
    bowlersList: document.getElementById('bowlersList'),
    
    wheel: document.getElementById('wheel'),
    playBtn: document.getElementById('playBtn'),
    quitGameBtn: document.getElementById('quitGameBtn'),
    ballResult: document.getElementById('ballResult'),
    
    freeHitOkBtn: document.getElementById('freeHitOkBtn'),
    inningsBreakScore: document.getElementById('inningsBreakScore'),
    targetText: document.getElementById('targetText'),
    startSecondInningsBtn: document.getElementById('startSecondInningsBtn'),
    
    resultTitle: document.getElementById('resultTitle'),
    resultScore: document.getElementById('resultScore'),
    mostRunsPlayer: document.getElementById('mostRunsPlayer'),
    mostWicketsPlayer: document.getElementById('mostWicketsPlayer'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    quitBtn: document.getElementById('quitBtn')
};

// Store original settings
let originalOvers = 2;
let originalWickets = 2;

// Create wheel segment labels
function createWheelLabels() {
    const wheel = elements.wheel;
    const wheelSize = wheel.offsetWidth || 240;
    const radius = wheelSize / 2 - 25;
    const segmentAngle = 360 / 14;
    
    segments.forEach((seg, index) => {
        const label = document.createElement('div');
        label.className = 'segment-label';
        label.textContent = seg.short;
        
        const angle = (index * segmentAngle) + (segmentAngle / 2);
        const radians = (angle - 90) * (Math.PI / 180);
        
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        
        label.style.left = `calc(50% + ${x}px - 10px)`;
        label.style.top = `calc(50% + ${y}px - 8px)`;
        
        wheel.appendChild(label);
    });
}

// Initialize players
function initializePlayers() {
    const wickets = gameState.wicketsSetting;
    
    gameState.team1.batters = [];
    gameState.team1.bowlers = [];
    for (let i = 0; i < wickets; i++) {
        gameState.team1.batters.push({
            name: `${gameState.team1.name} Batter ${i + 1}`,
            runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false
        });
        gameState.team1.bowlers.push({
            name: `${gameState.team1.name} Bowler ${i + 1}`,
            overs: 0, balls: 0, runs: 0, wickets: 0
        });
    }
    
    gameState.team2.batters = [];
    gameState.team2.bowlers = [];
    for (let i = 0; i < wickets; i++) {
        gameState.team2.batters.push({
            name: `${gameState.team2.name} Batter ${i + 1}`,
            runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false
        });
        gameState.team2.bowlers.push({
            name: `${gameState.team2.name} Bowler ${i + 1}`,
            overs: 0, balls: 0, runs: 0, wickets: 0
        });
    }
    
    gameState.team1.currentBatterIndex = 0;
    gameState.team1.currentBowlerIndex = 0;
    gameState.team2.currentBatterIndex = 0;
    gameState.team2.currentBowlerIndex = 0;
}

// Reset game state
function resetGameState() {
    gameState.team1.score = 0;
    gameState.team1.wickets = 0;
    gameState.team1.ballsPlayed = 0;
    gameState.team1.currentBatterIndex = 0;
    gameState.team1.currentBowlerIndex = 0;
    
    gameState.team2.score = 0;
    gameState.team2.wickets = 0;
    gameState.team2.ballsPlayed = 0;
    gameState.team2.currentBatterIndex = 0;
    gameState.team2.currentBowlerIndex = 0;
    
    gameState.currentInnings = 1;
    gameState.target = null;
    gameState.isFreeHit = false;
    gameState.isSuperOver = false;
    gameState.superOverCount = 0;
    gameState.firstBattingTeam = null;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Event Listeners
elements.oversValue.addEventListener('input', () => {
    let value = parseInt(elements.oversValue.value) || 1;
    value = clamp(value, 1, 50);
    elements.oversValue.value = value;
});

elements.oversValue.addEventListener('blur', () => {
    let value = parseInt(elements.oversValue.value) || 1;
    value = clamp(value, 1, 50);
    elements.oversValue.value = value;
});

elements.wicketsValue.addEventListener('input', () => {
    let value = parseInt(elements.wicketsValue.value) || 1;
    value = clamp(value, 1, 10);
    elements.wicketsValue.value = value;
});

elements.wicketsValue.addEventListener('blur', () => {
    let value = parseInt(elements.wicketsValue.value) || 1;
    value = clamp(value, 1, 10);
    elements.wicketsValue.value = value;
});

elements.oversMinus.addEventListener('click', () => {
    let value = parseInt(elements.oversValue.value) || 1;
    value = clamp(value - 1, 1, 50);
    elements.oversValue.value = value;
});

elements.oversPlus.addEventListener('click', () => {
    let value = parseInt(elements.oversValue.value) || 1;
    value = clamp(value + 1, 1, 50);
    elements.oversValue.value = value;
});

elements.wicketsMinus.addEventListener('click', () => {
    let value = parseInt(elements.wicketsValue.value) || 1;
    value = clamp(value - 1, 1, 10);
    elements.wicketsValue.value = value;
});

elements.wicketsPlus.addEventListener('click', () => {
    let value = parseInt(elements.wicketsValue.value) || 1;
    value = clamp(value + 1, 1, 10);
    elements.wicketsValue.value = value;
});

elements.rulesBtn.addEventListener('click', () => {
    elements.rulesModal.classList.remove('hidden');
});

elements.closeRulesBtn.addEventListener('click', () => {
    elements.rulesModal.classList.add('hidden');
});

elements.startMatchBtn.addEventListener('click', () => {
    gameState.team1.name = elements.team1NameInput.value.trim() || 'Team 1';
    gameState.team2.name = elements.team2NameInput.value.trim() || 'Team 2';
    gameState.overs = parseInt(elements.oversValue.value) || 2;
    gameState.wicketsSetting = parseInt(elements.wicketsValue.value) || 2;
    
    originalOvers = gameState.overs;
    originalWickets = gameState.wicketsSetting;
    
    initializePlayers();
    
    elements.homeScreen.classList.add('hidden');
    elements.tossScreen.classList.remove('hidden');
    elements.tossCaller.textContent = `${gameState.team1.name} calls`;
});

// Toss Logic
elements.headBtn.addEventListener('click', () => handleToss('head'));
elements.tailBtn.addEventListener('click', () => handleToss('tail'));

function handleToss(call) {
    const result = Math.random() < 0.5 ? 'head' : 'tail';
    const won = call === result;
    
    elements.tossScreen.classList.add('hidden');
    elements.tossResultModal.classList.remove('hidden');
    
    elements.tossResultText.textContent = `It's ${result.toUpperCase()}!`;
    
    if (won) {
        gameState.tossWinner = gameState.team1;
        gameState.tossLoser = gameState.team2;
        elements.tossWinnerText.textContent = `${gameState.team1.name} won the toss!`;
        elements.choiceButtons.classList.remove('hidden');
        elements.waitingText.classList.add('hidden');
    } else {
        gameState.tossWinner = gameState.team2;
        gameState.tossLoser = gameState.team1;
        elements.tossWinnerText.textContent = `${gameState.team2.name} won the toss!`;
        elements.choiceButtons.classList.add('hidden');
        elements.waitingText.classList.remove('hidden');
        elements.waitingText.textContent = `${gameState.team2.name} is choosing...`;
        
        setTimeout(() => {
            const choice = Math.random() < 0.5 ? 'bat' : 'bowl';
            if (choice === 'bat') {
                gameState.battingTeam = gameState.team2;
                gameState.bowlingTeam = gameState.team1;
                elements.waitingText.textContent = `${gameState.team2.name} chose to Bat First`;
            } else {
                gameState.battingTeam = gameState.team1;
                gameState.bowlingTeam = gameState.team2;
                elements.waitingText.textContent = `${gameState.team2.name} chose to Bowl First`;
            }
            
            setTimeout(() => {
                elements.tossResultModal.classList.add('hidden');
                startGame();
            }, 1500);
        }, 1500);
    }
}

elements.batFirstBtn.addEventListener('click', () => {
    gameState.battingTeam = gameState.team1;
    gameState.bowlingTeam = gameState.team2;
    elements.tossResultModal.classList.add('hidden');
    startGame();
});

elements.bowlFirstBtn.addEventListener('click', () => {
    gameState.battingTeam = gameState.team2;
    gameState.bowlingTeam = gameState.team1;
    elements.tossResultModal.classList.add('hidden');
    startGame();
});

// Start Game
function startGame() {
    gameState.firstBattingTeam = gameState.battingTeam;
    
    elements.gameScreen.classList.remove('hidden');
    createWheelLabels();
    updateScorecard();
    updateBattersList();
    updateBowlersList();
}

// Update Scorecard
function updateScorecard() {
    elements.battingTeamName.textContent = gameState.battingTeam.name;
    elements.teamScore.textContent = gameState.battingTeam.score;
    elements.teamWickets.textContent = gameState.battingTeam.wickets;
    
    const wktsLeft = gameState.wicketsSetting - gameState.battingTeam.wickets;
    const totalBalls = gameState.overs * 6;
    const ballsLeft = totalBalls - gameState.battingTeam.ballsPlayed;
    
    elements.wktsLeft.textContent = wktsLeft;
    elements.ballsLeft.textContent = ballsLeft;
    
    if (gameState.isSuperOver) {
        elements.inningsText.textContent = `Super Over ${gameState.superOverCount}`;
    } else {
        elements.inningsText.textContent = gameState.currentInnings === 1 ? '1st Innings' : '2nd Innings';
    }
}

// Update Batters List
function updateBattersList() {
    let html = '';
    gameState.battingTeam.batters.forEach((batter, index) => {
        const isActive = index === gameState.battingTeam.currentBatterIndex && !batter.isOut;
        const activeClass = isActive ? 'active' : '';
        const outText = batter.isOut ? ' (Out)' : '';
        
        html += `
            <div class="batter-row ${activeClass}">
                <div class="batter-name">${batter.name}${outText}${isActive ? ' *' : ''}</div>
                <div class="batter-stats">
                    R:${batter.runs} B:${batter.balls} 4s:${batter.fours} 6s:${batter.sixes}
                </div>
            </div>
        `;
    });
    elements.battersList.innerHTML = html;
}

// Update Bowlers List
function updateBowlersList() {
    let html = '';
    gameState.bowlingTeam.bowlers.forEach((bowler, index) => {
        const isActive = index === gameState.bowlingTeam.currentBowlerIndex;
        const activeClass = isActive ? 'active' : '';
        const oversDisplay = `${bowler.overs}.${bowler.balls}`;
        const indicator = isActive ? '<span class="bowler-indicator"></span>' : '';
        
        html += `
            <div class="bowler-row ${activeClass}">
                <div class="bowler-name">${bowler.name}${indicator}</div>
                <div class="bowler-stats">
                    Ov:${oversDisplay} R:${bowler.runs} Wk:${bowler.wickets}
                </div>
            </div>
        `;
    });
    elements.bowlersList.innerHTML = html;
}

// Spin Wheel
let isSpinning = false;
let currentRotation = 0;

elements.playBtn.addEventListener('click', () => {
    if (isSpinning) return;
    
    isSpinning = true;
    elements.playBtn.disabled = true;
    elements.ballResult.classList.add('hidden');
    
    const segmentAngle = 360 / 14;
    const targetSegment = Math.floor(Math.random() * 14);
    const segmentCenterAngle = targetSegment * segmentAngle + (segmentAngle / 2);
    // Fixed fast spin: 5-6 full rotations always
    const fullRotations = 5 + Math.floor(Math.random() * 2);
    const rotationToSegment = 360 - segmentCenterAngle;
    
    currentRotation = fullRotations * 360 + rotationToSegment;
    elements.wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    // Match the CSS transition time (2.5s)
    setTimeout(() => {
        const result = segments[targetSegment];
        processResult(result);
        
        isSpinning = false;
        elements.playBtn.disabled = false;
    }, 2500);
});

// Process Spin Result
function processResult(result) {
    const battingTeam = gameState.battingTeam;
    const bowlingTeam = gameState.bowlingTeam;
    const currentBatter = battingTeam.batters[battingTeam.currentBatterIndex];
    const currentBowler = bowlingTeam.bowlers[bowlingTeam.currentBowlerIndex];
    
    let resultText = '';
    let resultClass = '';
    
    switch (result.type) {
        case 'run':
            const runs = parseInt(result.value);
            battingTeam.score += runs;
            currentBatter.runs += runs;
            currentBatter.balls++;
            battingTeam.ballsPlayed++;
            currentBowler.runs += runs;
            currentBowler.balls++;
            
            if (runs === 4) currentBatter.fours++;
            if (runs === 6) currentBatter.sixes++;
            
            resultText = result.value === '0' ? 'Dot Ball!' : `${result.value} Run${runs > 1 ? 's' : ''}!`;
            resultClass = runs > 0 ? 'run' : '';
            
            if (gameState.isFreeHit) {
                gameState.isFreeHit = false;
            }
            break;
            
        case 'extra':
            battingTeam.score += 1;
            currentBowler.runs += 1;
            
            if (result.value === 'wide') {
                resultText = 'Wide! +1 Run (Ball not counted)';
                resultClass = 'extra';
            } else if (result.value === 'noball') {
                resultText = 'No Ball! +1 Run (Ball not counted)';
                resultClass = 'extra';
                gameState.isFreeHit = true;
            } else if (result.value === 'legby') {
                resultText = 'Leg By! +1 Run';
                resultClass = 'extra';
                battingTeam.ballsPlayed++;
                currentBatter.balls++;
                currentBowler.balls++;
            }
            break;
            
        case 'out':
            const isOut = checkIfOut(result.value);
            
            if (isOut) {
                battingTeam.wickets++;
                currentBatter.isOut = true;
                currentBowler.wickets++;
                battingTeam.ballsPlayed++;
                currentBatter.balls++;
                currentBowler.balls++;
                
                resultText = `${result.label}! Batter Out!`;
                resultClass = 'out';
                
                const nextBatterIndex = battingTeam.batters.findIndex((b, i) => i > battingTeam.currentBatterIndex && !b.isOut);
                if (nextBatterIndex !== -1) {
                    battingTeam.currentBatterIndex = nextBatterIndex;
                }
                
                gameState.isFreeHit = false;
            } else {
                battingTeam.ballsPlayed++;
                currentBatter.balls++;
                currentBowler.balls++;
                
                resultText = `${result.label}! But it's a FREE HIT - Not Out!`;
                resultClass = 'extra';
                gameState.isFreeHit = false;
            }
            break;
    }
    
    if (currentBowler.balls === 6) {
        currentBowler.overs++;
        currentBowler.balls = 0;
        
        const nextBowlerIndex = (bowlingTeam.currentBowlerIndex + 1) % bowlingTeam.bowlers.length;
        bowlingTeam.currentBowlerIndex = nextBowlerIndex;
    }
    
    elements.ballResult.textContent = resultText;
    elements.ballResult.className = `ball-result ${resultClass}`;
    elements.ballResult.classList.remove('hidden');
    
    updateScorecard();
    updateBattersList();
    updateBowlersList();
    
    if (result.value === 'noball') {
        setTimeout(() => {
            elements.freeHitModal.classList.remove('hidden');
        }, 500);
    }
    
    checkInningsEnd();
}

function checkIfOut(outType) {
    if (gameState.isFreeHit) {
        return outType === 'runout';
    }
    return true;
}

elements.freeHitOkBtn.addEventListener('click', () => {
    elements.freeHitModal.classList.add('hidden');
});

function checkInningsEnd() {
    const battingTeam = gameState.battingTeam;
    const totalBalls = gameState.overs * 6;
    
    const allOut = battingTeam.wickets >= gameState.wicketsSetting;
    const oversComplete = battingTeam.ballsPlayed >= totalBalls;
    const targetReached = gameState.target && battingTeam.score >= gameState.target;
    
    if (allOut || oversComplete || targetReached) {
        setTimeout(() => {
            if (gameState.currentInnings === 1 && !gameState.isSuperOver) {
                if (targetReached) {
                    showResult();
                } else {
                    showInningsBreak();
                }
            } else if (gameState.isSuperOver && gameState.currentInnings === 1) {
                showSuperOverInningsBreak();
            } else {
                showResult();
            }
        }, 1000);
    }
}

function showInningsBreak() {
    elements.inningsBreakScore.textContent = `${gameState.battingTeam.name} scored: ${gameState.battingTeam.score}/${gameState.battingTeam.wickets}`;
    gameState.target = gameState.battingTeam.score + 1;
    elements.targetText.textContent = `Target: ${gameState.target} runs needed from ${gameState.overs * 6} balls`;
    elements.startSecondInningsBtn.textContent = 'Start 2nd Innings';
    elements.inningsBreakModal.classList.remove('hidden');
}

function showSuperOverInningsBreak() {
    elements.inningsBreakScore.textContent = `${gameState.battingTeam.name} scored: ${gameState.battingTeam.score}/${gameState.battingTeam.wickets}`;
    gameState.target = gameState.battingTeam.score + 1;
    elements.targetText.textContent = `Target: ${gameState.target} runs from 6 balls`;
    elements.startSecondInningsBtn.textContent = 'Continue';
    elements.inningsBreakModal.classList.remove('hidden');
}

elements.startSecondInningsBtn.addEventListener('click', () => {
    elements.inningsBreakModal.classList.add('hidden');
    
    const temp = gameState.battingTeam;
    gameState.battingTeam = gameState.bowlingTeam;
    gameState.bowlingTeam = temp;
    
    if (gameState.isSuperOver) {
        gameState.battingTeam.score = 0;
        gameState.battingTeam.wickets = 0;
        gameState.battingTeam.ballsPlayed = 0;
        gameState.battingTeam.currentBatterIndex = 0;
        
        gameState.battingTeam.batters.forEach(b => {
            b.runs = 0; b.balls = 0; b.fours = 0; b.sixes = 0; b.isOut = false;
        });
        gameState.battingTeam.bowlers.forEach(b => {
            b.overs = 0; b.balls = 0; b.runs = 0; b.wickets = 0;
        });
        
        gameState.currentInnings = 2;
    } else {
        gameState.currentInnings = 2;
    }
    
    gameState.isFreeHit = false;
    
    updateScorecard();
    updateBattersList();
    updateBowlersList();
});

function showResult() {
    const firstBatted = gameState.firstBattingTeam;
    const secondBatted = (firstBatted === gameState.team1) ? gameState.team2 : gameState.team1;
    
    let winner, loser;
    let winText = '';
    
    if (firstBatted.score > secondBatted.score) {
        winner = firstBatted;
        loser = secondBatted;
        const margin = firstBatted.score - secondBatted.score;
        winText = `${winner.name} won by ${margin} run${margin > 1 ? 's' : ''}`;
    } else if (secondBatted.score > firstBatted.score) {
        winner = secondBatted;
        loser = firstBatted;
        const wktsLeft = gameState.wicketsSetting - secondBatted.wickets;
        winText = `${winner.name} won by ${wktsLeft} wicket${wktsLeft > 1 ? 's' : ''}`;
    } else {
        if (!gameState.isSuperOver) {
            startSuperOver();
            return;
        } else {
            startSuperOver();
            return;
        }
    }
    
    elements.resultTitle.textContent = `${winner.name} Won!`;
    elements.resultScore.textContent = winText;
    
    let mostRuns = { name: '', runs: 0 };
    let mostWickets = { name: '', wickets: 0 };
    
    [...gameState.team1.batters, ...gameState.team2.batters].forEach(batter => {
        if (batter.runs > mostRuns.runs) {
            mostRuns = { name: batter.name, runs: batter.runs };
        }
    });
    
    [...gameState.team1.bowlers, ...gameState.team2.bowlers].forEach(bowler => {
        if (bowler.wickets > mostWickets.wickets) {
            mostWickets = { name: bowler.name, wickets: bowler.wickets };
        }
    });
    
    elements.mostRunsPlayer.textContent = `${mostRuns.name} - ${mostRuns.runs} runs`;
    elements.mostWicketsPlayer.textContent = `${mostWickets.name} - ${mostWickets.wickets} wicket${mostWickets.wickets !== 1 ? 's' : ''}`;
    
    elements.resultModal.classList.remove('hidden');
}

function startSuperOver() {
    gameState.isSuperOver = true;
    gameState.superOverCount++;
    
    gameState.overs = 1;
    gameState.wicketsSetting = 2;
    
    gameState.team1.score = 0;
    gameState.team1.wickets = 0;
    gameState.team1.ballsPlayed = 0;
    gameState.team1.currentBatterIndex = 0;
    gameState.team1.currentBowlerIndex = 0;
    
    gameState.team2.score = 0;
    gameState.team2.wickets = 0;
    gameState.team2.ballsPlayed = 0;
    gameState.team2.currentBatterIndex = 0;
    gameState.team2.currentBowlerIndex = 0;
    
    gameState.team1.batters = [];
    gameState.team1.bowlers = [];
    for (let i = 0; i < 2; i++) {
        gameState.team1.batters.push({
            name: `${gameState.team1.name} Batter ${i + 1}`,
            runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false
        });
        gameState.team1.bowlers.push({
            name: `${gameState.team1.name} Bowler ${i + 1}`,
            overs: 0, balls: 0, runs: 0, wickets: 0
        });
    }
    
    gameState.team2.batters = [];
    gameState.team2.bowlers = [];
    for (let i = 0; i < 2; i++) {
        gameState.team2.batters.push({
            name: `${gameState.team2.name} Batter ${i + 1}`,
            runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false
        });
        gameState.team2.bowlers.push({
            name: `${gameState.team2.name} Bowler ${i + 1}`,
            overs: 0, balls: 0, runs: 0, wickets: 0
        });
    }
    
    gameState.battingTeam = null;
    gameState.bowlingTeam = null;
    gameState.firstBattingTeam = null;
    
    elements.gameScreen.classList.add('hidden');
    elements.tossScreen.classList.remove('hidden');
    elements.tossCaller.textContent = `${gameState.team1.name} calls (Super Over ${gameState.superOverCount} Toss)`;
    
    gameState.target = null;
    gameState.currentInnings = 1;
}

// Quit button during game
elements.quitGameBtn.addEventListener('click', () => {
    elements.gameScreen.classList.add('hidden');
    elements.homeScreen.classList.remove('hidden');
    
    gameState.overs = originalOvers;
    gameState.wicketsSetting = originalWickets;
    elements.oversValue.value = originalOvers;
    elements.wicketsValue.value = originalWickets;
    elements.team1NameInput.value = '';
    elements.team2NameInput.value = '';
    
    // Remove old wheel labels
    const labels = elements.wheel.querySelectorAll('.segment-label');
    labels.forEach(label => label.remove());
    
    resetGameState();
});

elements.playAgainBtn.addEventListener('click', () => {
    elements.resultModal.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    
    gameState.overs = originalOvers;
    gameState.wicketsSetting = originalWickets;
    elements.oversValue.value = originalOvers;
    elements.wicketsValue.value = originalWickets;
    elements.team1NameInput.value = '';
    elements.team2NameInput.value = '';
    
    // Remove old wheel labels
    const labels = elements.wheel.querySelectorAll('.segment-label');
    labels.forEach(label => label.remove());
    
    resetGameState();
    
    elements.homeScreen.classList.remove('hidden');
});

elements.quitBtn.addEventListener('click', () => {
    elements.resultModal.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.homeScreen.classList.remove('hidden');
    
    gameState.overs = originalOvers;
    gameState.wicketsSetting = originalWickets;
    elements.oversValue.value = originalOvers;
    elements.wicketsValue.value = originalWickets;
    elements.team1NameInput.value = '';
    elements.team2NameInput.value = '';
    
    // Remove old wheel labels
    const labels = elements.wheel.querySelectorAll('.segment-label');
    labels.forEach(label => label.remove());
    
    resetGameState();
});
