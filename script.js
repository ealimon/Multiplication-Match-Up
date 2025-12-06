// Game variables
let gameBoard = [];
const boardSize = 5; // For a 5x5 board
let currentPlayer = 1; 

// A simple set of multiplication products for a 5x5 board (e.g., facts x6, x7, x8)
// You would customize this array for each of your 35 games.
const possibleProducts = [
    36, 42, 48, 54, 60,
    49, 56, 63, 70, 77,
    64, 72, 80, 88, 96,
    81, 90, 99, 108, 121,
    100, 110, 132, 144, 156 
];

// Helper function to shuffle an array (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 1. Initialize the board with shuffled products and render it
function initializeBoard() {
    shuffle(possibleProducts);
    gameBoard = []; // Reset the logic board

    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear existing board

    for (let i = 0; i < boardSize * boardSize; i++) {
        const product = possibleProducts[i % possibleProducts.length];
        gameBoard.push({ product: product, coveredBy: 0 }); // 0=uncovered
        
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.dataset.product = product;
        cell.innerText = product;
        cell.onclick = handleCellClick;
        container.appendChild(cell);
    }
    updateInstructions();
}

// 2. Main game loop function when a cell is clicked
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);
    
    // Check if the cell is already covered
    if (gameBoard[index].coveredBy !== 0) {
        alert("This space is already covered! Try another product.");
        return;
    }

    // --- GAME LOGIC START ---
    // Instead of simple click, you'd need an input system here.
    // For this example, let's assume the user has to input the correct factors for the product clicked.
    
    const requiredProduct = gameBoard[index].product;
    
    // For a simple web version: use a prompt for the required skill
    let inputFactors = prompt(`Player ${currentPlayer}, what is the multiplication problem that results in ${requiredProduct}? (e.g., '6x7')`);

    if (!inputFactors) return; // User cancelled

    // Simple factor validation (You'd need more robust validation for production)
    const [factor1, factor2] = inputFactors.toLowerCase().split(/[x\*]/).map(f => parseInt(f.trim()));

    if (isNaN(factor1) || isNaN(factor2) || (factor1 * factor2) !== requiredProduct) {
        alert("Incorrect multiplication problem. Try again!");
        return;
    }

    // If correct, cover the cell
    gameBoard[index].coveredBy = currentPlayer;
    cell.classList.add(`player${currentPlayer}`);
    cell.onclick = null; // Disable further clicks

    // --- WIN CONDITION CHECK (You would add a detailed check function here) ---
    // Check if the current player won (e.g., 4 in a row, like Tic-Tac-Toe/Bingo)
    if (checkWin(index)) {
        document.getElementById('instructions').innerText = `🎉 Player ${currentPlayer} WINS! 🎉`;
        document.querySelectorAll('.cell').forEach(c => c.onclick = null); // End the game
        return;
    }
    
    // Switch turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateInstructions();
}

// 3. Simple win condition placeholder (needs a lot more detail for a real game)
function checkWin(lastIndex) {
    // This function would be complex (checking rows, columns, and diagonals).
    // For a minimal example, we'll skip the full check.
    // Replace this with a robust algorithm.
    return false; 
}

// 4. Update the turn text
function updateInstructions() {
    document.getElementById('instructions').innerText = `Player ${currentPlayer}'s Turn. Find the factors for one of the products below!`;
}

// 5. Reset the game
function resetGame() {
    currentPlayer = 1;
    initializeBoard();
}

// Start the game when the page loads
initializeBoard();
