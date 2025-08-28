const board = document.getElementById("sudoku-grid");
let userFilledCells = []; // To track user-filled cells

function createGrid() {
  // Clear any previous grid
  board.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    userFilledCells[row] = [];

    for (let col = 0; col < 9; col++) {
      const td = document.createElement("div");
      td.classList.add("cell");

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;
      input.setAttribute("data-row", row);
      input.setAttribute("data-col", col);

      // Restrict input to 1-9 and track user input
      input.addEventListener("input", function() {
        const val = input.value;
        if (val === "") {
          userFilledCells[row][col] = false;
          input.classList.remove("user-filled");
          return;
        }
        const num = parseInt(val);
        if (isNaN(num) || num < 1 || num > 9) {
          input.value = "";
          userFilledCells[row][col] = false;
          input.classList.remove("user-filled");
        } else {
          input.classList.add("user-filled");
          userFilledCells[row][col] = true;
        }
      });

      // Prevent invalid characters like 'e', '+', '-'
      input.addEventListener("keydown", function(e) {
        if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();

        // Arrow key navigation between cells
        const row = parseInt(this.getAttribute("data-row"));
        const col = parseInt(this.getAttribute("data-col"));

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          let newRow = row, newCol = col;

          if (e.key === "ArrowUp" && row > 0) newRow--;
          if (e.key === "ArrowDown" && row < 8) newRow++;
          if (e.key === "ArrowLeft" && col > 0) newCol--;
          if (e.key === "ArrowRight" && col < 8) newCol++;

          const nextInput = document.querySelector(`input[data-row="${newRow}"][data-col="${newCol}"]`);
          if (nextInput) nextInput.focus();
        }
      });

      td.appendChild(input);
      board.appendChild(td);
    }
  }
}

// Call createGrid immediately on load
createGrid();

// Function to get the current grid values
function getGrid() {
  const grid = [];
  const cells = board.getElementsByClassName("cell");

  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      const input = cells[i * 9 + j].firstChild;
      const val = input.value;
      grid[i][j] = val === "" ? 0 : parseInt(val);
    }
  }
  return grid;
}

// Function to set the grid values
function setGrid(grid) {
  const cells = board.getElementsByClassName("cell");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const inputCell = cells[i * 9 + j].firstChild;
      inputCell.value = grid[i][j] !== 0 ? grid[i][j] : "";
      // Mark solved cells if they were not user filled
      if (grid[i][j] !== 0 && !userFilledCells[i][j]) {
        inputCell.classList.add("solved");
      }
    }
  }
}

// Solve functions (unchanged)...

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

function solveSudoku() {
  const grid = getGrid();
  if (solve(grid)) {
    setGrid(grid);
    alert("Solved!");
  } else {
    alert("No solution found.");
  }
}
