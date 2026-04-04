// Game State
let gridSize = 3;
let winCondition = 3;
let board = [];
let currentPlayer = 1;
let gameActive = false;
let scores = { player1: 0, player2: 0 };
let playerNames = { player1: 'Player 1', player2: 'Player 2' };
let winningCells = [];

// DOM Elements
const landingPage = document.getElementById('landing-page');
const gamePage = document.getElementById('game-page');
const rulesModal = document.getElementById('rules-modal');
const finishModal = document.getElementById('finish-modal');
const gameoverModal = document.getElementById('gameover-modal');
const gameGrid = document.getElementById('game-grid');

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGridSelection();
    initButtons();
});

// Grid Selection
function initGridSelection() {
    const gridOptions = document.querySelectorAll('.grid-option');
    gridOptions.forEach(option => {
        option.addEventListener('click', () => {
            gridOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            gridSize = parseInt(option.dataset.size);
            winCondition = gridSize === 3 ? 3 : gridSize === 5 ? 4 : 5;
        });
    });
}

// Button Event Listeners
function initButtons() {
    // Start Game
    document.getElementById('start-btn').addEventListener('click', startGame);
    
    // Rules
    document.getElementById('rules-btn').addEventListener('click', () => {
        rulesModal.classList.add('active');
    });
    
    document.getElementById('close-rules').addEventListener('click', () => {
        rulesModal.classList.remove('active');
    });
    
    // Finish Game
    document.getElementById('finish-btn').addEventListener('click', () => {
        showFinishModal();
    });
    
    // Finish Modal Buttons
    document.getElementById('resume-btn').addEventListener('click', () => {
        finishModal.classList.remove('active');
    });
    
    document.getElementById('new-game-btn').addEventListener('click', () => {
        finishModal.classList.remove('active');
        goToLanding();
    });
    
    document.getElementById('quit-btn').addEventListener('click', quitGame);
    
    // Game Over Modal Buttons
    document.getElementById('play-again-btn').addEventListener('click', () => {
        gameoverModal.classList.remove('active');
        resetBoard();
    });
    
    document.getElementById('gameover-new-btn').addEventListener('click', () => {
        gameoverModal.classList.remove('active');
        goToLanding();
    });
    
    document.getElementById('gameover-quit-btn').addEventListener('click', quitGame);

    // 🔙 BACK BUTTON (NEW)
    document.getElementById('back-btn').addEventListener('click', () => {
        if (confirm("Go back? Current game will be lost.")) {
            goToLanding();
        }
    });
    
    // Close modals on outside click
    [rulesModal, finishModal, gameoverModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Start Game
function startGame() {
    const p1Input = document.getElementById('player1-name').value.trim();
    const p2Input = document.getElementById('player2-name').value.trim();
    
    playerNames.player1 = p1Input || 'Player 1';
    playerNames.player2 = p2Input || 'Player 2';
    
    document.getElementById('p1-name-display').textContent = playerNames.player1;
    document.getElementById('p2-name-display').textContent = playerNames.player2;
    
    scores = { player1: 0, player2: 0 };
    updateScoreDisplay();
    
    landingPage.classList.remove('active');
    gamePage.classList.add('active');
    
    initBoard();
}

// Initialize Board
function initBoard() {
    board = [];
    currentPlayer = 1;
    gameActive = true;
    winningCells = [];
    
    for (let i = 0; i < gridSize; i++) {
        board[i] = [];
        for (let j = 0; j < gridSize; j++) {
            board[i][j] = '';
        }
    }
    
    renderGrid();
    updateTurnIndicator();
}

// Render Grid
function renderGrid() {
    gameGrid.innerHTML = '';
    gameGrid.className = 'game-grid size-' + gridSize;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', () => handleCellClick(i, j, cell));
            
            gameGrid.appendChild(cell);
        }
    }
}

// Handle Cell Click
function handleCellClick(row, col, cell) {
    if (!gameActive || board[row][col] !== '') return;
    
    board[row][col] = currentPlayer === 1 ? 'X' : 'O';
    cell.textContent = board[row][col];
    cell.classList.add('taken', currentPlayer === 1 ? 'x' : 'o', 'animate-in');
    
    const winner = checkWinner(row, col);
    
    if (winner) {
        gameActive = false;
        highlightWinningCells();
        
        if (winner === 'X') {
            scores.player1++;
        } else {
            scores.player2++;
        }
        updateScoreDisplay();
        
        setTimeout(() => {
            showGameOverModal(winner);
        }, 800);
    } else if (isBoardFull()) {
        gameActive = false;
        setTimeout(() => {
            showTieModal();
        }, 300);
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnIndicator();
    }
}

// Check Winner
function checkWinner(row, col) {
    const symbol = board[row][col];
    const directions = [
        [[0, 1], [0, -1]],
        [[1, 0], [-1, 0]],
        [[1, 1], [-1, -1]],
        [[1, -1], [-1, 1]]
    ];
    
    for (const dir of directions) {
        let count = 1;
        let cells = [[row, col]];
        
        for (const [dr, dc] of dir) {
            let r = row + dr;
            let c = col + dc;
            
            while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === symbol) {
                count++;
                cells.push([r, c]);
                r += dr;
                c += dc;
            }
        }
        
        if (count >= winCondition) {
            winningCells = cells;
            return symbol;
        }
    }
    
    return null;
}

// Highlight Winning Cells
function highlightWinningCells() {
    const cells = document.querySelectorAll('.cell');
    winningCells.forEach(([row, col]) => {
        const index = row * gridSize + col;
        cells[index].classList.add('winning');
    });
}

// Check if Board is Full
function isBoardFull() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === '') return false;
        }
    }
    return true;
}

// Update Turn Indicator
function updateTurnIndicator() {
    const indicator = document.getElementById('current-player-indicator');
    const text = document.getElementById('turn-text');
    
    indicator.className = 'player-indicator ' + (currentPlayer === 1 ? 'cyan-bg' : 'coral-bg');
    text.textContent = `${currentPlayer === 1 ? playerNames.player1 : playerNames.player2}'s Turn`;
}

// Update Score Display
function updateScoreDisplay() {
    document.getElementById('p1-score').textContent = scores.player1;
    document.getElementById('p2-score').textContent = scores.player2;
}

// Reset Board
function resetBoard() {
    initBoard();
}

// 🔥 IMPROVED Go to Landing
function goToLanding() {
    gameActive = false;
    board = [];
    winningCells = [];

    gamePage.classList.remove('active');
    landingPage.classList.add('active');
}

// Quit Game
function quitGame() {
    window.close();
    setTimeout(() => {
        alert('Please close this tab manually to quit the game.');
    }, 100);
}

// Show Finish Modal
function showFinishModal() {
    document.getElementById('modal-title').textContent = 'Finish Game?';
    document.getElementById('modal-message').textContent = 'Are you sure you want to end the current game?';
    
    document.getElementById('resume-btn').style.display = 'block';
    
    finishModal.classList.add('active');
}

// Show Game Over Modal
function showGameOverModal(winner) {
    const winnerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
    document.getElementById('gameover-title').textContent = 'Victory!';
    document.getElementById('gameover-message').textContent = `${winnerName} wins this round!`;
    gameoverModal.classList.add('active');
}

// Show Tie Modal
function showTieModal() {
    document.getElementById('gameover-title').textContent = 'It\'s a Tie!';
    document.getElementById('gameover-message').textContent = 'No winner this round. Try again!';
    gameoverModal.classList.add('active');
}