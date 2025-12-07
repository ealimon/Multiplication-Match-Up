// Game variables
let gameBoard = [];
const boardCols = 8;
const boardRows = 5; // 8x5 board = 40 cells
let score = 0;
let timer;
let timeLeft = 60; // 60 seconds (1 minute)

let currentFactor1 = 0;
let currentFactor2 = 0;

// Set of products (e.g., facts up to 12x12, and some larger)
const baseProducts = [
    36, 42, 48, 54, 70, 60, 98, 
    64, 72, 80, 90, 108, 104, 136, 140,
    100, 121, 132, 143, 140, 100, 150, 70,
    144, 156, 156, 185, 192, 165, 176, 188,
    169, 182, 195, 185, 221, 234, 237, 260
];
const allProducts = [...baseProducts]; // Create a mutable copy

// --- Core Game Functions ---

// 1. Initialize factors and start the game
function initializeFactors() {
    currentFactor1 = Math.floor(Math.random() * 11) + 2; // 2 through 12
    currentFactor2 = Math.floor(Math.random() * 11) + 2; // 2 through 12
    document.getElementById('factor1').innerText = currentFactor1;
    document.getElementById('factor2').innerText = currentFactor2;
    updateMatchText();
}

// 2. Update the "Your Match" display
function updateMatchText(isMatched = false, product = 0) {
    const textElement = document.getElementById('match-text');
    if (isMatched) {
        textElement.innerHTML = `${currentFactor1} x ${currentFactor2} = ${product} <span class="star-icon"></span>`;
    } else {
        textElement.innerText = `${currentFactor1} x ${currentFactor2} = ?`;
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
        cell.classList.add('matched', 'p1'); // Apply the matched styling
        cell.classList.remove('p2'); // Ensure clean class state
        cell.onclick = null; // Disable further clicks on this cell

        score++;
        document.getElementById('score').innerText = score;
        updateMatchText(true, productClicked);

        // Generate new factors for the next turn
        setTimeout(initializeFactors, 500); // Small delay for visual feedback
    } else {
        // Incorrect Match - brief flash of wrong color
        cell.classList.add('p2'); 
        setTimeout(() => {
            cell.classList.remove('p2');
        }, 200);
    }
}

// 4. Board Generation and Rendering
function initializeBoard() {
    shuffle(allProducts); // Ensure board is randomized
    gameBoard = []; // Reset the logic board

    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear existing board
    
    // Fill the 40 cells
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

// 5. Start the countdown timer
function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 60; // Reset time
    document.getElementById('time-left').innerText = formatTime(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! Game Over. Your final score is: ${score}`);
            document.querySelectorAll('.cell').forEach(c => c.onclick = null); // Disable board
        }
    }, 1000);
}

// 6. Utility to format time (M:SS)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 7. Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 8. Main Reset Function
function resetGame() {
    score = 0;
    document.getElementById('score').innerText = score;
    initializeBoard();
    initializeFactors();
    startTimer();
}


// Start the game when the page loads
resetGame();
