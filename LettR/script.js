// Game State
const gameState = {
    players: [
        { name: 'Player 1', score: 0, time: 0, answers: null, letter: null, roundScore: 0, bonus: false },
        { name: 'Player 2', score: 0, time: 0, answers: null, letter: null, roundScore: 0, bonus: false }
    ],
    currentRound: 1,
    currentPlayerIndex: 0,
    timer: null,
    timeLeft: 60,
    isGameActive: false,
    maxRounds: 5
};

// DOM Elements
const elements = {
    landingPage: document.getElementById('landing-page'),
    gamePage: document.getElementById('game-page'),
    player1Name: document.getElementById('player1-name'),
    player2Name: document.getElementById('player2-name'),
    playBtn: document.getElementById('play-btn'),
    rulesBtn: document.getElementById('rules-btn'),
    rulesModal: document.getElementById('rules-modal'),
    closeRules: document.getElementById('close-rules'),
    roundNumber: document.getElementById('round-number'),
    currentPlayerTurn: document.getElementById('current-player-turn'),
    turnPlayerName: document.getElementById('turn-player-name'),
    p1Score: document.getElementById('p1-score'),
    p2Score: document.getElementById('p2-score'),
    currentLetter: document.getElementById('current-letter'),
    timerSeconds: document.getElementById('timer-seconds'),
    timerProgress: document.getElementById('timer-progress'),
    gameForm: document.getElementById('game-form'),
    inputName: document.getElementById('input-name'),
    inputPlace: document.getElementById('input-place'),
    inputMovie: document.getElementById('input-movie'),
    inputThing: document.getElementById('input-thing'),
    validationOverlay: document.getElementById('validation-overlay'),
    resultsModal: document.getElementById('results-modal'),
    resultsBody: document.getElementById('results-body'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    quitBtn: document.getElementById('quit-btn'),
    gameoverModal: document.getElementById('gameover-modal'),
    gameoverBody: document.getElementById('gameover-body'),
    playAgainBtn: document.getElementById('play-again-btn'),
    homeBtn: document.getElementById('home-btn'),
    gameMain: document.getElementById('game-main'),
    gameInfoBar: document.getElementById('game-info-bar'),
    handoffOverlay: document.getElementById('handoff-overlay'),
    handoffPlayerName: document.getElementById('handoff-player-name'),
    handoffReadyBtn: document.getElementById('handoff-ready-btn'),
    quitModal: document.getElementById('quit-modal'),
    resumeBtn: document.getElementById('resume-btn'),
    finishBtn: document.getElementById('finish-btn'),
    gameQuitBtn: document.getElementById('game-quit-btn')
};

// --- Helper Functions ---

function getRandomLetter() {
    const weights = {
        'A': 3, 'B': 2, 'C': 3, 'D': 2, 'E': 2, 'F': 2, 'G': 2, 'H': 2,
        'I': 2, 'J': 1, 'K': 1, 'L': 2, 'M': 3, 'N': 2, 'O': 2, 'P': 3,
        'Q': 1, 'R': 2, 'S': 4, 'T': 3, 'U': 1, 'V': 1, 'W': 2, 'X': 1,
        'Y': 1, 'Z': 1
    };
    let weightedLetters = [];
    for (const [letter, weight] of Object.entries(weights)) {
        for (let i = 0; i < weight; i++) weightedLetters.push(letter);
    }
    return weightedLetters[Math.floor(Math.random() * weightedLetters.length)];
}

// --- Validation Logic ---

async function checkDictionary(word) {
    if (!word || word.length < 2) return false;
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        return response.ok;
    } catch (error) {
        console.error("Dictionary API error", error);
        return true;
    }
}

