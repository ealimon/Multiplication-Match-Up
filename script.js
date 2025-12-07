// Game variables
let gameBoard = [];
const boardCols = 6; // CHANGED from 8
const boardRows = 6; // CHANGED from 5 (6x6 board = 36 cells)
let score = 0;
let timer;
let timeLeft = 60; 

let currentFactor1 = 0;
let currentFactor2 = 0;

// 1. UPDATED PRODUCTS LIST (36 products, guaranteed matchable with factors 2-12)
const baseProducts = [
    16, 18, 20, 21, 24, 25,
    27, 28, 30, 32, 35, 36, 
    40, 42, 45, 48, 49, 54, 
    56, 60, 63, 64, 66, 72, 
    77, 81, 84, 88, 96, 99, 
    100, 108, 121, 132, 144, 100 // Duplicate 100 to fill the 36 slots
];
const allProducts = [...baseProducts]; 

// --- Core Game Functions ---

// 2. GUARANTEED FACTOR GENERATION (No change to logic, just uses new board size)
function initializeFactors() {
    let productIsOnBoard = false;
    let targetProduct = 0;

    const unmatchedCells = Array.from(document.querySelectorAll('.cell:not(.matched)'));

    if (unmatchedCells.length === 0) {
        clearInterval(timer);
        alert(`Congratulations! You cleared the whole board! Final score: ${score}`);
        return;
    }

    const randomCell = unmatchedCells[Math.floor(Math.random() * unmatchedCells.length)];
    targetProduct = parseInt(randomCell.dataset.product);

    for (let f1 = 2; f1 <= 12; f1++) {
        if (targetProduct % f1 === 0) {
            let f2 = targetProduct / f1;
            if (f2 >= 2 && f2 <= 12) {
                if (Math.random() < 0.5) {
                    currentFactor1 = f1;
                    currentFactor2 = f2;
                } else {
                    currentFactor1 = f2;
                    currentFactor2 = f1;
                }
                productIsOnBoard = true;
                break;
            }
        }
    }

    if (productIsOnBoard) {
        document.getElementById('factor1').innerText = currentFactor1;
        document.getElementById('factor2').innerText = currentFactor2;
        updateMatchText(false);
    } else {
        // Fallback for extremely rare edge cases
        initializeFactors();
    }
}

// 3. Handle cell click logic (No changes needed)
function handleCellClick(event) {
    const cell = event.target;
    const productClicked = parseInt(cell.dataset.product);
    const requiredProduct = currentFactor1 * currentFactor2;

    if (cell.classList.contains('matched')) {
        return;
    }

    if (productClicked === requiredProduct) {
        const colorClass = Math.random() < 0.5 ? 'p1' : 'p2';
        
        cell.classList.add('matched', colorClass, 'highlight');
        cell.onclick = null;

        score++;
        document.getElementById('score').innerText = score;
        updateMatchText(true, productClicked);

        setTimeout(() => {
            cell.classList.remove('highlight');
            initializeFactors(); 
        }, 500); 

    } else {
        cell.classList.add('p3'); 
        setTimeout(() => {
            cell.classList.remove('p3');
        }, 200);
    }
}

// 4. Update the "Your Match" display (No changes needed)
function updateMatchText(isMatched = false, product = 0) {
    const textElement = document.getElementById('match-text');
    if (isMatched) {
        textElement.innerHTML = `${currentFactor1} x ${currentFactor2} = ${product} <span class="star-icon">⭐</span>`;
    } else {
        textElement.innerText = `${currentFactor1} x ${currentFactor2} = ?`;
    }
}

// 5. Board Generation and Rendering
function initializeBoard() {
    shuffle(allProducts); 
    gameBoard = []; 

    const container = document.getElementById('game-container');
    container.innerHTML = ''; 
    
    // Iterates 36 times for the 6x6 grid
    for (let i = 0; i < boardCols * boardRows; i++) {
        const product = allProducts[i % allProducts.length];
        
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.product = product;
        cell.innerText = product;
        cell.onclick = handleCellClick;
        container.appendChild(cell);
    }
}

// 6. Timer, Shuffle, and Reset functions (No changes needed)

function startTimer() {
    clearInterval(timer); 
    timeLeft = 60; 
    document.getElementById('time-left').innerText = formatTime(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! Game Over. Your final score is: ${score}`);
            document.querySelectorAll('.cell').forEach(c => c.onclick = null);
        }
    }, 1000);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetGame() {
    score = 0;
    document.getElementById('score').innerText = score;
    initializeBoard();
    initializeFactors();
    startTimer();
}

// Start the game when the page loads
resetGame();
