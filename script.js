// Game variables
let gameBoard = [];
const boardCols = 8;
const boardRows = 5; // 8x5 board = 40 cells
let score = 0;
let timer;
let timeLeft = 60; // 60 seconds (1 minute)

let currentFactor1 = 0;
let currentFactor2 = 0;

// 1. GUARANTEED MATCHABLE PRODUCTS (Factors 2 through 12)
// This list contains 40 unique and duplicate products, all achievable by multiplying factors 2-12.
const baseProducts = [
    16, 18, 20, 21, 24, 25, 27, 28,
    30, 32, 35, 36, 40, 42, 45, 48, 
    49, 54, 56, 60, 63, 64, 66, 72, 
    77, 81, 84, 88, 96, 99, 100, 108,
    110, 120, 121, 132, 144, 100, 96, 88
];
const allProducts = [...baseProducts]; // Create a mutable copy

// --- Core Game Functions ---

// 2. GUARANTEED FACTOR GENERATION
function initializeFactors() {
    let productIsOnBoard = false;
    let targetProduct = 0;

    // Get all products currently displayed on the board that are NOT matched
    const unmatchedCells = Array.from(document.querySelectorAll('.cell:not(.matched)'));

    // Check if the board is completely cleared
    if (unmatchedCells.length === 0) {
        clearInterval(timer);
        alert(`Congratulations! You cleared the whole board! Final score: ${score}`);
        return;
    }

    // Pick a random unmatched product from the board to guarantee a solution
    const randomCell = unmatchedCells[Math.floor(Math.random() * unmatchedCells.length)];
    targetProduct = parseInt(randomCell.dataset.product);

    // Find a factor pair for the chosen product (simple approach)
    // We only care about factors up to 12
    for (let f1 = 2; f1 <= 12; f1++) {
        if (targetProduct % f1 === 0) {
            let f2 = targetProduct / f1;
            if (f2 >= 2 && f2 <= 12) {
                // Found a valid pair. Randomly assign them to factor 1 and 2.
                if (Math.random() < 0.5) {
                    currentFactor1 = f1;
                    currentFactor2 = f2;
                } else {
                    currentFactor1 = f2;
                    currentFactor2 = f1;
                }
                productIsOnBoard = true;
                break; // Exit the loop once a pair is found
            }
        }
    }

    // This block runs if a valid factor pair (2-12) was found
    if (productIsOnBoard) {
        document.getElementById('factor1').innerText = currentFactor1;
        document.getElementById('factor2').innerText = currentFactor2;
        updateMatchText(false);
    } else {
        // Fallback: If no 2-12 factor pair was found (e.g., if we still included a number like 237),
        // we call initializeFactors again until a viable product is chosen.
        // NOTE: With the updated baseProducts list, this shouldn't happen.
        initializeFactors();
    }
}

// 3. Handle cell click logic
function handleCellClick(event) {
    const cell = event.target;
    const productClicked = parseInt(cell.dataset.product);
    const requiredProduct = currentFactor1 * currentFactor2;

    // Do nothing if already matched
    if (cell.classList.contains('matched')) {
        return;
    }

    if (productClicked === requiredProduct) {
        // Correct Match!
        const colorClass = Math.random() < 0.5 ? 'p1' : 'p2';
        
        cell.classList.add('matched', colorClass, 'highlight');
        cell.onclick = null;

        score++;
        document.getElementById('score').innerText = score;
        updateMatchText(true, productClicked);

        // Remove the highlight after a small delay and generate new factors
        setTimeout(() => {
            cell.classList.remove('highlight');
            initializeFactors(); 
        }, 500); 

    } else {
        // Incorrect Match - brief flash of wrong color (p3 class must be defined in CSS)
        cell.classList.add('p3'); 
        setTimeout(() => {
            cell.classList.remove('p3');
        }, 200);
    }
}

// 4. Update the "Your Match" display (remains the same)
function updateMatchText(isMatched = false, product = 0) {
    const textElement = document.getElementById('match-text');
    if (isMatched) {
        textElement.innerHTML = `${currentFactor1} x ${currentFactor2} = ${product} <span class="star-icon">⭐</span>`;
    } else {
        textElement.innerText = `${currentFactor1} x ${currentFactor2} = ?`;
    }
}

// 5. Board Generation and Rendering (remains the same)
function initializeBoard() {
    shuffle(allProducts); 
    gameBoard = []; 

    const container = document.getElementById('game-container');
    container.innerHTML = ''; 
    
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

// 6. Timer, Shuffle, and Reset functions (remain the same)

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
    initializeFactors(); // Calls the new, guaranteed factor generator
    startTimer();
}

// Start the game when the page loads
resetGame();