async function validateAnswers(answers, currentLetter) {
    elements.validationOverlay.classList.add('active');

    const sanitized = {
        name: answers.name.trim(),
        place: answers.place.trim(),
        movie: answers.movie.trim(),
        thing: answers.thing.trim()
    };

    const checkLetter = (str) => str.length >= 2 && str[0].toUpperCase() === currentLetter;

    const nameValid = checkLetter(sanitized.name);
    const movieValid = checkLetter(sanitized.movie);
    const placeValid = checkLetter(sanitized.place);

    let thingValid = false;
    if (checkLetter(sanitized.thing)) {
        thingValid = await checkDictionary(sanitized.thing);
    }

    elements.validationOverlay.classList.remove('active');

    return {
        name: { text: sanitized.name, valid: nameValid },
        place: { text: sanitized.place, valid: placeValid },
        movie: { text: sanitized.movie, valid: movieValid },
        thing: { text: sanitized.thing, valid: thingValid },
        allValid: nameValid && movieValid && placeValid && thingValid
    };
}

// --- Game Logic ---

function resetAllState() {
    gameState.players.forEach(p => {
        p.score = 0;
        p.time = 0;
        p.answers = null;
        p.letter = null;
        p.roundScore = 0;
        p.bonus = false;
    });
    gameState.currentRound = 1;
    gameState.currentPlayerIndex = 0;
    gameState.isGameActive = false;
    stopTimer();
}

function startGame() {
    gameState.players[0].name = elements.player1Name.value.trim() || 'Player 1';
    gameState.players[1].name = elements.player2Name.value.trim() || 'Player 2';
    resetAllState();

    elements.landingPage.classList.remove('active');
    elements.gamePage.classList.add('active');

    updateScoreUI();
    updateRoundUI();
    startTurn();
}

function startTurn() {
    const letter = getRandomLetter();
    gameState.players[gameState.currentPlayerIndex].letter = letter;

    updateTurnUI();
    updateLetterUI(letter);
    elements.gameForm.reset();

    setTimeout(() => elements.inputName.focus(), 300);
    startTimer(false);
    gameState.isGameActive = true;
}

function startTimer(resume) {
    if (!resume) {
        gameState.timeLeft = 60;
    }
    updateTimerDisplay();

    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        if (gameState.timeLeft <= 0) submitAnswer();
    }, 1000);
}

function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

function updateTimerDisplay() {
    elements.timerSeconds.textContent = gameState.timeLeft;
    const offset = 283 - (283 * (60 - gameState.timeLeft) / 60);
    elements.timerProgress.style.strokeDashoffset = offset;
}

async function submitAnswer(e) {
    if (e) e.preventDefault();
    if (!gameState.isGameActive) return;

    stopTimer();
    gameState.isGameActive = false;

    const playerIndex = gameState.currentPlayerIndex;
    const player = gameState.players[playerIndex];
    const currentLetter = player.letter;

    const rawAnswers = {
        name: elements.inputName.value,
        place: elements.inputPlace.value,
        movie: elements.inputMovie.value,
        thing: elements.inputThing.value
    };

    const results = await validateAnswers(rawAnswers, currentLetter);

    player.answers = results;
    player.time = 60 - gameState.timeLeft;
    player.roundScore = results.allValid ? 1 : 0;

    if (player.roundScore > 0) {
        player.score += player.roundScore;
    }

    updateScoreUI();

    if (gameState.currentPlayerIndex === 0) {
        showHandoff();
    } else {
        calculateRoundWinner();
        showRoundResults();
    }
}

// --- Handoff Screen ---

function showHandoff() {
    const nextPlayer = gameState.players[1];
    elements.handoffPlayerName.textContent = nextPlayer.name;
    elements.handoffOverlay.classList.add('active');
}

function onHandoffReady() {
    elements.handoffOverlay.classList.remove('active');
    gameState.currentPlayerIndex = 1;
    startTurn();
}

// --- Round Scoring ---

function calculateRoundWinner() {
    const p1 = gameState.players[0];
    const p2 = gameState.players[1];

    if (p1.roundScore > 0 && p2.roundScore > 0) {
        if (p1.time < p2.time) {
            p1.score += 1;
            p1.bonus = true;
        } else if (p2.time < p1.time) {
            p2.score += 1;
            p2.bonus = true;
        }
    }

    updateScoreUI();
}

