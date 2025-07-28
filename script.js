const board = document.getElementById("sudoku-grid");
let userFilledCells = []; // To track user-filled cells

function createGrid() {
  // Clear any previous grid
  board.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    // Create a new row for the grid
    const tr = document.createElement("div");
    tr.classList.add("row");

    userFilledCells[row] = []; // Initialize each row

    for (let col = 0; col < 9; col++) {
      const td = document.createElement("div");
      td.classList.add("cell");

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;

      input.addEventListener("input", function() {
        // Mark as a user-filled cell when the user inputs a value
        input.classList.add("user-filled");
        userFilledCells[row][col] = true; // Track that this cell was filled by the user
      });

      td.appendChild(input);
      tr.appendChild(td);
    }

    // Add the row to the grid
    board.appendChild(tr);
  }
}

// Call createGrid immediately on load
createGrid();

// Function to get the current grid values
function getGrid() {
  const grid = [];
  const rows = board.getElementsByClassName("row");

  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    const cells = rows[i].getElementsByClassName("cell");
    for (let j = 0; j < 9; j++) {
      const val = cells[j].firstChild.value;
      grid[i][j] = val === "" ? 0 : parseInt(val);
    }
  }
  return grid;
}

// Function to set the grid values
function setGrid(grid) {
  const rows = board.getElementsByClassName("row");

  for (let i = 0; i < 9; i++) {
    const cells = rows[i].getElementsByClassName("cell");
    for (let j = 0; j < 9; j++) {
      const inputCell = cells[j].firstChild;
      inputCell.value = grid[i][j] !== 0 ? grid[i][j] : "";
      // Mark the solved cells
      if (grid[i][j] !== 0 && !userFilledCells[i][j]) {
        inputCell.classList.add("solved");
      }
    }
  }
}

// Function to solve the Sudoku
function solve(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Function to check if a number is valid in the given row and column
function isValid(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

// Function to solve the Sudoku on button click
function solveSudoku() {
  const grid = getGrid();
  if (solve(grid)) {
    setGrid(grid);
    alert("Solved!");
  } else {
    alert("No solution found.");
  }
}

// Keyboard Controls for shifting cells
document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") {
    shiftTop();
  } else if (event.key === "ArrowDown") {
    shiftBottom();
  } else if (event.key === "ArrowLeft") {
    shiftLeft();
  } else if (event.key === "ArrowRight") {
    shiftRight();
  }
});

// Shifting Functions
function shiftTop() {
  const grid = getGrid();
  for (let col = 0; col < 9; col++) {
    // Shift each column up
    const firstValue = grid[0][col];
    for (let row = 0; row < 8; row++) {
      grid[row][col] = grid[row + 1][col];
    }
    grid[8][col] = firstValue; // Move the first value to the bottom
  }
  setGrid(grid);
}

function shiftBottom() {
  const grid = getGrid();
  for (let col = 0; col < 9; col++) {
    // Shift each column down
    const lastValue = grid[8][col];
    for (let row = 8; row > 0; row--) {
      grid[row][col] = grid[row - 1][col];
    }
    grid[0][col] = lastValue; // Move the last value to the top
  }
  setGrid(grid);
}

function shiftLeft() {
  const grid = getGrid();
  for (let row = 0; row < 9; row++) {
    // Shift each row left
    const firstValue = grid[row][0];
    for (let col = 0; col < 8; col++) {
      grid[row][col] = grid[row][col + 1];
    }
    grid[row][8] = firstValue; // Move the first value to the right
  }
  setGrid(grid);
}

function shiftRight() {
  const grid = getGrid();
  for (let row = 0; row < 9; row++) {
    // Shift each row right
    const lastValue = grid[row][8];
    for (let col = 8; col > 0; col--) {
      grid[row][col] = grid[row][col - 1];
    }
    grid[row][0] = lastValue; // Move the last value to the left
  }
  setGrid(grid);
}