// --- Results Display ---

function showRoundResults() {
    const p1 = gameState.players[0];
    const p2 = gameState.players[1];

    let html = '';
    html += createResultCard(p1, 0);
    html += createResultCard(p2, 1);

    const p1TotalThisRound = p1.roundScore + (p1.bonus ? 1 : 0);
    const p2TotalThisRound = p2.roundScore + (p2.bonus ? 1 : 0);

    let winnerClass = 'tie';
    let winnerText = 'This round is a tie!';

    if (p1TotalThisRound > p2TotalThisRound) {
        winnerClass = 'p1';
        winnerText = `${p1.name} wins this round!`;
    } else if (p2TotalThisRound > p1TotalThisRound) {
        winnerClass = 'p2';
        winnerText = `${p2.name} wins this round!`;
    }

    html += `<div class="winner-banner ${winnerClass}">${winnerText}</div>`;
    elements.resultsBody.innerHTML = html;

    if (gameState.currentRound >= gameState.maxRounds) {
        elements.nextRoundBtn.textContent = 'Final Results';
    } else {
        elements.nextRoundBtn.textContent = 'Next Round';
    }

    elements.resultsModal.classList.add('active');
}

function createResultCard(player, index) {
    const answers = player.answers;
    const playerClass = index === 0 ? 'p1' : 'p2';

    let answersHtml = '';
    const categories = ['name', 'place', 'movie', 'thing'];
    const labels = ['Name', 'Place', 'Movie', 'Thing'];

    categories.forEach((cat, i) => {
        const data = answers[cat];
        const displayClass = data.text ? '' : 'empty';
        const labelText = data.valid ? 'Valid' : 'Invalid';

        answersHtml += `
            <div class="answer-item ${data.valid ? 'valid' : 'invalid'}">
                <span class="answer-label">${labels[i]}</span>
                <span class="answer-value ${displayClass}">${data.text || 'Not filled'}</span>
                <span class="answer-status ${data.valid ? 'valid' : 'invalid'}">${labelText}</span>
            </div>
        `;
    });

    const bonusHtml = player.bonus ? '<span class="bonus-indicator">+1 Speed Bonus</span>' : '';
    const scoreText = `+${player.roundScore}`;

    return `
        <div class="result-card">
            <div class="result-player">
                <span class="result-player-name ${playerClass}">${player.name} (Letter: ${player.letter})</span>
                <span class="result-time">${player.time}s</span>
            </div>
            <div class="result-answers">
                ${answersHtml}
            </div>
            <div class="result-score ${playerClass}">
                <span>${scoreText}</span>
                ${bonusHtml}
            </div>
        </div>
    `;
}

// --- Round / Game Flow ---

function nextRound() {
    elements.resultsModal.classList.remove('active');

    if (gameState.currentRound >= gameState.maxRounds) {
        showGameOver();
        return;
    }

    gameState.currentRound++;
    gameState.currentPlayerIndex = 0;

    gameState.players.forEach(p => {
        p.answers = null;
        p.time = 0;
        p.letter = null;
        p.roundScore = 0;
        p.bonus = false;
    });

    updateRoundUI();
    setTimeout(startTurn, 300);
}

// --- Pause / Resume / Finish ---

function pauseGame() {
    stopTimer();
    gameState.isGameActive = false;
    elements.quitModal.classList.add('active');
}

function resumeGame() {
    elements.quitModal.classList.remove('active');
    gameState.isGameActive = true;
    startTimer(true);
}

function finishGame() {
    elements.quitModal.classList.remove('active');
    showGameOver();
}

// --- Game Over ---

function showGameOver() {
    const p1 = gameState.players[0];
    const p2 = gameState.players[1];

    let winnerClass = 'tie';
    let winnerText = "It's a tie game!";
    if (p1.score > p2.score) {
        winnerClass = 'p1';
        winnerText = `${p1.name} wins!`;
    } else if (p2.score > p1.score) {
        winnerClass = 'p2';
        winnerText = `${p2.name} wins!`;
    }

    elements.gameoverBody.innerHTML = `
        <div class="final-scores">
            <div class="result-card">
                <div class="result-player">
                    <span class="result-player-name p1">${p1.name}</span>
                    <span class="result-score p1">${p1.score} pts</span>
                </div>
            </div>
            <div class="result-card">
                <div class="result-player">
                    <span class="result-player-name p2">${p2.name}</span>
                    <span class="result-score p2">${p2.score} pts</span>
                </div>
            </div>
        </div>
        <div class="winner-banner ${winnerClass}">${winnerText}</div>
    `;
    elements.gameoverModal.classList.add('active');
}

function playAgain() {
    elements.gameoverModal.classList.remove('active');
    resetAllState();
    updateScoreUI();
    updateRoundUI();
    startTurn();
}

function goHome() {
    elements.gameoverModal.classList.remove('active');
    elements.resultsModal.classList.remove('active');
    elements.handoffOverlay.classList.remove('active');
    elements.quitModal.classList.remove('active');
    elements.validationOverlay.classList.remove('active');

    elements.gamePage.classList.remove('active');
    elements.landingPage.classList.add('active');

    resetAllState();
    elements.player1Name.value = '';
    elements.player2Name.value = '';
}

// --- UI Updates ---

function updateTurnUI() {
    const idx = gameState.currentPlayerIndex;
    const player = gameState.players[idx];
    const turn = idx === 0 ? 'p1' : 'p2';

    elements.turnPlayerName.textContent = player.name;
    elements.currentPlayerTurn.className = 'info-turn ' + (idx === 0 ? 'p1-turn' : 'p2-turn');

    // Set data-turn on BOTH game-info-bar (for letter/timer colors) and game-main (for input focus colors)
    elements.gameInfoBar.setAttribute('data-turn', turn);
    elements.gameMain.setAttribute('data-turn', turn);
}

function updateScoreUI() {
    elements.p1Score.textContent = gameState.players[0].score;
    elements.p2Score.textContent = gameState.players[1].score;
}

function updateRoundUI() {
    elements.roundNumber.textContent = gameState.currentRound;
}

function updateLetterUI(letter) {
    elements.currentLetter.textContent = letter;
    elements.currentLetter.style.animation = 'none';
    elements.currentLetter.offsetHeight;
    elements.currentLetter.style.animation = 'letterPulse 2s ease-in-out infinite';
}

// --- Event Listeners ---

function initEventListeners() {
    elements.playBtn.addEventListener('click', startGame);
    elements.rulesBtn.addEventListener('click', () => elements.rulesModal.classList.add('active'));
    elements.closeRules.addEventListener('click', () => elements.rulesModal.classList.remove('active'));
    elements.rulesModal.querySelector('.modal-backdrop').addEventListener('click', () => elements.rulesModal.classList.remove('active'));

    elements.gameForm.addEventListener('submit', submitAnswer);

    elements.handoffReadyBtn.addEventListener('click', onHandoffReady);

    elements.gameQuitBtn.addEventListener('click', pauseGame);
    elements.resumeBtn.addEventListener('click', resumeGame);
    elements.finishBtn.addEventListener('click', finishGame);
    elements.quitModal.querySelector('.modal-backdrop').addEventListener('click', resumeGame);

    elements.nextRoundBtn.addEventListener('click', nextRound);
    elements.quitBtn.addEventListener('click', () => {
        elements.resultsModal.classList.remove('active');
        showGameOver();
    });

    elements.playAgainBtn.addEventListener('click', playAgain);
    elements.homeBtn.addEventListener('click', goHome);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.quitModal.classList.contains('active')) {
                resumeGame();
            } else if (elements.rulesModal.classList.contains('active')) {
                elements.rulesModal.classList.remove('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initEventListeners);